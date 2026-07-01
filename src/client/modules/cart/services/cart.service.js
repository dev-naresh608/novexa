import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { addOrderApi, getStoreApi } from "../../index";
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
    const { subTotal, deliveryCharge, taxPrice, finalPrice } =
      orderPriceDetails;

    //VALIDATIONS
    if (!address) {
      toast.error("Please add delivery address");
      return;
    }

    if (!storeId) {
      toast.error("Please select products properly");
      return;
    }

    if (!currentUser.myCart || currentUser.myCart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // GET USER & STORE
    const user = currentUser;
    const data = await getStoreApi(storeId);

    if (!data.success) {
      return toast.error(data.message);
    }

    const store = data.store;

    if (!user || !store) {
      toast.error("Something went wrong");
      return;
    }

    // DATE & TIME
    const createdAt = new Date();
    const orderData = {
      // orderId,
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

    // CUSTOMER UPDATE
    const updatedUser = {
      ...user,

      myOrders: user.myOrders ? [...user.myOrders, orderData] : [orderData],

      myCurrentOrders: user.myCurrentOrders
        ? [...user.myCurrentOrders, orderData]
        : [orderData],
    };

    // STORE UPDATE
    const updatedStore = {
      ...store,

      myOrders: store.myOrders ? [...store.myOrders, orderData] : [orderData],

      myCurrentOrders: store.myCurrentOrders
        ? [...store.myCurrentOrders, orderData]
        : [orderData],
    };

    // NOTIFICATIONS
    const customerNotification = {
      notificationID: uuid(),

      msg: `Hey ${
        currentUser.username.split(" ")[0]
      }, Your order has been placed successfully at ${store.store_name}.`,

      isNotificationIsRead: false,

      createdAt: createdAt,
    };

    const storeNotification = {
      notificationID: uuid(),

      msg: `New order received from ${
        currentUser.username
      }. Total Amount: $${finalPrice}`,

      isNotificationIsRead: false,

      createdAt: createdAt,
    };

    // ADD CUSTOMER NOTIFICATION
    updatedUser.myNotifications = updatedUser.myNotifications
      ? [...updatedUser.myNotifications, customerNotification]
      : [customerNotification];

    // ADD STORE NOTIFICATION
    updatedStore.myNotifications = updatedStore.myNotifications
      ? [...updatedStore.myNotifications, storeNotification]
      : [storeNotification];

    const addOrder = async () => {
      const data = await addOrderApi(orderData);

      if (!data.success) {
        return toast.error(data.message || "Something went wrong");
      }

      toast.success(data.message || "successfully");
      return;
    };
    addOrder();
    setTimeout(() => {
      navigate("/orders");
    }, 1000);
    setTimeout(() => {
      delete updatedUser.myCart;
      setCurrentUser(updatedUser);
    }, 1100);
  } catch (error) {
    toast.error("Failed to place order");
    return console.error("Place Order Error:", error);
  }
};
