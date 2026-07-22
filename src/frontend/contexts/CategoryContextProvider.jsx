import React, { useEffect, useState, useContext } from "react";
import { CategoryContext } from "./context";

function CategoryContextProvider({ children }) {
  const categories = [
    {
      catName: "Fruits & Vegetables",
      catIcon: "🥕",
    },
    {
      catName: "Dairy & Bakery",
      catIcon: "🍞",
    },
    {
      catName: "Snacks & Beverages",
      catIcon: "🥤",
    },
    {
      catName: "Rice, Atta & Pulses",
      catIcon: "🌾",
    },
    {
      catName: "Spices & Oils",
      catIcon: "🌶️",
    },
    {
      catName: "Packaged Foods",
      catIcon: "📦",
    },
    {
      catName: "Cleaning & Household",
      catIcon: "🧹",
    },
    {
      catName: "Personal Care",
      catIcon: "🧴",
    },
    {
      catName: "Others",
      catIcon: "🧺",
    },
  ];

  const [showAllCategoryEnable, setShowAllCategoryEnable] = useState(false);
  const [showCategoriesAsScreen, setShowCategoriesAsScreen] = useState([]);
  const [screenWidth, setScreenWidth] = useState(0);
  const html = document.documentElement;
  const [showCatBtnText, setShowCatBtnText] = useState("Show All");

  useEffect(() => {
    const updateCategories = () => {
      const width = Math.floor(window.innerWidth / 250);

      setScreenWidth(width);

      if (showAllCategoryEnable) {
        setShowCategoriesAsScreen(categories);
        setShowCatBtnText("Show Less");
      } else {
        setShowCatBtnText("Show All");
        setShowCategoriesAsScreen(categories.slice(0, width));
      }
    };

    updateCategories();

    window.addEventListener("resize", updateCategories);

    return () => window.removeEventListener("resize", updateCategories);
  }, [showAllCategoryEnable]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        showAllCategoryEnable,
        setShowAllCategoryEnable,
        showCategoriesAsScreen,
        setShowCategoriesAsScreen,
        screenWidth,
        setScreenWidth,
        showCatBtnText,
        setShowCatBtnText,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContextProvider;
