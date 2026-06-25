import React, { useContext, useEffect, useState } from "react";
import {  UserContext } from "../../../contexts/context";

import {
  DashboardCard,
  // EmptyOrders,
  dashboardCardsConfig,
  tableHeaderConfig,
  OrdersTable,
  OrderSearchBar,
  searchOrders,
} from "../index";

import {  EmptyOrders } from "../index"
import axios from "axios";
import { toast } from "react-toastify";

function Orders() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {

      const { data } = await axios.get(
        `http://localhost:5000/order/${currentUser._id}?role=${currentUser.role}`,
        
        // `http://localhost:5000/order/${currentUser.user_id}`,
      );
      if (!data.success) {
        return toast.error(data.message);
      }
      setAllOrders(data.allOrders);
      const result = searchOrders(data.allOrders, searchValue);
      setFilteredOrders(result);
      setCurrentUser((prev) => ({
        ...prev,
        myOrders: data.allOrders,
      }));
    };

    fetchOrderData();
  }, []);

  // ===================== EMPTY STATE =====================
  if (allOrders.length === 0) {
    return <EmptyOrders />;
  }

  // ===================== RENDER DASHBOARD CARDS =====================
  const dashboardCards = dashboardCardsConfig(
    currentUser,
    setActiveCard,
    setAllOrders,
    allOrders,
  );

  // ===================== CSS =====================
  const commonCss = "bg-white rounded-xl border shadow-md";
  const iconStyle = "flex items-center space-x-3";

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className={`${commonCss} p-3`}>
        <div className="flex items-center gap-3">
          {dashboardCards.map((card, i) => (
            <DashboardCard
              key={i}
              card={card}
              isActive={activeCard === card.id}
            />
          ))}
        </div>
      </div>

      <div className={`${commonCss} space-y-2 p-3`}>
        {/* ================= ORDER FILTER HEADER ================= */}
        <OrderSearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        {/* ================= ORDER LIST TABLE ================= */}
        <OrdersTable
          currentUserRole={currentUser.role}
          allOrders={filteredOrders}
        />
      </div>
    </div>
  );
}

export default Orders;
