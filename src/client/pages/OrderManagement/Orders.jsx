import React, { useContext, useEffect, useState } from "react";
import { CartProductContext, UserContext } from "../../contexts/context";

import {
  DashboardCard,
  EmptyOrders,
  dashboardCardsConfig,
  tableHeaderConfig,
  OrdersTable,
  OrderSearchBar,
  searchOrders,
} from "./index";

function Orders() {
  const { currentUser } = useContext(UserContext);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");
  const filteredOrders = searchOrders(allOrders, searchValue);

  useEffect(() => {
    if (!currentUser?.myOrders?.length) {
      setAllOrders([]);
    } else {
      setAllOrders(currentUser.myOrders);
    }
  }, [currentUser]);

  // ===================== EMPTY STATE =====================
  if (allOrders.length === 0) {
    return <EmptyOrders />;
  }

  // ===================== RENDER DASHBOARD CARDS =====================
  const dashboardCards = dashboardCardsConfig(
    currentUser,
    setActiveCard,
    setAllOrders,
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
