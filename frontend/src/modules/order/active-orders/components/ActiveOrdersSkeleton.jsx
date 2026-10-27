import React from "react";
import { Store, Clock, Calendar, AlertCircle, Flame, Bike } from "lucide-react";

/**
 * YouTube-style white-gray Shimmer Skeletons for Active Orders
 * Responsive for Customer, Seller, and Driver portals.
 */

// ================= 1. CUSTOMER ACTIVE ORDERS SKELETON =================
export const CustomerActiveOrdersSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-4 font-sans select-none pointer-events-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="h-7 bg-gray-200/90 rounded-lg w-44 skeleton-shimmer" />
        <div className="h-6 bg-gray-100 rounded-full w-48 sm:w-56 skeleton-shimmer" />
      </div>

      {/* 2-3 Active Order Cards */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs"
          >
            {/* Top Bar */}
            <div className="border-b p-4 bg-gray-50/50">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Store Badge */}
                  <div className="h-6 w-32 bg-gray-200/80 rounded-2xl skeleton-shimmer" />
                  {/* Clock Badge */}
                  <div className="h-6 w-20 bg-gray-200/80 rounded-2xl skeleton-shimmer" />
                  {/* Calendar Badge */}
                  <div className="h-6 w-28 bg-gray-200/80 rounded-2xl skeleton-shimmer" />
                </div>
                {/* Status Pill */}
                <div className="h-6 w-24 bg-emerald-100/80 rounded-full skeleton-shimmer" />
              </div>
            </div>

            {/* Middle Content */}
            <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200/90 rounded w-48 sm:w-64 skeleton-shimmer" />
                <div className="h-3.5 bg-gray-200/70 rounded w-36 skeleton-shimmer" />
                <div className="h-3 bg-gray-200/60 rounded w-28 skeleton-shimmer" />
              </div>

              {/* Price & Chevron */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="space-y-1 text-right">
                  <div className="h-3 bg-gray-200/70 rounded w-16 ml-auto skeleton-shimmer" />
                  <div className="h-6 bg-gray-200/90 rounded w-20 skeleton-shimmer" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 skeleton-shimmer shrink-0" />
              </div>
            </div>

            {/* Footer Bar */}
            <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200/80 skeleton-shimmer shrink-0" />
                <div className="h-3.5 bg-gray-200/70 rounded w-60 sm:w-80 skeleton-shimmer" />
              </div>
              <div className="h-7 w-28 bg-emerald-600/20 rounded-xl skeleton-shimmer shrink-0 self-end sm:self-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= 2. SELLER ACTIVE ORDERS (KANBAN) SKELETON =================
export const SellerActiveOrdersSkeleton = () => {
  const columnConfigs = [
    { title: "New Orders", color: "bg-amber-100", border: "border-amber-200" },
    { title: "In Preparation", color: "bg-blue-100", border: "border-blue-200" },
    { title: "Ready / Out for Delivery", color: "bg-emerald-100", border: "border-emerald-200" },
  ];

  return (
    <div aria-hidden="true" className="space-y-5 font-sans select-none pointer-events-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="space-y-1.5">
          <div className="h-6 sm:h-7 bg-gray-200/90 rounded-lg w-48 sm:w-56 skeleton-shimmer" />
          <div className="h-3.5 bg-gray-200/70 rounded w-36 sm:w-44 skeleton-shimmer" />
        </div>
        <div className="h-9 w-28 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer shrink-0" />
      </div>

      {/* 3 Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {columnConfigs.map((col, idx) => (
          <div
            key={idx}
            className="bg-gray-50/70 rounded-2xl border border-gray-200/80 p-4 space-y-3.5"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${col.border} ${col.color}/40`}>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-300 skeleton-shimmer" />
                <div className="h-4 bg-gray-300/90 rounded w-24 sm:w-28 skeleton-shimmer" />
              </div>
              <div className="h-5 w-6 bg-gray-300 rounded-full skeleton-shimmer" />
            </div>

            {/* 2 Cards in Column */}
            {[1, 2].map((cardIdx) => (
              <div
                key={cardIdx}
                className="bg-white rounded-xl border border-gray-200/90 p-4 space-y-3 shadow-xs"
              >
                {/* Header row */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="h-4 bg-gray-200/90 rounded w-20 skeleton-shimmer" />
                  <div className="h-3 bg-gray-200/70 rounded w-16 skeleton-shimmer" />
                </div>

                {/* Customer & items info */}
                <div className="space-y-1.5">
                  <div className="h-3.5 bg-gray-200/80 rounded w-32 skeleton-shimmer" />
                  <div className="h-3 bg-gray-200/60 rounded w-44 skeleton-shimmer" />
                  <div className="h-3 bg-gray-200/60 rounded w-36 skeleton-shimmer" />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <div className="h-8 flex-1 bg-gray-100 rounded-lg skeleton-shimmer" />
                  <div className="h-8 flex-1 bg-gray-200/80 rounded-lg skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= 3. DRIVER PORTAL SKELETON =================
export const DriverActiveOrdersSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-6 font-sans select-none pointer-events-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="space-y-1.5">
          <div className="h-7 bg-gray-200/90 rounded-lg w-56 skeleton-shimmer" />
          <div className="h-3.5 bg-gray-200/70 rounded w-44 skeleton-shimmer" />
        </div>
        <div className="h-9 w-44 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer shrink-0" />
      </div>

      {/* Broadcast Request Banner Skeleton */}
      <div className="bg-amber-500/10 border-2 border-amber-300/70 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-amber-200 rounded w-48 skeleton-shimmer" />
          <div className="h-6 w-24 bg-amber-300 rounded-full skeleton-shimmer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-amber-200/80 p-4 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="h-4 bg-gray-200/90 rounded w-28 skeleton-shimmer" />
                <div className="h-5 bg-emerald-100 rounded w-16 skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 bg-gray-200/80 rounded w-40 skeleton-shimmer" />
                <div className="h-3.5 bg-gray-200/80 rounded w-48 skeleton-shimmer" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <div className="h-8 flex-1 bg-red-100 rounded-lg skeleton-shimmer" />
                <div className="h-8 flex-1 bg-emerald-100 rounded-lg skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Trip Card Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="h-5 bg-gray-200/90 rounded w-36 skeleton-shimmer" />
          <div className="h-6 w-28 bg-emerald-100 rounded-full skeleton-shimmer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200/80 rounded w-32 skeleton-shimmer" />
            <div className="h-3.5 bg-gray-200/70 rounded w-48 skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200/80 rounded w-28 skeleton-shimmer" />
            <div className="h-3.5 bg-gray-200/70 rounded w-44 skeleton-shimmer" />
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <div className="h-10 flex-1 bg-gray-100 rounded-xl skeleton-shimmer" />
          <div className="h-10 flex-1 bg-emerald-600/30 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};
