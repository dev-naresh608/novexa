import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddressForm,
  generateAddressLine,
  onCartPlaceOrder,
} from "../../index";
function OrderSummary({
  currentUser,
  setCurrentUser,
  userId,
  onPlaceOrder,
  orderPriceDetails,
  handlePaymentMethod,
  paymentMethod,
  address,
  setAddress,
  addressList,
  setIsAddressFormOpen,
  isAddressFormOpen,
  storeId,
}) {
  const { subTotal, deliveryCharge, taxPrice, finalPrice } = orderPriceDetails;
  const isAddressAvailable = false;
  const currentUserAddress = false;
  const navigate = useNavigate();

  const handleAddressChange = (e) => {
    const addressId = e.target.value;

    const selectedAddress = addressList.find((a) => a._id === addressId);
    setAddress(selectedAddress);
    setCurrentUser((prev) => ({
      ...prev,
      address: selectedAddress,
    }));
  };

  return (
    <>
      <div className="w-full lg:w-[380px] rounded-2xl border p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>

        <hr className="mb-4" />

        {!addressList ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-2 text-center text-sm">
            <button
              className="font-medium hover:underline"
              onClick={() => setIsAddressFormOpen((prev) => !prev)}
            >
              + Add Address
            </button>
          </div>
        ) : (
          <div className="mb-5">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Delivery Address
              </p>
            </div>
            <div className="text-right">
              <button
                className="font-medium hover:underline text-blue-700"
                onClick={() => setIsAddressFormOpen((prev) => !prev)}
              >
                add new
              </button>
            </div>
            <select
              className="bg-gray-200/40 rounded-md border text-xs tracking-tight px-1 py-0.5 text-gray-700 w-full mt-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              onChange={handleAddressChange}
            >
              {addressList?.map((a, i) => {
                return (
                  <option key={i} value={a._id}>
                    {generateAddressLine(a)}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* PAYMENT */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">
            Payment Method
          </p>

          <select
            className="bg-gray-200/40 rounded-md border text-xs tracking-tight px-1 py-0.5 text-gray-700 w-full mt-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            onChange={handlePaymentMethod}
          >
            <option value="cashOnDelivery">Cash On Delivery</option>
            <option value="online">Online</option>
          </select>
        </div>

        <hr className="mb-4" />

        {/* PRICE DETAILS */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Price</span>
            <span className="font-medium">${subTotal}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="text-green-500 font-medium">Free</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Tax (2%)</span>
            <span className="font-medium">${taxPrice}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 text-base font-bold text-gray-800 border-t pt-3">
          <span>Total</span>
          <span>${finalPrice}</span>
        </div>

        <button
          className="active:scale-95 w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition"
          onClick={() =>
            onCartPlaceOrder(
              currentUser,
              setCurrentUser,
              storeId,
              orderPriceDetails,
              address,
              paymentMethod,
              navigate
            )
          }
        >
          Place Order
        </button>
      </div>

      {isAddressFormOpen && (
        <AddressForm
          closeBtnAction={setIsAddressFormOpen}
          userId={userId}
          setAddress={setAddress}
        />
      )}
    </>
  );
}

export default OrderSummary;