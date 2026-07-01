export const generateAddressLine = (address) => {
  if (!address) return;
  const addressLine = `${address.street}, ${address.city}, ${address.state}, ${address.pincode}`;
  return addressLine;
};

