import React from "react";
import { AlignLeft } from "lucide-react";
import { SectionCard, SectionLabel } from "../../../../index";

function ProductDescriptionCard({
  isEditing,
  formData,
  onChange,
  product,
}) {
  const description = isEditing ? formData.product_description : product?.product_description;

  return (
    <SectionCard className="p-6 h-full flex flex-col">
      <div>
        <SectionLabel className="mb-4 flex items-center gap-1.5">
          <AlignLeft size={16} />
          Product Description
        </SectionLabel>
      </div>

      <div className="flex-grow">
        {isEditing ? (
          <textarea
            name="product_description"
            value={formData.product_description}
            onChange={onChange}
            rows={5}
            placeholder="Write a description for your product..."
            className="w-full h-full min-h-[120px] p-3 text-xs border rounded-xl outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white"
          />
        ) : (
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-4 border rounded-xl min-h-[120px]">
            {description || "No description provided for this product."}
          </p>
        )}
      </div>
    </SectionCard>
  );
}

export default ProductDescriptionCard;
