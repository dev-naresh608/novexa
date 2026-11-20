import mongoose from "mongoose";
import Product from "../product/product.model.js";

// Keep these in sync with frontend/src/modules/cart/constants/cart.constants.js
export const TAX_RATE = 0.02;
export const DELIVERY_CHARGE = 0;
const MAX_QTY_PER_ITEM = 50;

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

/**
 * Offer price when an offer is active, otherwise the selling price.
 * Mirrors getEffectiveItemPrice() in the frontend cart utils.
 */
export const getEffectiveItemPrice = (product) => {
  if (!product) return 0;
  if (
    product.is_offer_available === true &&
    Number(product.product_offer_price) > 0
  ) {
    return Number(product.product_offer_price);
  }
  return Number(product.product_selling_price) || 0;
};

/**
 * Re-prices cart items against the database so the order total (and the
 * amount charged through Stripe) can never be tampered with from the client.
 *
 * @param {Array} rawItems - cart items sent by the client (only _id + qty are trusted)
 * @param {Array<string>} allowedStoreIds - ids the products must belong to
 * @returns {Promise<{ items: Array, priceDetails: Object }>}
 * @throws {Error} with a customer-facing message when the cart is invalid
 */
export const priceOrderItems = async (rawItems, allowedStoreIds = []) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("Your cart is empty");
  }

  // Merge duplicate lines and validate ids/quantities
  const qtyById = new Map();
  for (const item of rawItems) {
    const id = String(item?._id || item?.product_id || item?.productId || "");
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Your cart contains an invalid product. Please refresh your cart.");
    }

    const qty = Number(item.product_qty ?? item.quantity ?? item.qty ?? 1);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error(`Invalid quantity for ${item.product_name || "an item"} in your cart`);
    }
    qtyById.set(id, (qtyById.get(id) || 0) + qty);
  }

  const products = await Product.find({ _id: { $in: [...qtyById.keys()] } }).lean();
  const productById = new Map(products.map((p) => [String(p._id), p]));
  const storeIds = allowedStoreIds.filter(Boolean).map(String);

  const items = [];
  for (const [id, qty] of qtyById) {
    const product = productById.get(id);
    if (!product) {
      throw new Error(
        "Some items in your cart are no longer available. Please refresh your cart.",
      );
    }
    if (storeIds.length > 0 && !storeIds.includes(String(product.store_id))) {
      throw new Error("All items in an order must be from the same store.");
    }
    if (product.is_product_in_stock === false) {
      throw new Error(`"${product.product_name}" is currently out of stock.`);
    }
    if (qty > MAX_QTY_PER_ITEM) {
      throw new Error(
        `You can order at most ${MAX_QTY_PER_ITEM} units of "${product.product_name}".`,
      );
    }

    items.push({
      _id: product._id,
      product_name: product.product_name,
      product_url: product.product_url,
      product_selling_price: product.product_selling_price,
      product_offer_price: product.product_offer_price,
      is_offer_available: product.is_offer_available,
      product_weight: product.product_weight,
      product_weight_type: product.product_weight_type,
      product_qty: qty,
      store_id: product.store_id,
    });
  }

  const subTotal = round2(
    items.reduce(
      (sum, item) => sum + getEffectiveItemPrice(item) * item.product_qty,
      0,
    ),
  );
  const taxPrice = round2(subTotal * TAX_RATE);
  const deliveryCharge = DELIVERY_CHARGE;
  const finalPrice = round2(subTotal + taxPrice + deliveryCharge);

  return {
    items,
    priceDetails: {
      subTotal,
      subtotal: subTotal,
      deliveryCharge,
      shippingPrice: deliveryCharge,
      taxPrice,
      finalPrice,
    },
  };
};
