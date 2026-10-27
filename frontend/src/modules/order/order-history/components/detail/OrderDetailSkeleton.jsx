import React from "react";
import { ArrowLeftIcon } from "lucide-react";

/**
 * YouTube-style white-gray Shimmer Skeleton for Order Detail Page
 * Matches exact responsive grid (md:grid-cols-12) to ensure 0 layout shift (CLS).
 */
export const OrderDetailSkeleton = () => {
  const cardBase =
    "bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 select-none pointer-events-none";

  return (
    <div aria-hidden="true" className="space-y-4 font-sans max-w-7xl mx-auto">
      {/* Back button silhouette */}
      <div className="pb-1 flex items-center gap-1.5 text-gray-400">
        <ArrowLeftIcon size={18} strokeWidth={2.5} className="text-gray-300" />
        <div className="h-4 bg-gray-200/80 rounded w-28 skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5">
        {/* ============= 1. ORDER HEADER SKELETON ============= */}
        <div className="md:col-span-12">
          <div className={cardBase}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200/90 rounded-md w-36 sm:w-48 skeleton-shimmer" />
                <div className="h-3.5 bg-gray-200/70 rounded w-28 skeleton-shimmer" />
              </div>
              <div className="h-7 w-32 bg-gray-100 border border-gray-200/60 rounded-2xl skeleton-shimmer shrink-0" />
            </div>
          </div>
        </div>

        {/* ============= 2. CUSTOMER INFO SKELETON ============= */}
        <div className="md:col-span-6 lg:col-span-4">
          <div className={`${cardBase} h-full space-y-3.5`}>
            {/* Section label */}
            <div className="h-3 bg-gray-200/80 rounded w-28 skeleton-shimmer" />

            <div className="space-y-3 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-gray-100 skeleton-shimmer shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200/70 rounded w-14 skeleton-shimmer" />
                    <div className="h-3.5 bg-gray-200/90 rounded w-32 skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============= 3. ADDRESS SKELETON ============= */}
        <div className="md:col-span-6 lg:col-span-4">
          <div className={`${cardBase} h-full space-y-3.5`}>
            {/* Section label */}
            <div className="h-3 bg-gray-200/80 rounded w-32 skeleton-shimmer" />

            <div className="space-y-4 pt-1">
              {/* Pickup Store */}
              <div className="space-y-1.5">
                <div className="h-3 bg-gray-200/70 rounded w-20 skeleton-shimmer" />
                <div className="h-4 bg-gray-200/90 rounded w-36 skeleton-shimmer" />
                <div className="h-3 bg-gray-200/60 rounded w-48 skeleton-shimmer" />
              </div>

              {/* Delivery Destination */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="h-3 bg-gray-200/70 rounded w-24 skeleton-shimmer" />
                <div className="h-3.5 bg-gray-200/80 rounded w-44 skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* ============= 4. PRICE BREAKDOWN SKELETON ============= */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className={`${cardBase} h-full space-y-3.5`}>
            {/* Section label */}
            <div className="h-3 bg-gray-200/80 rounded w-32 skeleton-shimmer" />

            <div className="space-y-2.5 pt-1 border-b border-gray-100 pb-3">
              {[
                { w1: "w-16", w2: "w-14" },
                { w1: "w-20", w2: "w-12" },
                { w1: "w-14", w2: "w-10" },
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className={`h-3 bg-gray-200/70 rounded ${row.w1} skeleton-shimmer`} />
                  <div className={`h-3.5 bg-gray-200/90 rounded ${row.w2} skeleton-shimmer`} />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-1">
              <div className="h-4 bg-gray-200/90 rounded w-16 skeleton-shimmer" />
              <div className="h-5 bg-gray-200/90 rounded w-20 skeleton-shimmer" />
            </div>
          </div>
        </div>

        {/* ============= 5. ORDER ITEMS SKELETON ============= */}
        <div className="md:col-span-12 lg:col-span-8">
          <div className={`${cardBase} space-y-3.5`}>
            {/* Section label + count pill */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 bg-gray-200/80 rounded w-16 skeleton-shimmer" />
              <div className="h-4 bg-gray-100 rounded-full w-14 skeleton-shimmer" />
            </div>

            <div className="space-y-3 pt-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 bg-gray-50/50"
                >
                  {/* Item Image Silhouette */}
                  <div className="w-14 h-14 rounded-xl bg-gray-200/90 shrink-0 skeleton-shimmer flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="h-4 bg-gray-200/90 rounded w-36 sm:w-52 skeleton-shimmer" />
                    <div className="h-3 bg-gray-200/70 rounded w-20 skeleton-shimmer" />
                    <div className="h-3 bg-gray-200/80 rounded w-28 skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============= 6. ORDER IDENTIFIERS SKELETON ============= */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className={`${cardBase} space-y-3.5`}>
            {/* Section label */}
            <div className="h-3 bg-gray-200/80 rounded w-32 skeleton-shimmer" />

            <div className="space-y-3.5 pt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 bg-gray-200/70 rounded w-20 skeleton-shimmer" />
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 bg-gray-200/90 rounded w-40 skeleton-shimmer" />
                    <div className="w-4 h-4 rounded bg-gray-200/70 skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;
