import mongoose from "mongoose";
import { config } from "../../configs/config.js";
import Order from "../order/order.model.js";
import { isAllowedClientOrigin } from "../../utils/origin.js";
import { getStripe } from "./stripe.client.js";
import {
  createCheckoutSessionForOrder,
  markOrderPaidFromSession,
  markOrderPaymentCancelled,
  cancelAwaitingPaymentOrder,
  getOrderIdFromSession,
} from "./stripe.service.js";

const STRIPE_NOT_CONFIGURED_MESSAGE =
  "Online payment is not available right now: STRIPE_SECRET_KEY is missing or invalid on the server. Please use Cash on Delivery.";

const sendStripeError = (res, error, fallbackMessage) => {
  console.error(`${fallbackMessage}:`, error?.message || error);

  if (error?.status === 400) {
    return res.status(400).json({ success: false, message: error.message });
  }

  switch (error?.type) {
    // e.g. amount below Stripe's minimum, unsupported currency, bad params
    case "StripeInvalidRequestError":
      return res.status(400).json({ success: false, message: error.message });
    case "StripeAuthenticationError":
    case "StripePermissionError":
      return res.status(503).json({
        success: false,
        message:
          "Online payment is not available right now: the server's Stripe API key was rejected. Please use Cash on Delivery.",
      });
    case "StripeConnectionError":
    case "StripeAPIError":
    case "StripeRateLimitError":
      return res.status(502).json({
        success: false,
        message: "Could not reach Stripe. Please try again in a moment.",
      });
    default:
      return res.status(500).json({ success: false, message: fallbackMessage });
  }
};

const toPublicOrder = (order) =>
  order
    ? {
        _id: order._id,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        store_name: order.store_name,
        price_detail: order.price_detail,
      }
    : null;

/** POST /api/payment/create-checkout-session  { orderId } (auth required) */
export const handleCreateCheckout = async (req, res) => {
  try {
    if (!getStripe()) {
      return res.status(503).json({ success: false, message: STRIPE_NOT_CONFIGURED_MESSAGE });
    }

    const { orderId } = req.body || {};
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ success: false, message: "A valid orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (String(order.customer_id) !== String(req.user?.sub)) {
      return res.status(403).json({ success: false, message: "You can only pay for your own orders" });
    }
    if (order.payment_method !== "online") {
      return res.status(400).json({ success: false, message: "This order is not set up for online payment" });
    }
    if (order.payment_status === "paid") {
      return res.status(409).json({ success: false, message: "This order has already been paid" });
    }
    if (order.order_status !== "awaiting_payment") {
      return res.status(409).json({
        success: false,
        message: "This order can no longer be paid online. Please place a new order.",
      });
    }

    const origin = req.get("origin");
    const clientUrl = isAllowedClientOrigin(origin) ? origin : config.stripe.clientUrl;

    const session = await createCheckoutSessionForOrder(order, clientUrl);

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    return sendStripeError(res, error, "Unable to start online payment");
  }
};

/** GET /api/payment/verify-session/:sessionId */
export const handleVerifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId || "")) {
      return res.status(400).json({ success: false, message: "Invalid payment session id" });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ success: false, message: STRIPE_NOT_CONFIGURED_MESSAGE });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";

    const order = paid
      ? await markOrderPaidFromSession(session)
      : await Order.findById(getOrderIdFromSession(session));

    return res.status(200).json({
      success: true,
      paid,
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      customerEmail: session.customer_details?.email || null,
      order: toPublicOrder(order),
    });
  } catch (error) {
    if (error?.code === "resource_missing") {
      return res.status(404).json({ success: false, message: "Payment session not found" });
    }
    return sendStripeError(res, error, "Unable to verify payment");
  }
};

/** POST /api/payment/cancel/:orderId (auth required) */
export const handleCancelPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (String(order.customer_id) !== String(req.user?.sub)) {
      return res.status(403).json({ success: false, message: "You can only cancel your own orders" });
    }

    const result = await cancelAwaitingPaymentOrder(order);

    return res.status(200).json({
      success: true,
      paid: result.paid,
      cancelled: result.cancelled,
      order: toPublicOrder(result.order),
    });
  } catch (error) {
    return sendStripeError(res, error, "Unable to cancel payment");
  }
};

/**
 * POST /api/payment/webhook — optional, enabled when STRIPE_WEBHOOK_SECRET is set.
 * Confirms payments even if the customer closes the tab before returning.
 * Mounted in app.js with express.raw() so the signature can be verified.
 */
export const handleStripeWebhook = async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = config.stripe.webhookSecret;
  if (!stripe || !webhookSecret) {
    return res.status(503).json({ success: false, message: "Stripe webhook is not configured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return res.status(400).json({ success: false, message: `Webhook Error: ${error.message}` });
  }

  try {
    const session = event.data?.object;

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        if (session.payment_status === "paid") {
          await markOrderPaidFromSession(session);
        }
        break;
      case "checkout.session.expired":
        await markOrderPaymentCancelled(getOrderIdFromSession(session), {
          sessionId: session.id,
        });
        break;
      case "checkout.session.async_payment_failed":
        await markOrderPaymentCancelled(getOrderIdFromSession(session), {
          sessionId: session.id,
          failed: true,
        });
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling error:", error);
    // Non-2xx makes Stripe retry the event later
    return res.status(500).json({ success: false, message: "Webhook handling failed" });
  }
};
