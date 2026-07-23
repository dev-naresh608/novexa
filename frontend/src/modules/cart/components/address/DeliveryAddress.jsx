import React from "react";
import { useModal, MODAL_TYPES } from "../../../../components";
import AddressSelector from "./AddressSelector";

export default function DeliveryAddress({
  isLogin,
  userId,
  addressList,
  address,
  setAddress,
  setCurrentUser,
}) {
  const { openModal } = useModal();

  if (!isLogin) {
    return (
      <div className="mb-5">
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Delivery Address
          </p>
        </div>
        <p className="bg-gray-200/40 rounded-md border text-xs tracking-tight px-2 py-2 text-gray-500 w-full mt-2">
          Login to get Delivery Address
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center border-b pb-1 mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Delivery Address
        </p>
        <button
          className="text-xs font-medium hover:underline text-indigo-600 hover:text-indigo-800 cursor-pointer outline-none"
          onClick={() => openModal(MODAL_TYPES.ADDRESS, { userId, setAddress })}
        >
          {addressList && addressList.length > 0 ? "Add New" : "+ Add"}
        </button>
      </div>

      {!addressList || addressList.length === 0 ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-center text-xs">
          <p className="mb-1 text-gray-500">No delivery address found</p>
          <button
            className="font-semibold underline cursor-pointer outline-none hover:text-red-800"
            onClick={() => openModal(MODAL_TYPES.ADDRESS, { userId, setAddress })}
          >
            Create Address
          </button>
        </div>
      ) : (
        <AddressSelector
          addressList={addressList}
          address={address}
          setAddress={setAddress}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
}
