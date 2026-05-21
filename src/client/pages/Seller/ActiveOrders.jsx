import React, { useContext } from "react";
import { UserContext } from "../../contexts/context";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../db";
function ActiveOrders() {
  const { currentUser, setUserData, setCurrentUser } = useContext(UserContext);

  const isOrderAvail = currentUser?.myOrders?.length > 0;

  if (!isOrderAvail) {
    return (
      <>
        <p className="text-center text-gray-500">No active orders available.</p>
      </>
    );
  }

  const changeOrderStatus = (AcceptOrReject, orderId, order_status) => {
    const handleChangeOrderStatus = async () => {
      const user = await db.localUserData.get(currentUser.id);
      const allUseData = await db.localUserData.toArray();

      const order = user.myOrders.find((order) => order.orderId === orderId);
      if (order) {
        order.orderStatus = order_status;
        const customerWhoOrder = allUseData.find(
          (customer) => customer.id === order.customerId,
        );

        const trackedOrder =
          customerWhoOrder?.myOrders?.length > 0 &&
          customerWhoOrder.myOrders.find((order) => order.orderId === orderId);
        trackedOrder.orderStatus = order_status;

        await db.localUserData.put(user);
        await db.localUserData.put(customerWhoOrder);
        setCurrentUser(await user);
        setUserData(await db.localUserData.toArray());
        toast.success("accept");
      }
    };

    if (AcceptOrReject === "accept") {
      handleChangeOrderStatus();
    } else {
      const sureToCancelOrder = confirm("Are you sure to cancel order ?");
      if (sureToCancelOrder) {
        handleChangeOrderStatus();
      }
    }
  };

  const onOrderAccept = async (orderId) => {
    const order_status = "preparing";
    changeOrderStatus("accept", orderId, order_status);
  };
  const onOrderReject = async (orderId) => {
    const order_status = "rejected";
    changeOrderStatus("reject", orderId, order_status);
  };

  return (
    <>
      <div
        className="space-y-4 overflow-y-auto pr-2
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-400
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <ToastContainer autoClose={400} />
        {currentUser.myOrders?.map((order) => (
          <div
            key={order.orderId}
            className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h2 className="font-semibold text-lg">
                  Order #{order.orderId.slice(0, 8)}
                </h2>

                <p className="text-sm text-gray-500">Customer: {order.name}</p>

                <p className="text-sm text-gray-500">Phone: {order.phone}</p>

                <p className="text-sm text-gray-500">
                  Payment: {order.paymentMethod}
                </p>
              </div>

              {order.orderStatus !== "rejected" && (
                <span
                  className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : `${order.orderStatus === "preparing" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}`}
                >
                  {order.orderStatus}
                </span>
              )}
            </div>

            {/* Products */}
            <div className="mt-4 space-y-4">
              {order.items.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className="h-20 w-20 border rounded-md overflow-hidden">
                      <img
                        className="w-full h-full object-contain"
                        src={product.product_url}
                        alt={product.product_name}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold capitalize">
                        {product.product_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty: {product.product_qty}
                      </p>

                      <p className="text-sm text-gray-500">
                        Weight: {product.product_weight}{" "}
                        {product.product_weight_type === "none"
                          ? ""
                          : product.product_weight_type}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${product.product_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>

                <p className="font-bold text-xl">
                  ${order.priceDetails.finalPrice}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {order.orderStatus !== "rejected" ? (
                  <>
                    <button
                      onClick={() => onOrderReject(order.orderId)}
                      className="px-5 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
                    >
                      ✘
                    </button>

                    {order.orderStatus !== "preparing" && (
                      <button
                        onClick={() => onOrderAccept(order.orderId)}
                        className="px-5 py-2 rounded-lg bg-green-200 border border-green-400 text-green-600 hover:bg-green-700 hover:text-white transition"
                      >
                        ✔
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <span
                      className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : `${order.orderStatus === "preparing" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}`}
                    >
                      {order.orderStatus}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ActiveOrders;
