import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import ProductList from "./ProductList";
import { toast } from "react-toastify";
import {
  CartProductContext,
  AddressContext,
  OrderHistoryContext,
  UserContext,
} from "../../contexts/context";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { db } from "../../db";
import { channel } from "../../services/service";

function Cart({ variant = "full" }) {
  let {
    userData,
    setUserData,
    currentUser,
    currentUserRole,
    setCurrentUser,
    setActiveTab,
  } = useContext(UserContext);
  if (currentUserRole === "customer") {
    const navigate = useNavigate();
    let isCompact = variant === "compact";
    let { cartItems, setCartItems, storeId, setStoreId } =
      useContext(CartProductContext);
    let { address } = useContext(AddressContext);

    let { allOrderHistory, setAllOrderHistory } =
      useContext(OrderHistoryContext);

    const [totalPrice, setTotalPrice] = useState(0);
    const [offerPrice, setOfferPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [taxPrice, setTaxPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");

    let currentUserAddress = "";
    const isAddressAvailable = currentUser.hasOwnProperty("myAddress");

    if (isAddressAvailable) {
      currentUserAddress = `${currentUser.myAddress.name} ${currentUser.myAddress.phone} ${currentUser.myAddress.street} ${currentUser.myAddress.city} ${currentUser.myAddress.state}, ${currentUser.myAddress.pincode} `;
    }

    useEffect(() => {
      if (cartItems?.length > 0) {
        const price = cartItems.reduce((acc, product) => {
          return acc + product.product_price * product.product_qty;
        }, 0);

        setTotalPrice(price);
        const tax = (price * 0.02).toFixed(2);
        setTaxPrice(tax);
        setFinalPrice(price + price * 0.02);

        // const offer_price = cartItems.reduce((acc, product) => {
        //   return acc + product.product_offer_price * product.product_qty;
        // }, 0);
        // setOfferPrice(offer_price);

        //using offerprice as a shiping price.
        const shiping_price = cartItems.reduce((acc, p) => {
          return acc + p.product_shiping_price;
        }, 0);
        setShippingPrice(shiping_price);
      } else {
        setTotalPrice(0);
        setTaxPrice(0);
        setFinalPrice(0);
        setShippingPrice(0);
        setOfferPrice(0);
      }
    }, [cartItems]);

    if (cartItems?.length === 0) {
      return (
        <section className="flex flex-col items-center justify-center text-center py-16">
          <h2 className="text-lg font-semibold text-gray-600">
            Your Cart is Empty 🛒
          </h2>
          <button
            onClick={() => navigate("/stores")}
            className="active:scale-95 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Continue Shopping
          </button>
        </section>
      );
    }

    const handlePaymentMethod = (e) => {
      setPaymentMethod(e.target.value);
    };

    const onPlaceOrder = async () => {
      try {
        //VALIDATIONS
        if (!isAddressAvailable) {
          toast.error("Please add delivery address");
          return;
        }

        if (!storeId) {
          toast.error("Please select products properly");
          return;
        }

        if (!cartItems || cartItems.length === 0) {
          toast.error("Cart is empty");
          return;
        }

        // GET USER & STORE
        const user = await db.localUserData.get(currentUser.id);
        const store = await db.localUserData.get(storeId);

        if (!user || !store) {
          toast.error("Something went wrong");
          return;
        }

        // DATE & TIME
        const now = new Date();

        const todayDate = now.toLocaleDateString("en-GB");
        const currentTime = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // PRICE CALCULATIONS
        const totalPrice = cartItems.reduce((acc, item) => {
          return acc + item.product_price * item.product_qty;
        }, 0);

        const shippingPrice = cartItems.reduce((acc, item) => {
          return acc + (item.product_shiping_price || 0);
        }, 0);

        const taxPrice = Number((totalPrice * 0.02).toFixed(2));

        const finalPrice = totalPrice + taxPrice + shippingPrice;

        // ORDER DETAILS
        const orderId = uuid();

        const orderPriceDetails = {
          price: totalPrice,
          shippingPrice,
          taxPrice,
          finalPrice,
        };

        const orderData = {
          orderId,

          customerId: currentUser.id,
          storeId: storeId,

          store_name: store.store_name,
          store_address: store.store_address,

          name: currentUser.myAddress.name,
          phone: currentUser.myAddress.phone,
          email: currentUser.email,

          address: `
        ${currentUser.myAddress.street},
        ${currentUser.myAddress.city},
        ${currentUser.myAddress.state},
        ${currentUser.myAddress.pincode}
      `,

          orderDate: todayDate,
          orderTime: currentTime,

          orderStatus: "pending",

          items: cartItems,

          paymentMethod,

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

          myOrders: store.myOrders
            ? [...store.myOrders, orderData]
            : [orderData],

          myCurrentOrders: store.myCurrentOrders
            ? [...store.myCurrentOrders, orderData]
            : [orderData],
        };

        // NOTIFICATIONS
        const customerNotification = {
          notificationID: uuid(),

          msg: `Hey ${
            currentUser.username.split(" ")[0]
          }, Your order has been placed successfully at ${
            store.store_name
          }.`,

          isNotificationIsRead: false,

          Ntime: currentTime,
          Ndate: todayDate,
        };

        const storeNotification = {
          notificationID: uuid(),

          msg: `New order received from ${
            currentUser.username
          }. Total Amount: $${finalPrice}`,

          isNotificationIsRead: false,

          Ntime: currentTime,
          Ndate: todayDate,
        };

        // ADD CUSTOMER NOTIFICATION
        updatedUser.myNotifications = updatedUser.myNotifications
          ? [...updatedUser.myNotifications, customerNotification]
          : [customerNotification];

        // ADD STORE NOTIFICATION
        updatedStore.myNotifications = updatedStore.myNotifications
          ? [...updatedStore.myNotifications, storeNotification]
          : [storeNotification];

        // SAVE DATABASE
        await db.localUserData.put(updatedUser);

        await db.localUserData.put(updatedStore);

        await db.orderHistory.add(orderData);

        // UPDATE CONTEXT
        setCurrentUser(updatedUser);
        setUserData(await db.localUserData.toArray());

        // REALTIME UPDATE
        channel.postMessage({
          type: "USER_DATA_UPDATED",
        });

        // SUCCESS
        toast.success("Order placed successfully");

        setTimeout(() => {
          setCartItems([]);
          navigate("/orders");
        }, 1000);
        setTimeout(async () => {
          // CLEAR CART
          delete updatedUser.myCart;
          await db.localUserData.put(updatedUser);
        }, 0);
      } catch (error) {
        console.error("Place Order Error:", error);

        toast.error("Failed to place order");
      }
    };

    return (
      <>
        <section className="bg-white rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT - CART ITEMS */}
            <div className="flex-1 relative rounded-2xl border p-2">
              <div className="flex justify-between items-end border-b pb-2 mb-3 px-2 font-semibold">
                <span className="text-2xl">Shopping Cart</span>

                <span className="text-indigo-600 text-sm">
                  {cartItems?.length || 0} items
                </span>
              </div>

              <div className={isCompact ? "max-h-[200px] overflow-y-auto" : ""}>
                <ProductList compact={isCompact} />
              </div>
              <div>
                <button
                  onClick={() => navigate("/allproducts")}
                  className="flex gap-0.5 items-center font-semibold text-sm text-blue-600 hover:text-green-600"
                >
                  <ArrowLeft size={17} /> <span>Continue Shoping</span>
                </button>
              </div>
            </div>

            {/* FULL MODE SUMMARY */}
            {!isCompact && (
              <div className="w-full lg:w-[380px] rounded-2xl border p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>

                <hr className="mb-4" />

                {!isAddressAvailable ? (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-center text-sm">
                    <button
                      className="font-medium hover:underline"
                      onClick={() => navigate("/addressform")}
                    >
                      + Add Address
                    </button>
                  </div>
                ) : (
                  <div className="mb-5">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Delivery Address
                      </p>

                      <button
                        className="text-indigo-500 text-sm font-medium hover:underline"
                        onClick={() => navigate("/addressform")}
                      >
                        Change
                      </button>
                    </div>

                    <div className="mt-2 bg-gray-200/40 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                      {currentUserAddress}
                    </div>
                  </div>
                )}

                {/* PAYMENT */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">
                    Payment Method
                  </p>

                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-200/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    onChange={handlePaymentMethod}
                  >
                    <option value="cashOnDelivery">Cash On Delivery</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <hr className="mb-4" />

                {/* PRICE DETAILS */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Price</span>
                    <span className="font-medium">${totalPrice}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (2%)</span>
                    <span className="font-medium">${taxPrice}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5 text-base font-bold text-gray-800 border-t pt-3">
                  <span>Total</span>
                  <span>${finalPrice}</span>
                </div>

                <button
                  className="active:scale-95 w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition"
                  onClick={onPlaceOrder}
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </section>
      </>
    );
  } else {
    return (
      <p className="text-2xl">
        You Are Not Customer, You Are seller so we don't provide you cart access
      </p>
    );
  }
}

export default Cart;
