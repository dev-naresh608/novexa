export const generateAddressLine = (address) => {
  if (!address) return "No Address";
  if (typeof address === "string") return address.trim() || "Saved Address";

  const parts = [
    address.name,
    address.street,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return address.formattedAddress || address.addressLine || "Saved Delivery Address";
};
