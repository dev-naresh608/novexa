import React from "react";
import { useNavigate } from "react-router-dom";
export default function EmptyCart() {
  const navigate = useNavigate();
  
  return (
    <section className="flex flex-col items-center justify-center text-center py-16">
      <h2 className="text-lg font-semibold text-gray-600">
        Your Cart is Empty 🛒
      </h2>
      <button
        onClick={() => navigate("/stores")}
        className="active:scale-95 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Continue Shopping
      </button>
    </section>
  );
}