import React, { useContext } from "react";
import { UserContext } from "../../contexts/context";
import { db } from "../../db";
import {
  Store
} from "lucide-react";

import DashboardCards from "./DashboardCards.jsx";
import {dashboardCards} from "./dashboardCards";

function SellerDashboard() {
  const { currentUser } = useContext(UserContext);

  // const localUserData = await db.localUserData.get(currentUser.id);
  // console.log(localUserData.restaurant_name);

  // Set Seller Stats -------------------
  const sellerStats = {
    totalOrders: currentUser?.myOrders?.length || "0",
    revenue: `$${currentUser?.myRevanue?.length || "0"}`,
    products: currentUser?.productList?.length || "0",
    customers: currentUser?.myCustomers?.length || "0",
  };

  return (
    <>
      <div className="bg-white/40 p-7 space-y-5">
        {/* ===== HEADER ===== */}
        <div className="flex gap-4 items-center bg-white rounded-2xl p-5 border shadow-sm">
          <div>
            <div
              className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-200 text-gray-400"
            >
              <Store />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">
             SELLER DASHBOARD
            </p>
            <p className="text-2xl font-serif font-semibold">
              {currentUser?.restaurant_name}
            </p>
          </div>
        </div>
        {/* ===== CARDS ===== */}
        <DashboardCards cards={dashboardCards.seller} stats={sellerStats} />

        
        {/* ===== CHART + ORDERS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SALES CHART */}

          <div className="lg:col-span-2 min-h-[350px] rounded-xl border p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          </div>

          {/* RECENT ORDERS */}

          <div className="min-h-[350px] rounded-xl border p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerDashboard;
