import React, { useContext, useEffect } from "react";
import { CartProductContext, UserContext } from "../../contexts/context";
import { db } from "../../db";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

function Orders() {
  const { currentUser, setUserData, setCurrentUser, setActiveTab } =
    useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartProductContext);

  useEffect(() => {
    setActiveTab("orders");
  }, []);

  // console.log('here ',currentUser.myNotifications)

  if (!currentUser.myOrders || currentUser.myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center text-gray-400 py-16 text-center">
        <p><ShoppingBag size={150} strokeWidth={1}/></p>
        <p className="text-3xl font-semibold">
          No Orders Yet 
        </p>
      </div>
    );
  }

  const allOrderHistory = currentUser.myOrders;
  const handleReorder = async (order) => {
    // setCartItems(order.items);
    const user = await db.localUserData.get(currentUser.id);
    user.myCart = order.items;
    await db.localUserData.put(user);
    setCurrentUser(user);
    setUserData(await db.localUserData.toArray());

    toast.success(
      "Items Are Added to Cart, Now You can order from cart successfully",
    );
  };
  if (currentUser.role === "customer") {
    return (
      <>
        <div className="space-y-5">
          <div className="rounded-md shadow-md p-3 font-semibold">
            <p className="text-xl text-gray-600">Total Orders</p>
            <h3 className="text-xl text-green-700">
              {currentUser.myOrders?.length === undefined
                ? "0"
                : `${currentUser.myOrders?.length}`}
            </h3>
          </div>

          {allOrderHistory.map((order, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-md p-4 sm:p-5 font-semibold"
            >
              <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
                <div>
                  {/* <p className="text-md text-gray-700">Order ID</p>
              <p className="text-xs/5 text-gray-500 font-medium">{order.orderId}</p> */}
                  <p className="text-md text-gray-700">From</p>
                  <p className="text-sm text-gray-500 font-medium">
                    {order.restaurant_name}
                  </p>
                  <p className="text-xs/5 text-gray-500 font-medium">
                    📍{order.restaurant_address}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs px-2 text-gray-500">Status</p>
                  <p className="px-2 text-xs rounded-md bg-yellow-100 text-yellow-700">
                    {order.orderStatus}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mt-4 space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14">
                        <img
                          src={item.product_url}
                          alt={item.product_name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="text-sm">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.product_qty}
                        </p>
                        <p className="text-xs text-gray-400">
                          Weight : {item.product_weight}
                          {`${item.product_weight_type === "none" ? "" : `${item.product_weight_type}`}`}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-medium">
                      ${item.product_price}
                    </span>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4 border-t pt-3">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-semibold">
                    ${order.priceDetails?.finalPrice}
                  </p>
                </div>

                <button
                  onClick={() => handleReorder(order)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
         
        </div>
      </>
    );
  } else if (currentUser.role === "seller") {
    return (
      <>
        <p>Seller all order history</p>
      </>
    );
  } else if (currentUser.role === "driver") {
    return <p>Driver all order history</p>;
  }
}

export default Orders;
