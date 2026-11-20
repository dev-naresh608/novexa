import Seller from "../seller/seller.model.js";
import { createNotificationSvc } from "../notification/notification.service.js";

/**
 * Notifies the customer and the store that an order was placed.
 * For online orders this runs only once the Stripe payment is confirmed,
 * so sellers never start preparing an unpaid order.
 */
export const notifyOrderPlacedSvc = async (order, { paidOnline = false } = {}) => {
  if (!order) return;

  const shortId = order._id.toString().slice(-6);
  const total = order.price_detail?.finalPrice || 0;
  const storeName = order.store_name || "the store";

  try {
    if (order.customer_id) {
      await createNotificationSvc({
        recipient: order.customer_id,
        title: paidOnline ? "Payment Successful 🎉" : "Order Placed Successfully",
        message: paidOnline
          ? `Payment of ₹${total} received. Your order #${shortId} has been placed with ${storeName}.`
          : `Your order #${shortId} has been placed with ${storeName}. Total: ₹${total}.`,
        type: "order",
        link: `/orders/${order._id}`,
        metadata: { orderId: order._id, status: order.order_status },
      });
    }

    let sellerUserId = order.store_id;
    if (order.store_id) {
      const seller = await Seller.findOne({
        $or: [{ _id: order.store_id }, { user_id: order.store_id }],
      }).lean();
      if (seller?.user_id) sellerUserId = seller.user_id;
    }

    if (sellerUserId) {
      await createNotificationSvc({
        recipient: sellerUserId,
        title: "🛒 New Incoming Order!",
        message: `New order #${shortId} received from ${order.customer_name || "a customer"}. Total: ₹${total}${paidOnline ? " (paid online)" : ""}.`,
        type: "order",
        link: `/active-orders`,
        metadata: { orderId: order._id, status: order.order_status },
      });
    }
  } catch (error) {
    // Notifications must never break order placement or payment confirmation
    console.error("Order notification error:", error);
  }
};
