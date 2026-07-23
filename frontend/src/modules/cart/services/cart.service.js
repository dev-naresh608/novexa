import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { addOrderApi, getStoreApi } from "./cart.api";
import { validateOrder } from "../utils/cartValidation";

export const onCartPlaceOrder = async (
  currentUser,
  setCurrentUser,
  storeId,
  orderPriceDetails,
  address,
  paymentMethod,
  navigate,
) => {
  try {
    const { finalPrice } = orderPriceDetails;

    // Run custom validation utility
    const validation = validateOrder(address, storeId, currentUser.myCart);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // Get user and store details
    const user = currentUser;
    const storeData = await getStoreApi(storeId);

    if (!storeData.success) {
      toast.error(storeData.message || "Failed to fetch store details");
      return;
    }

    const store = storeData.store;
    if (!user || !store) {
      toast.error("Something went wrong");
      return;
    }

    const createdAt = new Date();
    const orderData = {
      items: currentUser?.myCart,
      createdAt,
      paymentMethod,
      storeId,
      isOrderActive: true,
      customerId: currentUser._id,
      store_name: store.store_name,
      email: currentUser.email,
      store_address: store.store_address,
      order_address: address,
      orderStatus: "pending",
      priceDetails: orderPriceDetails,
    };

    // Customer payload update
    const updatedUser = {
      ...user,
      myOrders: user.myOrders ? [...user.myOrders, orderData] : [orderData],
      myCurrentOrders: user.myCurrentOrders
        ? [...user.myCurrentOrders, orderData]
        : [orderData],
    };

    // Store payload update (keeps the same object structure as the original)
    const updatedStore = {
      ...store,
      myOrders: store.myOrders ? [...store.myOrders, orderData] : [orderData],
      myCurrentOrders: store.myCurrentOrders
        ? [...store.myCurrentOrders, orderData]
        : [orderData],
    };

    // Notification messages creation
    const customerNotification = {
      notificationID: uuid(),
      message: `Hey ${
        currentUser.username.split(" ")[0]
      }, Your order has been placed successfully at ${store.store_name}.`,
      isNotificationIsRead: false,
      createdAt: createdAt,
    };

    const storeNotification = {
      notificationID: uuid(),
      message: `New order received from ${
        currentUser.username
      }. Total Amount: $${finalPrice}`,
      isNotificationIsRead: false,
      createdAt: createdAt,
    };

    // Push notification payloads
    updatedUser.myNotifications = updatedUser.myNotifications
      ? [...updatedUser.myNotifications, customerNotification]
      : [customerNotification];

    updatedStore.myNotifications = updatedStore.myNotifications
      ? [...updatedStore.myNotifications, storeNotification]
      : [storeNotification];

    // Submit order creation request
    const response = await addOrderApi(orderData);

    if (!response.success) {
      toast.error(response.message || "Something went wrong while placing the order");
      return;
    }

    toast.success(response.message || "Order placed successfully");

    // Perform navigation and local state updates
    setTimeout(() => {
      navigate("/orders");
    }, 1000);

    setTimeout(() => {
      const finalUser = { ...updatedUser };
      delete finalUser.myCart;
      setCurrentUser(finalUser);
    }, 1100);

  } catch (error) {
    toast.error("Failed to place order");
    console.error("Place Order Error:", error);
  }
};
