import React from "react";
import { CategoryContext } from "./context";

function CategoryContextProvider({ children }) {
  const categories = [
    {
      catName: "Fruits",  
      catIcon: "🍉",
    },
    {
      catName: "Vegetables",
      catIcon: "🥕",
    },
    {
      catName: "Bakery",
      catIcon: "🍞",
    },
    {
      catName: "Dairy Products",
      catIcon: "🫙",
    },
    {
      catName: "Chips & Namkeen",
      catIcon: "🍟",
    },
    {
      catName: "Cold Drinks & Juices",
      catIcon: "🥤",
    },
    {
      catName: "Ice Creams & More",
      catIcon: "🍧",
    },
    {
      catName: "Others",
      catIcon: "⠀",
    },
  ]
  return <CategoryContext.Provider value={{categories}}>{children}</CategoryContext.Provider>;
}

export default CategoryContextProvider;
