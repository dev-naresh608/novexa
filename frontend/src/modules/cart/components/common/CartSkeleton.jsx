import React from "react";

export default function CartSkeleton() {
  return (
    <div className="w-full animate-pulse p-5 bg-white rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left item list placeholder */}
        <div className="flex-1 border rounded-2xl p-4 space-y-4">
          <div className="flex justify-between items-end border-b pb-2 mb-3">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center pt-2">
                <div className="flex gap-3 items-center">
                  <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-8 justify-self-center"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side summary panel placeholder */}
        <div className="w-full lg:w-[380px] border rounded-2xl p-5 space-y-5">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
