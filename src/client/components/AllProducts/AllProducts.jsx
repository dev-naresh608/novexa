import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import ProductBuyCard from "./ProductBuyCard";
import { ProductContext, UserContext } from "../../contexts/context";

import { GradientButton } from "..";
import axios from "axios";
function AllProducts() {
  const { restId = null } = useParams();
  const [totalProducts, setTotalProducts] = useState([]);
  const { storeLisst, productsList } = useContext(ProductContext);
  const { setActiveTab, isLogin, currentUser, userData } =
    useContext(UserContext);

  useEffect(() => {
    // const product = storeLisst.find((r) => r.id === restId);
    // setTotalProducts(product?.productList || []);

    const fetchProduct = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/stores/allproducts/${restId}`,
      );
      if (!data.success) {
        toast.error(data.message);
        returnl;
      }
      if (!data.result) {
        setTotalProducts(null);
      }
      setTotalProducts(data.result);
    };
    fetchProduct();

    if (!restId) {
      setTotalProducts(productsList);
    }
  }, [currentUser, userData, productsList]);

  if (!isLogin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
         Login to get All products
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There is a no products available on this app.
        </p>
      </div>
    );
  }
  if (!totalProducts)
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
              price={p.product_selling_price}
              id={p._id}
              key={index}
              is_product_in_stock={p.is_product_in_stock}
              is_offer_available={p.is_offer_available}
              offer_price={p.product_offer_price}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default AllProducts;
