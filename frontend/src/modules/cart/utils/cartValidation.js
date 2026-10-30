export const validateOrder = (address, storeId, cartItems = []) => {
  if (!address) {
    return { isValid: false, error: "Please select or add a delivery address" };
  }

  if (!cartItems || cartItems.length === 0) {
    return { isValid: false, error: "Your cart is empty" };
  }

  if (!storeId) {
    return { isValid: false, error: "Store information missing. Please re-add items from the store" };
  }

  return { isValid: true, error: null };
};
