import React from "react";

export default function PaymentMethod({ paymentMethod, onChange }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">
        Payment Method
      </p>

      <select
        className="bg-gray-200/40 rounded-md border text-xs tracking-tight px-2 py-1.5 text-gray-700 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none cursor-pointer"
        onChange={onChange}
        value={paymentMethod}
      >
        <option value="cashOnDelivery">Cash On Delivery</option>
        <option value="online">Online Payment</option>
      </select>
    </div>
  );
}
