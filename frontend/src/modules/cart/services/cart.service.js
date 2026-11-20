import { toast } from "react-toastify";
import { addOrderApi, getStoreApi, clearCartApi } from "./cart.api.service";
import { validateOrder } from "../utils/cartValidation";
import { fetchUnreadNotificationsApi } from "@/modules/notification/services/notification.api.service";
import { setUnreadData } from "@/modules/notification/store/notificationSlice";
import { closeCartDrawer, clearCartState } from "../store/cartSlice";
import {
  createCheckoutSessionApi,
  cancelPaymentApi,
} from "@/modules/payment/services/payment.api";

/**
 * Sends the customer to Stripe Checkout for an order that is awaiting payment.
 * The cart is intentionally NOT cleared here — that happens only after the
 * payment is confirmed, so cancelling on Stripe brings the customer back to
 * the same cart.
 */
const startOnlinePayment = async (orderId) => {
  try {
    toast.info("Redirecting to secure Stripe checkout...");
    const data = await createCheckoutSessionApi(orderId);
    if (!data?.url) {
      throw new Error("Stripe did not return a checkout URL");
    }
    window.location.assign(data.url);
    // Keep the button in its loading state while the browser navigates away
    await new Promise((resolve) => setTimeout(resolve, 15000));
  } catch (error) {
    console.error("Stripe session creation error:", error);
    // Don't leave an unpaid order behind; the cart is still intact
    cancelPaymentApi(orderId).catch(() => {});
    toast.error(
      error.response?.data?.message ||
        "Could not start online payment. Please try again or choose Cash on Delivery.",
    );
  }
};

export const onCartPlaceOrder = async (
  currentUser,
  setCurrentUser,
  storeId,
  orderPriceDetails,
  address,
  paymentMethod,
  navigate,
  dispatch,
) => {
  try {
    // Run custom validation utility
    const validation = validateOrder(address, storeId, currentUser?.myCart);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // Get user and store details
    const user = currentUser;
    const storeData = await getStoreApi(storeId);

    if (!storeData || !storeData.success) {
      toast.error(storeData?.message || "Failed to fetch store details");
      return;
    }

    const store = storeData.store;
    if (!user || !store) {
      toast.error("Something went wrong");
      return;
    }

    if (store.is_store_open === false) {
      toast.error(
        `"${store.store_name || "This store"}" is currently closed/inactive and not accepting orders.`
      );
      return;
    }

    // Prices are re-calculated on the server; only product ids + qty are trusted
    const orderData = {
      items: currentUser?.myCart,
      paymentMethod,
      storeId,
      customerId: currentUser._id || currentUser?.id,
      store_name: store.store_name,
      email: currentUser.email,
      store_address: store.store_address,
      order_address: address,
      priceDetails: orderPriceDetails,
    };

    // Submit order creation request
    const response = await addOrderApi(orderData);

    if (!response || !response.success) {
      toast.error(response?.message || "Something went wrong while placing the order");
      return;
    }

    const createdOrder = response.order || orderData;

    // Online payment: go to Stripe first; cart & notifications are handled
    // once the payment is confirmed on the success page / webhook.
    if (paymentMethod === "online") {
      if (!createdOrder?._id) {
        toast.error("Could not create your order. Please try again.");
        return;
      }
      await startOnlinePayment(createdOrder._id);
      return;
    }

    // Immediately close cart drawer if open and reset cart state
    if (dispatch) {
      dispatch(closeCartDrawer());
      dispatch(clearCartState());
    }

    // Clear cart in DB asynchronously
    try {
      const targetUserId = currentUser?._id || currentUser?.id;
      if (targetUserId) {
        await clearCartApi(targetUserId);
      }
    } catch (err) {
      console.error("Cart DB clear error:", err);
    }

    // Customer payload update with empty cart and optimistic current orders
    const updatedUser = {
      ...user,
      myCart: [],
      myOrders: user.myOrders ? [...user.myOrders, createdOrder] : [createdOrder],
      myCurrentOrders: user.myCurrentOrders ? [createdOrder, ...user.myCurrentOrders] : [createdOrder],
    };

    setCurrentUser(updatedUser);

    // Refresh notification state in Redux
    try {
      const targetUserId = currentUser?._id || currentUser?.id;
      if (targetUserId && dispatch) {
        const notifRes = await fetchUnreadNotificationsApi(targetUserId, 8);
        if (notifRes && notifRes.success) {
          dispatch(
            setUnreadData({
              notifications: notifRes.notifications || [],
              unreadCount: notifRes.unreadCount || 0,
            })
          );
        }
      }
    } catch (notifErr) {
      console.error("Failed to update notification state on order placement:", notifErr);
    }

    toast.success(response.message || "Order placed successfully! 🛒🎉");

    // Smooth navigation to active-orders page
    navigate("/active-orders", { replace: true });
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to place order");
    console.error("Place Order Error:", error);
  }
};
