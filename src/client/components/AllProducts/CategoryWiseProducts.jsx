import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  GradientButton,
  ProductBuyCard,
  Restaurant,
} from "../component";
import {defaultPP,defaultRest} from "../../assets/assets"

import { ProductContext, CategoryContext } from "../../contexts/context";
import { toast } from "react-toastify";
import { db } from "../../db";
import { div } from "framer-motion/client";

function CategoryWiseProducts() {
  const { restaurantList } = useContext(ProductContext);
  const { catName } = useParams();
  const [selectedCategoryProduct, setSelectedCategoryProduct] = useState([]);
  // const [catName, setCatName] = useState("");
  const { categories } = useState(CategoryContext);

  useEffect(() => {
    if (restaurantList?.length > 0) {
      const restaurants = restaurantList.filter((r) =>
        catName.includes(r.restaurant_type),
      );
      setSelectedCategoryProduct(restaurants);
    }
  }, [restaurantList]);

  if (selectedCategoryProduct.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <img src={defaultRest} alt="restaurant logo image" />
          <h2 className="text-lg font-semibold text-gray-600">
            No Restaurants Yet 
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            There is a no restaurants available on this category.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-2xl font-semibold">Restaurants as per category: </p>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
        {selectedCategoryProduct.map((r, i) => {
          return <Restaurant
            key={i}
            defaultRest={defaultRest}
            name={r.restaurant_name}
            address={r.restaurant_address}
            productsLength={r.productList?.length || 0}
            id={r.id}
          />;
        
        })}
      </div>
    </>
  );
}

export default CategoryWiseProducts;
