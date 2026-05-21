import React, { useContext, useEffect } from "react";
import { CartProductContext, UserContext } from "../../contexts/context";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../db";
import { p } from "framer-motion/client";
function Orders() {
  const { currentUser, setActiveTab } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartProductContext);

  useEffect(() => {
    setActiveTab("orders");
  }, []);

  if (!currentUser.myOrders || currentUser.myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Orders Yet 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Start shopping to see your orders here
        </p>
      </div>
    );
  }

  const handleReorder = async (order) => {
    setCartItems(order.items);
    const user = await db.localUserData.get(currentUser.id);
    user.myCart = order.items;
    await db.localUserData.put(user);
    // set

    toast.success(
      "Items Are Added to Cart, Now You can order from cart successfully",
    );
  };

  if (currentUser.role === "customer") {
    return (
      <div className="space-y-6">
        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-md p-5 border">
          <p className="text-gray-500 text-sm">Total Orders</p>

          <h2 className="text-3xl font-bold text-green-600 mt-1">
            {currentUser.myOrders?.length || 0}
          </h2>
        </div>

        {/* ORDERS */}
        {currentUser.myOrders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border overflow-hidden"
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>

                <p className="text-xs text-gray-700 break-all">
                  {order.orderId}
                </p>
              </div>

              <div>
                <span
                  className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : `${order.orderStatus === "preparing" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="p-4 space-y-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden p-2">
                      <img
                        src={item.product_url}
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.product_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty : {item.product_qty}
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.product_weight}
                        {item.product_weight_type}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-700">
                      ₹
                      {item.isOfferAvailable
                        ? item.product_offer_price
                        : item.product_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Payment</p>

                <p className="font-medium text-gray-700">
                  {order.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Amount</p>

                <p className="text-xl font-bold text-green-600">
                  ₹{order.priceDetails?.finalPrice}
                </p>
              </div>

              <button
                onClick={() => handleReorder(order)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl transition"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}

        <ToastContainer autoClose={500} pauseOnHover draggable />
      </div>
    );
  } else if (currentUser.role === "seller") {
    return (
      <>
        <p>Seller</p>
      </>
    );
  } else if (currentUser.role === "driver") {
    return <p>Driver</p>;
  }
}

export default Orders;
