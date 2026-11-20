import Order from "../order.model.js";
import Seller from "../../seller/seller.model.js";
import Cart from "../../cart/cart.model.js";
import { priceOrderItems } from "../order.pricing.js";
import { notifyOrderPlacedSvc } from "../order.notifications.js";
import { isStripeConfigured } from "../../payment/stripe.client.js";
import { reconcileAwaitingPaymentOrders } from "../../payment/stripe.service.js";

export const addOrderSvc = async (o) => {
  try {
    const { name: customer_name, phone: customer_phone } = o.order_address || {};
    const isOnlinePayment = o.paymentMethod === "online";

    if (isOnlinePayment && !isStripeConfigured()) {
      return {
        success: false,
        message:
          "Online payment is not available right now. Please choose Cash on Delivery.",
      };
    }

    // Resolve seller store ID (o.storeId could be User._id or Seller._id)
    let sellerStoreId = o.storeId;
    let sellerRecord = null;
    if (o.storeId) {
      sellerRecord = await Seller.findOne({
        $or: [{ _id: o.storeId }, { user_id: o.storeId }],
      });
      if (sellerRecord) {
        sellerStoreId = sellerRecord._id;
      }
    }

    if (sellerRecord && sellerRecord.is_store_open === false) {
      return {
        success: false,
        message: `"${sellerRecord.store_name || "This store"}" is currently inactive/closed and not accepting orders.`,
      };
    }

    // Never trust prices/totals from the client — re-price from the DB
    const { items, priceDetails } = await priceOrderItems(o.items, [
      sellerStoreId,
      o.storeId,
    ]);

    // Settle earlier online orders this customer abandoned on Stripe
    if (isOnlinePayment && o.customerId) {
      await reconcileAwaitingPaymentOrders(o.customerId);
    }

    const order = await Order.create({
      customer_id: o.customerId,
      store_id: sellerStoreId,
      store_name: o.store_name,
      order_address: o.order_address,
      store_address: o.store_address,
      customer_name: customer_name || "Customer",
      customer_phone: customer_phone || "",
      customer_email: o.email || "",
      order_items: items,
      // Online orders stay hidden from the seller until Stripe confirms payment
      order_status: isOnlinePayment ? "awaiting_payment" : "pending",
      createdAt: new Date(),
      payment_method: isOnlinePayment ? "online" : o.paymentMethod || "cashOnDelivery",
      payment_status: "pending",
      price_detail: priceDetails,
    });

    // For online payments the cart is cleared and everyone is notified only
    // after the payment succeeds (see payment/stripe.service.js).
    if (!isOnlinePayment) {
      if (o.customerId) {
        await Cart.deleteMany({ customer_id: o.customerId });
      }
      await notifyOrderPlacedSvc(order);
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const findSingleOrderSvc = async (orderId) => {
  let order = await Order.findById(orderId).populate("customer_id", "username email phone");
  if (!order) {
    return null;
  }

  const orderObj = order.toObject();

  // Populate customer phone & email fallback if empty
  orderObj.customer_name =
    orderObj.customer_name ||
    orderObj.customer_id?.username ||
    orderObj.order_address?.name ||
    "Customer";

  orderObj.customer_phone =
    orderObj.customer_phone ||
    orderObj.customer_id?.phone ||
    orderObj.order_address?.phone ||
    orderObj.customer_details?.phone ||
    "N/A";

  orderObj.customer_email =
    orderObj.customer_email ||
    orderObj.customer_id?.email ||
    orderObj.customer_details?.email ||
    "N/A";

  const { order_items } = orderObj;
  if (order_items && Array.isArray(order_items)) {
    const updatedOrderItems = order_items.map(
      ({
        _id,
        product_name,
        product_url,
        product_weight,
        product_weight_type,
        product_selling_price,
        product_qty,
        product_offer_price,
      }) => ({
        _id,
        product_name,
        product_url,
        product_weight,
        product_weight_type,
        product_selling_price,
        product_qty,
        product_offer_price,
      }),
    );
    orderObj.order_items = updatedOrderItems;
  }

  return orderObj;
};
