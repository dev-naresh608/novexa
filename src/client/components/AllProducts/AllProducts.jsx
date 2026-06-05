import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import ProductBuyCard from "./ProductBuyCard";
import { ProductContext, UserContext } from "../../contexts/context";

import { GradientButton } from "../component";
function AllProducts() {
  const { restId = null } = useParams();
  const [totalProducts, setTotalProducts] = useState([]);
  const { storeLisst, productsList } = useContext(ProductContext);
  const { setActiveTab, isLogin, currentUser, userData } =
    useContext(UserContext);

  useEffect(() => {
    const product = storeLisst.find((r) => r.id === restId);
    setTotalProducts(product?.productList || []);
    if (!restId) {
      setTotalProducts(productsList);
    }
  }, [currentUser,userData, productsList]);

  if (totalProducts.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Products Yet 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There is a no products available on this app.
        </p>
      </div>
    );

  return (
    <>
      <section className={`${isLogin ? "" : "px-10"}`}>
        <GradientButton
          // componentType="text"
          className="cursor-text mb-5 font-bold rounded-3xl"
        >
          All Products
        </GradientButton>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,270px))] gap-5">
          {totalProducts?.map((p, index) => (
            <ProductBuyCard
              name={p.product_name}
              src={p.product_url}
              price={p.product_price}
              id={p.product_id}
              key={index}
              isProductInStock={p.isProductInStock}
              isOfferAvailable={p.isOfferAvailable}
              offer_price={p.product_offer_price}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default AllProducts;
