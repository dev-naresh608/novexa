import React, { useContext } from "react";
import { db } from "../../db";
import { UserContext } from "../../contexts/context";

function SellerDashboard() {
  const { currentUser } = useContext(UserContext);

  // const localUserData = await db.localUserData.get(currentUser.id);
  // console.log(localUserData.restaurant_name);
  console.log(currentUser)
  return (
    <>
      <div className="flex-1 bg-gray-100 p-5">
        {/* ===== CARDS ===== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>

            <span className="text-3xl font-bold">145</span>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Revenue</h3>

            <span className="text-3xl font-bold">$12,500</span>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Products</h3>

            <span className="text-3xl font-bold">{currentUser.productList?.length || "0"}</span>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Customers</h3>

            <span className="text-3xl font-bold">230</span>
          </div>
        </div>

        {/* ===== CHART + ORDERS ===== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SALES CHART */}

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-5 min-h-[350px]">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          </div>

          {/* RECENT ORDERS */}

          <div className="bg-white rounded-xl shadow p-5 min-h-[350px]">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <span>Seller Dashboard</span>
      <p className="text-2xl text-red-600">Page under construction</p>
    </>
  );
}

export default SellerDashboard;
