import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../../contexts/context";

import {
  DashboardCard,
  EmptyOrders,
  dashboardCardsConfig,
  tableHeaderConfig,
  OrdersTable,
  OrderSearchBar,
  searchOrdersSvc,
  getAllOrdersSvc,
  sortOrderByDate,
  sortOrderByPrice,
} from "../index";

import axios from "axios";
import { toast } from "react-toastify";

function Orders() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      const { data } = await getAllOrdersSvc(currentUser._id, currentUser.role);
      if (!data.success) {
        return toast.error(data.message);
      }
      const sortedOrders = sortOrderByDate(data.allOrders, "desc");
      setAllOrders(sortedOrders);
      setCurrentUser((prev) => ({
        ...prev,
        myOrders: data.allOrders,
      }));
    };

    fetchOrderData();
  }, []);

  const filteredOrders = useMemo(() => {
    return searchOrdersSvc(allOrders, searchValue);
  }, [allOrders, searchValue]);

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
