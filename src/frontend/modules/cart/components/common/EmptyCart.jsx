import { ShoppingCartIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-lg font-semibold text-gray-500">
        <ShoppingCartIcon size={120} />
        {/* Your Cart is Empty 🛒 */}
        <span>Your Cart is Empty</span>
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
