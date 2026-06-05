import React, { useState } from "react";
import {
  ChevronRight,
  CreditCard,
  DollarSign,
  User,
  Dot,
  Clock,
  Package,
  Store,
} from "lucide-react";
import { tableHeaderConfig, OrderStatusPill } from "../../index";

import { useNavigate } from "react-router-dom";

function OrdersTable({ currentUserRole, allOrders }) {
  const navigate = useNavigate();

  // ===================== ROLE CONFIG =====================
  const cfg = tableHeaderConfig(currentUserRole);

  // ======================== TABLE HEADER ====================
  const TABLE_CONFIG = [
    { colLabel: "Order ID", icon: Package },
    {
      colLabel: cfg?.colLabel || "nothing",
      icon: currentUserRole === "customer" ? Store : User,
    },
    { colLabel: "Created By", icon: Clock },
    { colLabel: "Payment", icon: CreditCard },
    { colLabel: "Total", icon: DollarSign },
    { colLabel: "Status", icon: Dot },
  ];

  const renderTableHeader = (label) => {
    const Icon = label?.icon;

    return (
      <th key={label.colLabel} className="p-4">
        <div className="flex items-center gap-1">
          <Icon size={17} />
          {label?.colLabel}
        </div>
      </th>
    );
  };

  return (
    <div className="min-h-[300px] overflow-hidden border rounded-lg">
      <table className="w-full text-left text-sm">
        {/* TABLE HEAD */}
        <thead className="border-b bg-gray-50 text-gray-500">
          <tr className="">
            {TABLE_CONFIG.map((colLabel) => renderTableHeader(colLabel))}
            <th> </th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {allOrders.map((o) => (
            <tr
              key={o.orderId}
              onClick={() => navigate(`/orders/${o.orderId}`)}
              className="cursor-pointer border-b transition-colors duration-150 hover:bg-gray-100/70"
            >
              {/* ORDER ID */}
              <td className="p-4 font-medium text-gray-600">
                #{o.orderId.slice(0, 8).toUpperCase()}
              </td>

              {/* CUSTOMER / STORE */}
              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-700">
                    {o[cfg?.fromKey] || "-"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {o[cfg?.subKey] || "-"}
                  </p>
                </div>
              </td>

              {/* DATE / TIME */}
              <td className="p-4 text-sm text-gray-600">
                <p>{o.orderDate}</p>
                <p>{o.orderTime}</p>
              </td>

              {/* PAYMENT */}
              <td className="p-4 text-gray-600">
                {o.paymentMethod === "cashOnDelivery" ? "Cash" : "Online"}
              </td>

              {/* TOTAL */}
              <td className="p-4 font-semibold text-gray-700">
                ${o.priceDetails?.finalPrice}
              </td>

              {/* STATUS */}
              <td className="p-4">
                <OrderStatusPill status={o.orderStatus} />
              </td>

              {/* ARROW */}
              <td className="p-4">
                <ChevronRight
                  size={14}
                  strokeWidth={3}
                  className="text-gray-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
