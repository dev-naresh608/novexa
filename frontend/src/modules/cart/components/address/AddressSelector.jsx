import React, { useMemo } from "react";
import { generateAddressLine } from "../../../address/services/addressLine";

export default function AddressSelector({
  addressList = [],
  address,
  selectedAddress,
  setAddress,
  onSelectAddress,
  setCurrentUser,
}) {
  const currentAddress = address || selectedAddress;
  const updateAddress = setAddress || onSelectAddress;

  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    const selected = (addressList || []).find(
      (a) => String(a._id || a.id) === String(addressId)
    );
    if (selected) {
      if (typeof updateAddress === "function") {
        updateAddress(selected);
      }
      if (typeof setCurrentUser === "function") {
        setCurrentUser({ address: selected, myAddress: selected });
      }
    }
  };

  const sortedAddressList = useMemo(() => {
    if (!addressList || addressList.length === 0) return [];
    if (!currentAddress) return addressList;

    const currentId = String(currentAddress._id || currentAddress.id || "");
    const rest = addressList.filter(
      (a) => String(a._id || a.id) !== currentId
    );
    const selected = addressList.find(
      (a) => String(a._id || a.id) === currentId
    );

    return selected ? [selected, ...rest] : addressList;
  }, [addressList, currentAddress]);

  const selectedVal =
    currentAddress?._id ||
    currentAddress?.id ||
    addressList?.[0]?._id ||
    addressList?.[0]?.id ||
    "";

  return (
    <select
      className="bg-gray-100/90 hover:bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold tracking-tight px-3 py-2 text-gray-800 w-full mt-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none cursor-pointer transition-all"
      onChange={handleAddressChange}
      value={selectedVal}
    >
      {(!currentAddress && (!addressList || addressList.length === 0)) && (
        <option value="" disabled>
          No address available
        </option>
      )}
      {sortedAddressList?.map((a, i) => (
        <option key={a._id || a.id || i} value={a._id || a.id}>
          {generateAddressLine(a)}
        </option>
      ))}
    </select>
  );
}
