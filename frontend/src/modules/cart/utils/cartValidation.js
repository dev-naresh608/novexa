
export const validateOrder = (address, storeId, cartItems = []) => {
  if (!address) {
    return { isValid: false, error: "Please add delivery address" };
  }

  if (!storeId) {
    return { isValid: false, error: "Please select products properly" };
  }

  if (!cartItems || cartItems.length === 0) {
    return { isValid: false, error: "Cart is empty" };
  }

  return { isValid: true, error: null };
};
