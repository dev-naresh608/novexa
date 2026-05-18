import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductBuyCard from "./ProductBuyCard";
import { ProductContext } from "../../contexts/context";

function SearchProduct() {
  const { productsList } = useContext(ProductContext);
  const { searchValue } = useParams();
  const [totalProducts, setTotalProducts] = useState([]);

  useEffect(() => {
    const filteredProducts = productsList.filter((p) =>
      p.product_name.toLowerCase().includes(searchValue.toLowerCase().trim()),
    );
    setTotalProducts(filteredProducts);
  }, [searchValue]);

  return (
    <>
      <section className="p-10">
        <p className="w-max rounded-2xl px-3 mb-5 text-xl font-semibold bg-gradient-to-r from-green-500 to-green-200">
          Products
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
          {totalProducts.length === 0 ? (
            <h2 className="text-3xl whitespace-nowrap">No Products Found !!</h2>
          ) : (
            totalProducts?.map((p, index) => (
              <ProductBuyCard
                name={p.product_name}
                src={p.product_url}
                price={p.product_price}
                id={p.product_id}
                key={index}
                isProductInStock={p.isProductInStock}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default SearchProduct;
