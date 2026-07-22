import React from "react";
import { useNavigate } from "react-router-dom";
function EmptyProducts() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center justify-center text-center py-16">
      <h2 className="text-lg font-semibold text-gray-600">Add Products</h2>
      <button
        onClick={() => navigate("/addproducts")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Continue to Add Products
      </button>
    </section>
  );
}

export default EmptyProducts;
