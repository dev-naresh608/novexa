import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  Store,
  ChevronRight,
  PackageOpen,
  ArrowRight,
} from "lucide-react";
import { getActiveOrdersApi } from "../../services/activeOrders.api";
import { CustomerActiveOrdersSkeleton } from "../../components";

function CustomerActiveOrders() {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeOrders, setActiveOrders] = useState(currentUser?.myCurrentOrders || []);
  const [loading, setLoading] = useState(!currentUser?.myCurrentOrders || currentUser.myCurrentOrders.length === 0);

  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    let isMounted = true;

    const fetchActiveOrders = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const data = await getActiveOrdersApi(userId, "customer");
        if (!isMounted) return;

        if (data && data.success) {
          setActiveOrders(data.activeOrders || []);
        } else if (currentUser?.myCurrentOrders) {
          setActiveOrders(currentUser.myCurrentOrders);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch active orders:", error);
          if (currentUser?.myCurrentOrders) {
            setActiveOrders(currentUser.myCurrentOrders);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  if (loading && activeOrders.length === 0) {
    return <CustomerActiveOrdersSkeleton />;
  }

  if (!activeOrders || activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100/80 flex items-center justify-center mb-3 shadow-xs">
          <PackageOpen size={30} strokeWidth={2} />
        </div>

        <h3 className="text-base font-bold text-gray-800">
          No Current Active Orders
        </h3>

        <p className="mt-1 text-xs text-gray-500 max-w-sm leading-relaxed">
          You don't have any ongoing deliveries right now. You can check your completed orders in Order History or browse local stores.
        </p>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            onClick={() => navigate("/stores")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none"
          >
            <span>Explore Stores</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer border-none"
          >
            <span>Order History</span>
          </button>
        </div>
      </div>
    );
  }

  const styleFlex =
    "text-xs flex items-center gap-1 text-nowrap bg-gray-100 px-2 py-1 rounded-2xl ";
  const formatDate = (rawDateStr, createdAt) => {
    if (!rawDateStr && !createdAt) return "";
    if (createdAt) {
      return new Date(createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    const [day, month, year] = rawDateStr.split("/");
    const dateObj = new Date(year, month - 1, day);

    return dateObj
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/ (\d{4})$/, ", $1");
  };

  return (
    <div className="space-y-4 font-sans max-w-5xl mx-auto">
      {/* HEADER CARD */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Current Orders</h1>
          <p className="text-xs text-gray-500 mt-0.5">Live status and delivery progress of your ongoing orders</p>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          {activeOrders.length} active order{activeOrders.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* ORDERS */}
      {activeOrders.map((order, index) => {
        const orderId = order._id || order.id || order.orderId;
        const storeName = order.store_name || order.storeName || "Store";
        const storeAddress = order.store_address || order.storeAddress;
        const status = order.order_status || order.orderStatus || "pending";
        const items = order.order_items || order.items || [];
        const paymentMethod =
          order.payment_method || order.paymentMethod || "cashOnDelivery";
        const finalPrice =
          order.price_detail?.finalPrice || order.priceDetails?.finalPrice || 0;
        const timeStr =
          order.orderTime ||
          (order.createdAt
            ? new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "");

        return (
          <div
            key={orderId || index}
            onClick={() => navigate(`/orders/${orderId}`)}
            className="bg-white rounded-2xl hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden cursor-pointer group"
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-4 bg-gray-50/50 group-hover:bg-green-50/20 transition-colors">
              <div className="font-medium w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="text-xs flex flex-wrap gap-2 text-gray-600">
                    <span className={styleFlex}>
                      <Store size={15} />
                      {storeName}
                    </span>
                    {timeStr && (
                      <span className={styleFlex}>
                        <Clock size={15} />
                        {timeStr}
                      </span>
                    )}
                    <span className={styleFlex}>
                      <Calendar size={15} />
                      {formatDate(order?.orderDate, order?.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 group-hover:text-green-800">
                    <span>View Full Details</span>
                    <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className={`capitalize w-max px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : status === "preparing" ||
                          status === "processing" ||
                          status === "confirmed"
                        ? "text-emerald-700 bg-emerald-100 border border-emerald-200"
                        : status === "shipped" ||
                          status === "ready" ||
                          status === "out_for_delivery"
                        ? "text-blue-700 bg-blue-100 border border-blue-200"
                        : "text-gray-700 bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {status === "ready"
                      ? "Ready for Pickup"
                      : status === "out_for_delivery" || status === "shipped"
                      ? "Out for Delivery 🚚"
                      : status}
                  </span>

                  {storeAddress && (
                    <p className="text-xs text-gray-500">
                      📍{" "}
                      {typeof storeAddress === "object"
                        ? `${storeAddress.street || ""} ${storeAddress.city || ""}`
                        : storeAddress}
                    </p>
                  )}
                </div>

                {/* LIVE DRIVER ALLOCATION & DRIVER INFO BANNER */}
                {order.driver_allocation_status === "assigned" &&
                order.driver_details &&
                (status === "ready" ||
                  status === "shipped" ||
                  status === "out_for_delivery") ? (
                  <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <span>
                        🚚 Driver Assigned: {order.driver_details.driver_name}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-normal">
                      📞 Contact: +91 {order.driver_details.driver_phone} • 🛵
                      Vehicle: {order.driver_details.vehicle_number}
                    </p>
                  </div>
                ) : (status === "preparing" ||
                    status === "processing" ||
                    status === "pending") &&
                  status !== "rejected" &&
                  status !== "cancelled" ? (
                  <div className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 animate-pulse">
                    <span>
                      👨‍🍳 Store is preparing your food... (Driver info unlocks
                      when ready for pickup)
                    </span>
                  </div>
                ) : null}

                {(status === "rejected" || status === "cancelled") && (
                  <div className="mt-2 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl border border-red-100 flex items-center gap-1.5">
                    <span>
                      ⚠️ Order was {status}. If you paid online, your refund will
                      be processed shortly.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ITEMS */}
            <div className="p-4 space-y-4">
              {items.map((item, itemIdx) => (
                <div
                  key={item._id || itemIdx}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border rounded-xl bg-gray-100 overflow-hidden p-1.5 flex items-center justify-center">
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

                      {item.product_weight && (
                        <p className="text-xs text-gray-400">
                          Weight : {item.product_weight}
                          {item.product_weight_type === "none"
                            ? ""
                            : ` ${item.product_weight_type}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-700">
                      ₹
                      {item.isOfferAvailable || item.is_offer_available
                        ? item.product_offer_price
                        : item.product_selling_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/30">
              <div>
                <div className="font-semibold text-gray-700 text-sm [&>p]:flex [&>p]:gap-1 [&>p]:items-center">
                  {paymentMethod === "cashOnDelivery" ||
                  paymentMethod === "cash" ? (
                    <p>
                      <Banknote size={20} /> <span>Cash</span>
                    </p>
                  ) : (
                    <p>
                      <CreditCard size={20} /> <span>Online</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{finalPrice}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerActiveOrders;
