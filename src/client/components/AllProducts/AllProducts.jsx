import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useLoaderData } from "react-router-dom";
import ProductBuyCard from "./ProductBuyCard";
import { ProductContext, UserContext } from "../../contexts/context";
import { ToastContainer } from "react-toastify";
import { GradientButton} from "../index"
function AllProducts() {
  const [totalProducts, setTotalProducts] = useState([]);
  const { productsList } = useContext(ProductContext);

  const { setActiveTab,isLogin } = useContext(UserContext);

  return (
    <>
      <section className={`${isLogin? "" : "px-10"}`}>
        <GradientButton
          // componentType="text"
          className="cursor-text mb-5 font-bold rounded-3xl"
        >
          All Products
        </GradientButton>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          <ToastContainer
            autoClose={500}
            closeOnClick
            draggable
            position="bottom-right"
          />
          {productsList?.map((p, index) => (
            <ProductBuyCard
              name={p.product_name}
              src={p.product_url}
              price={p.product_price}
              id={p.product_id}
              key={index}
              isProductInStock={p.isProductInStock}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default AllProducts;
