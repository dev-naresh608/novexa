import React from "react";
import { ArrowRight } from "lucide-react";
import { useModal, MODAL_TYPES } from "../../../../components";

export default function CheckoutButton({ isLogin, onPlaceOrder }) {
  const { openModal } = useModal();

  if (isLogin) {
    return (
      <button
        className="active:scale-95 w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition shadow-sm hover:shadow-md outline-none"
        onClick={onPlaceOrder}
      >
        Place Order
      </button>
    );
  }

  return (
    <button
      className="flex items-center gap-2 px-3 w-full justify-center active:scale-95 mt-6 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-medium transition shadow-sm hover:shadow-md outline-none"
      onClick={() => openModal(MODAL_TYPES.LOGIN)}
    >
      Login to buy items
      <ArrowRight size={18} />
    </button>
  );
}
