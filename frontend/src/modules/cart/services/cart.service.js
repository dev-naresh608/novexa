import { toast } from "react-toastify";
import { addOrderApi, getStoreApi, clearCartApi } from "./cart.api.service";
import { validateOrder } from "../utils/cartValidation";
import { fetchUnreadNotificationsApi } from "@/modules/notification/services/notification.api.service";
import { setUnreadData } from "@/modules/notification/store/notificationSlice";
import { closeCartDrawer, clearCartState } from "../store/cartSlice";
import api from "@/configs/api";

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

    const createdAt = new Date();
    const orderData = {
      items: currentUser?.myCart,
      createdAt,
      paymentMethod,
      storeId,
      isOrderActive: true,
      customerId: currentUser._id || currentUser?.id,
      store_name: store.store_name,
      email: currentUser.email,
      store_address: store.store_address,
      order_address: address,
      orderStatus: "pending",
      priceDetails: orderPriceDetails,
    };

    // Submit order creation request
    const response = await addOrderApi(orderData);

    if (!response || !response.success) {
      toast.error(response?.message || "Something went wrong while placing the order");
      return;
    }

    const createdOrder = response.order || orderData;

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

    // If payment method is Online, initiate Stripe checkout session
    if (paymentMethod === "online") {
      try {
        toast.info("Opening Stripe checkout page...");
        const checkoutRes = await api.post("/payment/create-checkout-session", {
          items: currentUser?.myCart,
          priceDetails: orderPriceDetails,
          orderId: createdOrder?._id,
          customerId: currentUser?._id || currentUser?.id,
        });

        if (checkoutRes.data?.url) {
          window.location.href = checkoutRes.data.url;
          return;
        }
      } catch (stripeErr) {
        console.error("Stripe session creation error:", stripeErr);
        toast.warn("Could not initiate online payment, order recorded with Cash fallback");
      }
    }

    toast.success(response.message || "Order placed successfully! 🛒🎉");

    // Smooth navigation to active-orders page
    navigate("/active-orders", { replace: true });
  } catch (error) {
    toast.error("Failed to place order");
    console.error("Place Order Error:", error);
  }
};
