import React from "react";
import { Star } from "lucide-react";
function RatingStar() {
  return (
    <>
      <div className="star-icon-container flex items-center gap-0.5">
        <Star fill="#166534" size={18} strokeWidth={1} />
        <Star fill="#166534" size={18} strokeWidth={1} />
        <Star fill="#166534" size={18} strokeWidth={1} />
        <Star fill="#166534" size={18} strokeWidth={1} />
        <Star fill="#ffffff" size={18} strokeWidth={1} />
      </div>
    </>
  );
}

export default RatingStar;
