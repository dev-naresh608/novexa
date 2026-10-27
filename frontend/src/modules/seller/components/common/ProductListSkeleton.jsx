import React from "react";

/**
 * YouTube-style white-gray Shimmer Skeleton for Seller Product Inventory Page
 * Responsive across mobile and desktop.
 */
export const ProductListSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-3.5 font-sans max-w-7xl mx-auto px-1 sm:px-2 py-1 select-none pointer-events-none">
      {/* 1. Page Header Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-200/70 rounded w-24 skeleton-shimmer" />
            <div className="h-6 sm:h-7 bg-gray-200/90 rounded-lg w-48 sm:w-56 skeleton-shimmer" />
            <div className="h-3.5 bg-gray-200/60 rounded w-36 sm:w-44 skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer shrink-0" />
            <div className="h-9 w-28 bg-emerald-600/20 rounded-xl skeleton-shimmer shrink-0" />
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Search Input Silhouette */}
          <div className="h-10 bg-gray-100 rounded-xl border border-gray-200/60 flex-1 min-w-[200px] skeleton-shimmer" />

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <div className="h-9 w-32 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer" />
            <div className="h-9 w-28 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer" />
            <div className="h-9 w-28 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer" />
            <div className="h-9 w-18 bg-gray-100 rounded-xl border border-gray-200/60 skeleton-shimmer" />
          </div>
        </div>

        {/* 3. Products Table Skeleton */}
        <div className="border border-gray-200/80 rounded-xl overflow-hidden mt-2">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200/80">
                <tr>
                  {["Product", "Category", "Stock", "Price", "Status", "Actions"].map((th, i) => (
                    <th key={i} className="px-4 py-3.5">
                      <div className="h-3.5 bg-gray-200/80 rounded w-16 skeleton-shimmer" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    {/* Product cell with image */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200/90 skeleton-shimmer shrink-0" />
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200/90 rounded w-36 skeleton-shimmer" />
                          <div className="h-3 bg-gray-200/60 rounded w-20 skeleton-shimmer" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="h-5 bg-gray-100 rounded-md w-20 skeleton-shimmer" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="h-5 bg-emerald-50 rounded-full w-16 skeleton-shimmer" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="h-4 bg-gray-200/90 rounded w-14 skeleton-shimmer" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="h-5 bg-gray-100 rounded-full w-20 skeleton-shimmer" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg skeleton-shimmer" />
                        <div className="w-7 h-7 bg-gray-100 rounded-lg skeleton-shimmer" />
                        <div className="w-7 h-7 bg-gray-100 rounded-lg skeleton-shimmer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden divide-y divide-gray-100 p-2 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-gray-50/50 rounded-xl space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-200/90 skeleton-shimmer shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-4 bg-gray-200/90 rounded w-36 skeleton-shimmer" />
                    <div className="h-3 bg-gray-200/60 rounded w-24 skeleton-shimmer" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="h-4 bg-gray-200/90 rounded w-16 skeleton-shimmer" />
                  <div className="h-5 bg-gray-100 rounded-full w-20 skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListSkeleton;
