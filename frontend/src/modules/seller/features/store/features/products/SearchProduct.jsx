import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductBuyCard from "./ProductBuyCard";

function SearchProduct() {
  const productsList = useSelector((state) => state.product.productsList);
  const { searchValue } = useParams();
  const totalProducts = (productsList || []).filter((p) =>
    p.product_name?.toLowerCase().includes((searchValue || "").toLowerCase().trim()),
  );

  if (totalProducts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Products Found 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There are no products available matching your search.
        </p>
      </div>
    );
  }

  return (
    <section className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-4">
        <span className="inline-block rounded-xl px-3 py-1 text-sm sm:text-base font-bold bg-green-100 text-green-800 border border-green-200 shadow-xs">
          Search Results: {searchValue}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {totalProducts?.map((p, index) => (
          <ProductBuyCard
            name={p.product_name}
            src={p.product_url}
            price={p.product_selling_price}
            id={p._id || p.product_id}
            key={p._id || index}
            is_product_in_stock={p.is_product_in_stock ?? p.isProductInStock}
            is_offer_available={p.is_offer_available}
            offer_price={p.product_offer_price}
          />
        ))}
      </div>
    </section>
  );
}

export default SearchProduct;
