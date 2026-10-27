import React from "react";
import { Star } from "lucide-react";

function RatingStar({ count = 4, total = 5, size = 13 }) {
  return (
    <div className="star-icon-container flex items-center gap-0.5">
      {[...Array(total)].map((_, i) => (
        <Star
          key={i}
          fill={i < count ? "#166534" : "#ffffff"}
          stroke={i < count ? "#166534" : "#d1d5db"}
          size={size}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default RatingStar;
