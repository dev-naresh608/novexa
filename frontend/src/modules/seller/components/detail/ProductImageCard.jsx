import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { SectionCard, SectionLabel } from "../../../../index";

function ProductImageCard({ productUrl, productName }) {
  return (
    <SectionCard className="p-6 h-full flex flex-col justify-between">
      <div>
        <SectionLabel className="mb-4">Product Image</SectionLabel>
      </div>
      <div className="flex-grow flex items-center justify-center min-h-[200px] border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-4">
        {productUrl ? (
          <img
            src={productUrl}
            alt={productName || "Product image"}
            className="max-h-48 object-contain rounded-xl hover:scale-105 duration-300 transition-transform"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon size={48} strokeWidth={1.5} />
            <span className="text-sm">No Image Available</span>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default ProductImageCard;
