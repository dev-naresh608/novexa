import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ProductContext, CategoryContext } from "../../contexts/context";
import { ProductImageLoader, GradientButton } from "../../components/component";

function Category() {
  const [showCategoriesAsScreen, setShowCategoriesAsScreen] = useState([]);

  const [showAllCategoryEnable, setShowAllCategoryEnable] = useState(false);
  const [showCatBtnText, setShowCatBtnText] = useState("Show All");

  const { categories } = useContext(CategoryContext);

  const [screenWidth, setScreenWidth] = useState(0);

  const navigate = useNavigate();
  const html = document.documentElement;

  useEffect(() => {
    const width = Math.floor(html.clientWidth / 250);
    setScreenWidth(width);

    if (showAllCategoryEnable) {
      setShowCategoriesAsScreen(categories);
      setShowCatBtnText("Show Less");
    } else {
      if (categories?.length > 0) {
        setShowCatBtnText("Show All");
        setShowCategoriesAsScreen(categories.slice(0, screenWidth));
      }
    }
  }, [categories, showAllCategoryEnable, setScreenWidth, screenWidth]);
  return (
    <>
      <section className="pb-10 m-auto">
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
