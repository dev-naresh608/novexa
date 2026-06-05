import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ProductContext, CategoryContext } from "../../contexts/context";
import { ProductImageLoader, GradientButton } from "../../components/component";

function Category() {
  const {
    categories,
    showAllCategoryEnable,
    setScreenWidth,
    screenWidth,
    showCategoriesAsScreen,
    setShowCategoriesAsScreen,
    setShowAllCategoryEnable,
    showCatBtnText,
    setShowCatBtnText,
  } = useContext(CategoryContext);
  return (
    <>
      <section className="p-10 m-auto bg-gray-200/80 rounded-2xl">
        <div>
          <GradientButton componentType="text" className="w-max mb-3 ">
            Categories
          </GradientButton>
        </div>

        <div className="grid sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5 text-center sm:grid-rows-[150px]">
          {showCategoriesAsScreen?.map((product, index) => (
            <Link
              to={`/categories/categoryWiseProducts/${product.catName}`}
              // to={`/categories`}
              key={index}
              className={
                "rounded-2xl group " +
                (index % 2 === 0 ? "bg-green-200" : "bg-yellow-200")
              }
            >
              <div className="flex items-center justify-center group-hover:scale-110 duration-300 text-5xl py-5">
                {product.catIcon}
              </div>
              <div className="flex justify-center">
                <p className="font-semibold text-sm mb-2">{product.catName}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-right mt-5">
          <GradientButton
            componentType="button"
            to="/allproducts"
            onClick={() => setShowAllCategoryEnable((prev) => !prev)}
          >
            {showCatBtnText}
          </GradientButton>
        </div>
      </section>
    </>
  );
}

export default Category;
