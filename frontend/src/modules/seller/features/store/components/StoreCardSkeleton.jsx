import React from "react";

export const StoreCardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-xs select-none pointer-events-none"
    >
      {/* Store Image Skeleton with Store Silhouette Icon */}
      <div className="relative shrink-0 w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-gray-100/90 border border-gray-100 flex items-center justify-center">
        {/* Soft store building SVG silhouette */}
        <svg
          className="w-10 h-10 text-gray-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Store Information Skeleton */}
      <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
        <div>
          {/* Header Row: Title & Star Rating Skeleton */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-4 sm:h-4.5 bg-gray-200/90 rounded-md w-3/5 sm:w-44 skeleton-shimmer" />
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-100/80 skeleton-shimmer" />
              <div className="h-3.5 bg-gray-200/90 rounded w-6 skeleton-shimmer" />
            </div>
          </div>

          {/* Category Tag pill Skeleton */}
          <div className="mt-2">
            <div className="h-4 sm:h-4.5 bg-emerald-50 border border-emerald-100/70 rounded-md w-24 sm:w-28 skeleton-shimmer" />
          </div>

          {/* Address Line with Location Pin Skeleton */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-3.5 h-3.5 rounded-full bg-gray-200/90 shrink-0 skeleton-shimmer" />
            <div className="h-3 bg-gray-200/80 rounded w-4/5 max-w-[220px] skeleton-shimmer" />
          </div>
        </div>

        {/* Footer Action Row: Browse Store + Save Bookmark */}
        <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-gray-50">
          <div className="h-3.5 bg-gray-200/80 rounded w-20 sm:w-24 skeleton-shimmer" />
          <div className="h-3.5 bg-gray-200/80 rounded w-10 sm:w-12 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const StoreGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
      {[...Array(count)].map((_, idx) => (
        <StoreCardSkeleton key={idx} />
      ))}
    </div>
  );
};

// Full page skeleton for /stores so top controls and cards load together
export const StoresPageSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="space-y-4 font-sans select-none pointer-events-none"
    >
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-32 bg-gray-200/80 rounded-md skeleton-shimmer mb-3" />

      {/* Header & Search Bar Card Skeleton */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200/90 rounded-lg skeleton-shimmer" />
          <div className="h-3.5 w-64 bg-gray-200/70 rounded-md skeleton-shimmer" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 h-10 bg-gray-100/90 border border-gray-200/60 rounded-xl skeleton-shimmer" />
          <div className="w-full sm:w-36 h-10 bg-gray-100/90 border border-gray-200/60 rounded-xl skeleton-shimmer shrink-0" />
        </div>
      </div>

      {/* Grid of Stores Skeleton */}
      <StoreGridSkeleton count={6} />
    </div>
  );
};

// Full page skeleton for /wishlist
export const WishlistSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="space-y-5 h-full max-h-[90vh] select-none pointer-events-none"
    >
      <div className="space-y-2">
        <div className="h-7 w-48 bg-gray-200/90 rounded-xl skeleton-shimmer" />
        <div className="h-4 w-64 bg-gray-200/70 rounded-md skeleton-shimmer" />
      </div>

      <StoreGridSkeleton count={6} />
    </div>
  );
};

export default StoreCardSkeleton;
