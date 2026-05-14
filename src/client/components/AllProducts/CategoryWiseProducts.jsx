import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GradientButton, ProductBuyCard } from "../index";
import { ProductContext, CategoryContext } from "../../contexts/context";
import { ToastContainer } from "react-toastify";
import { db } from "../../db";

function CategoryWiseProducts() {
  const { productsList } = useContext(ProductContext);
  const { catName } = useParams();
  const [selectedCategoryProduct, setSelectedCategoryProduct] = useState([]);
  // const [catName, setCatName] = useState("");
  const { categories } = useState(CategoryContext);

  useEffect(() => {
    if (productsList?.length > 0) {
      const product = productsList.filter((p) =>
        catName.includes(p.product_category),
      );
      setSelectedCategoryProduct(product);
    }
  }, [productsList]);
  return (
    <>
      <section>
        <GradientButton componentType="p" className="mb-5 cursor-text">
          {catName}
        </GradientButton>

        {selectedCategoryProduct.length !== 0 ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
              {selectedCategoryProduct?.map((p, index) => (
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-600">
              No Products Available 📦
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              There is a no products available in {catName} category
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default CategoryWiseProducts;
