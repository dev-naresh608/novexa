import React, { useState } from "react";
import { Package } from "lucide-react";

function ProductImageLoader({ src, name, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const displayName = alt || name || "Product";

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/90 text-gray-400 p-2 select-none">
        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600/50" strokeWidth={1.5} />
        <span className="text-[10px] text-gray-400 font-medium mt-1 truncate max-w-full px-1 text-center">
          {displayName}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={displayName}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`object-contain w-full h-full max-h-full p-2 group-hover:scale-105 transition-all duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default ProductImageLoader;
