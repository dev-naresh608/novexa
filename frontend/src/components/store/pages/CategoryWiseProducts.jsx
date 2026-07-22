import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GradientButton, ProductBuyCard, StoreCard } from "../..";
import { defaultRest } from "@/assets";

import {
  ProductContext,
  CategoryContext,
  UserContext,
} from "../../../contexts/context";
import { toast } from "react-toastify";
import { db } from "../../../db";
import { div } from "framer-motion/client";
import { Store } from "lucide-react";

function CategoryWiseProducts() {
  const { storeLisst } = useContext(ProductContext);
  const { catName } = useParams();

  const [selectedCategoryProduct, setSelectedCategoryProduct] = useState([]);
  // const [catName, setCatName] = useState("");
  const { categories } = useState(CategoryContext);
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    if (storeLisst?.length > 0) {
      const stores = storeLisst.filter((r) =>
        catName.includes(r.store_type),
      );
      setSelectedCategoryProduct(stores);
    }
  }, [storeLisst, currentUser]);

  if (selectedCategoryProduct.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Store size={120} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-600">
            No Stores Yet
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            There is a no Stores available on this category.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-2xl font-semibold">Stores as per category: </p>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
        {selectedCategoryProduct.map((r, i) => {
          return (
            <StoreCard
              key={i}
              defaultRest={defaultRest}
              name={r.store_name}
              address={r.store_address}
              productsLength={r.productList?.length || 0}
              id={r.id}
            />
          );
        })}
      </div>
    </>
  );
}

export default CategoryWiseProducts;
