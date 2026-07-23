import { TAX_RATE, SHIPPING_FEE } from "../constants/cart.constants";

/**
 * Calculates cart totals based on items list.
 * @param {Array} cartItems - List of products in the cart.
 * @returns {Object} Total calculations: subTotal, deliveryCharge, taxPrice, finalPrice.
 */
export const calculateCartTotals = (cartItems = []) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      subTotal: 0,
      deliveryCharge: 0,
      taxPrice: 0,
      finalPrice: 0,
    };
  }

  const subTotal = cartItems.reduce((acc, product) => {
    const qty = Number(product.product_qty) || 0;
    const price = Number(product.product_selling_price) || 0;
    return acc + price * qty;
  }, 0);

  // Using Number to avoid string concatenation issues
  const taxPrice = Number((subTotal * TAX_RATE).toFixed(2));
  const deliveryCharge = SHIPPING_FEE;
  const finalPrice = Number((subTotal + taxPrice + deliveryCharge).toFixed(2));

  return {
    subTotal,
    deliveryCharge,
    taxPrice,
    finalPrice,
  };
};
