import React from "react";
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
return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContextProvider;
