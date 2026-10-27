import React from "react";

/**
 * YouTube-style white-gray Shimmer Skeletons for Orders Module
 * Responsive across mobile, tablet, and desktop screens with zero CLS.
 */

// 1. Dashboard Stat Cards Skeleton (Total, In-Progress, Completed, Cancelled)
export const OrdersStatsSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-3 select-none pointer-events-none"
    >
      <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 min-w-[130px] sm:min-w-[170px] bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-center gap-3"
          >
            {/* Icon Circle */}
            <div className="w-10 h-10 rounded-xl bg-gray-200/90 shrink-0 skeleton-shimmer" />

            {/* Title & Count */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3 bg-gray-200/80 rounded w-16 skeleton-shimmer" />
              <div className="h-5 bg-gray-200/90 rounded w-10 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Search & Filter Bar Skeleton
export const OrdersFilterSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 select-none pointer-events-none"
    >
      {/* Search Input Silhouette */}
      <div className="w-full sm:w-80 h-10 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer" />

      {/* Items per page selector */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="h-4 bg-gray-200/80 rounded w-14 skeleton-shimmer" />
        <div className="h-8 w-14 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer" />
      </div>
    </div>
  );
};

// 3. Orders Table Rows & Mobile Cards Skeleton
export const OrdersTableBodySkeleton = ({ count = 5 }) => {
  return (
    <div
      aria-hidden="true"
      className="border border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden select-none pointer-events-none"
    >
      {/* ================= DESKTOP TABLE VIEW (sm and up) ================= */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* Table Head */}
          <thead className="border-b border-gray-200/80 bg-gray-50/80">
            <tr>
              {["Order ID", "Store / Customer", "Date & Time", "Payment", "Total", ""].map((header, idx) => (
                <th key={idx} className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <div className="h-3.5 bg-gray-200/80 rounded w-20 skeleton-shimmer" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: count }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50/40">
                {/* Order ID Pill */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200/90 rounded-md w-24 skeleton-shimmer" />
                </td>

                {/* Store / Details */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="space-y-1.5 max-w-[220px]">
                    <div className="h-4 bg-gray-200/90 rounded w-36 skeleton-shimmer" />
                    <div className="h-3 bg-gray-200/70 rounded w-48 skeleton-shimmer" />
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200/80 rounded w-24 skeleton-shimmer" />
                </td>

                {/* Payment Badge */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200/80 rounded-full w-20 skeleton-shimmer" />
                </td>

                {/* Total */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200/90 rounded w-16 skeleton-shimmer" />
                </td>

                {/* Action arrow */}
                <td className="px-4 py-4 text-right">
                  <div className="w-5 h-5 bg-gray-200/70 rounded-full ml-auto skeleton-shimmer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS VIEW (below sm) ================= */}
      <div className="block sm:hidden divide-y divide-gray-100 p-2 space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-gray-50/60 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4.5 bg-gray-200/90 rounded w-24 skeleton-shimmer" />
              <div className="h-5 bg-gray-200/80 rounded-full w-20 skeleton-shimmer" />
            </div>

            <div className="space-y-1">
              <div className="h-4 bg-gray-200/90 rounded w-40 skeleton-shimmer" />
              <div className="h-3 bg-gray-200/70 rounded w-52 skeleton-shimmer" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-3.5 bg-gray-200/70 rounded w-20 skeleton-shimmer" />
              <div className="h-5 bg-gray-200/90 rounded w-16 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Pagination Skeleton
export const OrdersPaginationSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs select-none pointer-events-none"
    >
      <div className="h-3.5 bg-gray-200/80 rounded w-44 skeleton-shimmer" />
      <div className="flex items-center gap-2">
        <div className="h-7 w-20 bg-gray-100 rounded-lg border border-gray-200/60 skeleton-shimmer" />
        <div className="flex gap-1">
          <div className="h-7 w-7 bg-gray-100 rounded-lg border border-gray-200/60 skeleton-shimmer" />
          <div className="h-7 w-7 bg-gray-100 rounded-lg border border-gray-200/60 skeleton-shimmer" />
        </div>
        <div className="h-7 w-16 bg-gray-100 rounded-lg border border-gray-200/60 skeleton-shimmer" />
      </div>
    </div>
  );
};

// 5. Full Orders Page Skeleton (Used on initial page load with zero CLS)
export const OrdersPageSkeleton = () => {
  const commonCss = "bg-white rounded-2xl border border-gray-200/90 shadow-xs";

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto">
      {/* 4 Dashboard Stat Cards */}
      <OrdersStatsSkeleton />

      {/* Main Container */}
      <div className={`${commonCss} space-y-3 p-4`}>
        {/* Search & Filter Header */}
        <OrdersFilterSkeleton />

        {/* Order Table Skeleton (5 rows) */}
        <OrdersTableBodySkeleton count={6} />

        {/* Pagination Skeleton */}
        <OrdersPaginationSkeleton />
      </div>
    </div>
  );
};

export default OrdersPageSkeleton;
