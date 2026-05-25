import React, { useContext } from "react";
import { UserContext } from "../../../contexts/context";
import { GradientButton } from "../../../components/component";
import { Calendar, Store, TimerIcon, User } from "lucide-react";

function CustomerActiveOrders() {
  const { currentUser } = useContext(UserContext);

  if (!currentUser.myCurrentOrders || currentUser.myCurrentOrders.length === 0) {
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
  // --------- Style --------------------------------

  const styleFlex =
    "flex items-center gap-1 text-nowrap bg-blue-100 px-2 py-1 rounded-2xl ";
  const formatDate = (rawDateStr) => {
    if (!rawDateStr) return "";

    // Split the DD/MM/YYYY string safely
    const [day, month, year] = rawDateStr.split("/");
    const dateObj = new Date(year, month - 1, day);

    // Format into: 22 May, 2026
    return dateObj
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/ (\d{4})$/, ", $1"); // Injects the comma before the year
  };
  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div>
        <GradientButton componentType="text">Current Orders</GradientButton>
      </div>

      {/* ORDERS */}
      {currentUser?.myCurrentOrders?.map((order, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md border overflow-hidden"
        >
          {/* TOP */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-4">
            <div className="font-medium w-[40vw] md:w-[50vw] lg:w-[50vw]">
              <div className="text-sm flex flex-wrap gap-2 justify-between w-full text-blue-400">
                <span className={styleFlex}>
                  {" "}
                  <Store className="text-blue-400" />
                  {order.restaurant_name}
                </span>
                <span className={styleFlex}>
                  <TimerIcon />
                  {order?.orderTime}
                </span>
                <span className={styleFlex}>
                  <Calendar />
                  {formatDate(order?.orderDate)}
                </span>
                <span
                  className={`capitalize w-max px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : `${order.orderStatus === "preparing" ? "text-green-600 bg-green-100" : `${order.orderStatus === "completed" ? "font-bold text-green-800 bg-green-200" : "text-red-600 bg-red-100"}`}`}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <p className="text-xs/5 text-gray-500">
                📍{order.restaurant_address}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="p-4 space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index * 10}
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
                      Weight : {item.product_weight}
                      {`${item.product_weight_type === "none" ? "" : `${item.product_weight_type}`}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-700">
                    $
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

              <p className="font-medium text-gray-700">{order.paymentMethod}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>

              <p className="text-xl font-bold text-green-600">
                ${order.priceDetails?.finalPrice}
              </p>
            </div>
          </div>
        </div>
      ))}

     
    </div>
  );
}

export default CustomerActiveOrders;
