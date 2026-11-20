import mongoose from "mongoose";
import { config } from "../../configs/config.js";
import Order from "../order/order.model.js";
import Cart from "../cart/cart.model.js";
import { getEffectiveItemPrice } from "../order/order.pricing.js";
import { notifyOrderPlacedSvc } from "../order/order.notifications.js";
import { getStripe } from "./stripe.client.js";

const CHECKOUT_SESSION_TTL_SECONDS = 60 * 60; // Stripe allows 30 min – 24 h

const toMinorUnits = (amount) => Math.round(Number(amount || 0) * 100);

const isHttpsUrl = (url) =>
  typeof url === "string" && url.startsWith("https://") && url.length <= 2048;

const isEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const getOrderIdFromSession = (session) => {
  const orderId = session?.metadata?.orderId || session?.client_reference_id;
  return mongoose.isValidObjectId(orderId) ? String(orderId) : null;
};

/**
 * Builds Stripe line items from an order that was priced on the server.
 * Falls back to a single "order total" line if per-item rounding would make
 * Stripe's total differ from the order's finalPrice by even one paisa.
 */
export const buildLineItems = (order, currency) => {
  const items = Array.isArray(order.order_items) ? order.order_items : [];
  const lineItems = [];

  for (const item of items) {
    const unitAmount = toMinorUnits(getEffectiveItemPrice(item));
    const quantity = Number(item.product_qty) || 0;
    if (unitAmount <= 0 || quantity < 1) continue;

    const weightType =
      item.product_weight_type && item.product_weight_type !== "none"
        ? ` ${item.product_weight_type}`
        : "";
    const description = item.product_weight
      ? `Weight: ${item.product_weight}${weightType}`
      : undefined;

    lineItems.push({
      price_data: {
        currency,
        unit_amount: unitAmount,
        product_data: {
          name: String(item.product_name || "Grocery item").slice(0, 250),
          ...(description ? { description } : {}),
          ...(isHttpsUrl(item.product_url) ? { images: [item.product_url] } : {}),
        },
      },
      quantity,
    });
  }

  const deliveryCharge = toMinorUnits(order.price_detail?.deliveryCharge);
  if (deliveryCharge > 0) {
    lineItems.push({
      price_data: {
        currency,
        unit_amount: deliveryCharge,
        product_data: { name: "Delivery charge" },
      },
      quantity: 1,
    });
  }

  const taxPrice = toMinorUnits(order.price_detail?.taxPrice);
  if (taxPrice > 0) {
    lineItems.push({
      price_data: {
        currency,
        unit_amount: taxPrice,
        product_data: { name: "GST & taxes" },
      },
      quantity: 1,
    });
  }

  const expectedTotal = toMinorUnits(order.price_detail?.finalPrice);
  const lineItemsTotal = lineItems.reduce(
    (sum, li) => sum + li.price_data.unit_amount * li.quantity,
    0,
  );

  if (expectedTotal > 0 && lineItemsTotal !== expectedTotal) {
    return [
      {
        price_data: {
          currency,
          unit_amount: expectedTotal,
          product_data: {
            name: `Novexa order #${order._id.toString().slice(-6).toUpperCase()}`,
            description: `${items.length} item(s) from ${order.store_name || "store"}`,
          },
        },
        quantity: 1,
      },
    ];
  }

  return lineItems;
};

/**
 * Creates (or re-uses) a Stripe Checkout Session for an order that is
 * awaiting online payment.
 */
export const createCheckoutSessionForOrder = async (order, clientUrl) => {
  const stripe = getStripe();
  const orderId = order._id.toString();

  // Re-use a still-open session for the same order (double clicks / retries)
  if (order.stripe_session_id) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
      if (existing.status === "open" && existing.url) return existing;
    } catch (error) {
      if (error?.code !== "resource_missing") throw error;
    }
  }

  const currency = config.stripe.currency;
  const lineItems = buildLineItems(order, currency);
  if (lineItems.length === 0) {
    const error = new Error("This order has no payable items.");
    error.status = 400;
    throw error;
  }

  const metadata = {
    orderId,
    customerId: order.customer_id ? String(order.customer_id) : "",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${clientUrl}/payment/cancel?order_id=${orderId}`,
    client_reference_id: orderId,
    ...(isEmail(order.customer_email) ? { customer_email: order.customer_email } : {}),
    metadata,
    payment_intent_data: {
      metadata,
      description: `Novexa order #${orderId.slice(-6).toUpperCase()}`,
    },
    expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_TTL_SECONDS,
  });

  await Order.updateOne({ _id: order._id }, { $set: { stripe_session_id: session.id } });
  return session;
};

/**
 * Marks the order linked to a paid Checkout Session as paid. Idempotent:
 * safe to call from both the success page and the webhook. Cart clearing and
 * notifications only happen on the first transition to "paid".
 */
export const markOrderPaidFromSession = async (session) => {
  const orderId = getOrderIdFromSession(session);
  if (!orderId) return null;
  if (session.payment_status !== "paid") return Order.findById(orderId);

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const paymentFields = {
    payment_status: "paid",
    paid_at: new Date(),
    stripe_session_id: session.id,
    stripe_payment_id: paymentIntentId || session.id,
  };

  // Normal case: order was waiting for payment (or was cancelled while the
  // customer was still paying) -> hand it to the seller as a fresh order.
  const released = await Order.findOneAndUpdate(
    {
      _id: orderId,
      payment_status: { $ne: "paid" },
      order_status: { $in: ["awaiting_payment", "cancelled"] },
    },
    { $set: { ...paymentFields, order_status: "pending" } },
    { returnDocument: "after" },
  );

  if (released) {
    const orderedProductIds = (released.order_items || [])
      .map((item) => item?._id)
      .filter(Boolean);
    try {
      await Cart.deleteMany({
        customer_id: released.customer_id,
        product_id: { $in: orderedProductIds },
      });
    } catch (error) {
      console.error("Failed to clear cart after payment:", error);
    }
    await notifyOrderPlacedSvc(released, { paidOnline: true });
    return released;
  }

  // Older orders (created before the awaiting_payment flow) just get the
  // payment fields; their status is left untouched.
  const updated = await Order.findOneAndUpdate(
    { _id: orderId, payment_status: { $ne: "paid" } },
    { $set: paymentFields },
    { returnDocument: "after" },
  );

  return updated || Order.findById(orderId);
};

/**
 * Cancels an order whose online payment was abandoned/failed. Only touches
 * orders still awaiting payment, and (when given) only if the session is the
 * order's current one, so an old expired session can't cancel a newer one.
 */
export const markOrderPaymentCancelled = async (
  orderId,
  { sessionId = null, failed = false } = {},
) => {
  if (!mongoose.isValidObjectId(orderId)) return null;
  const filter = {
    _id: orderId,
    order_status: "awaiting_payment",
    payment_status: { $nin: ["paid", "refunded"] },
  };
  if (sessionId) filter.stripe_session_id = sessionId;

  return Order.findOneAndUpdate(
    filter,
    {
      $set: {
        order_status: "cancelled",
        payment_status: failed ? "failed" : "cancelled",
      },
    },
    { returnDocument: "after" },
  );
};

/**
 * Customer left Stripe Checkout without paying. Expires the Stripe session so
 * it can't be paid later, then cancels the order. If the payment actually went
 * through in the meantime, the order is marked paid instead.
 *
 * @returns {Promise<{ paid: boolean, cancelled: boolean, order: object|null }>}
 */
export const cancelAwaitingPaymentOrder = async (order) => {
  if (order.payment_status === "paid") {
    return { paid: true, cancelled: false, order };
  }
  if (order.order_status !== "awaiting_payment") {
    return { paid: false, cancelled: order.order_status === "cancelled", order };
  }

  const stripe = getStripe();
  if (stripe && order.stripe_session_id) {
    const retrieve = () =>
      stripe.checkout.sessions.retrieve(order.stripe_session_id).catch(() => null);

    let session = await retrieve();
    if (session?.status === "open") {
      try {
        session = await stripe.checkout.sessions.expire(order.stripe_session_id);
      } catch {
        // The session may have completed a moment ago — re-check below.
        session = await retrieve();
      }
    }

    if (session?.payment_status === "paid") {
      const paidOrder = await markOrderPaidFromSession(session);
      return { paid: true, cancelled: false, order: paidOrder };
    }
  }

  const cancelled = await markOrderPaymentCancelled(order._id);
  return { paid: false, cancelled: true, order: cancelled || order };
};

/**
 * Settles a customer's earlier online orders that are still awaiting payment
 * (e.g. they used the browser back button on Stripe, or closed the tab after
 * paying). Paid ones are confirmed; unpaid ones are expired and cancelled.
 */
export const reconcileAwaitingPaymentOrders = async (customerId) => {
  if (!mongoose.isValidObjectId(customerId)) return;
  const staleOrders = await Order.find({
    customer_id: customerId,
    order_status: "awaiting_payment",
  }).limit(10);

  for (const order of staleOrders) {
    try {
      await cancelAwaitingPaymentOrder(order);
    } catch (error) {
      console.error(`Failed to reconcile order ${order._id}:`, error);
    }
  }
};
