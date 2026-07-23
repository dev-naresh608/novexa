const Cart = require("./cart.model");
const Product = require("../product/product.model");

/**
 * Retrieve all cart items for a user, populated with product details.
 */
const getCartByUserIdSvc = async (userId) => {
  const items = await Cart.find({ customer_id: userId }).populate("product_id");

  const formattedItems = [];

  for (const item of items) {
    // If the product was deleted by the seller, cleanup the orphaned cart item
    if (!item.product_id) {
      await Cart.findByIdAndDelete(item._id);
      continue;
    }

    formattedItems.push({
      _id: item.product_id._id,
      product_name: item.product_id.product_name,
      product_url: item.product_id.product_url,
      product_selling_price: item.product_id.product_selling_price,
      product_weight: item.product_id.product_weight,
      product_weight_type: item.product_id.product_weight_type,
      product_qty: item.quantity,
      store_id: item.store_id,
    });
  }

  return formattedItems;
};

/**
 * Add an item to user's cart (creates a document or increments quantity).
 */
const addToCartSvc = async (userId, productId, storeId, quantity = 1) => {
  let item = await Cart.findOne({ customer_id: userId, product_id: productId });

  if (item) {
    item.quantity += Number(quantity);
    await item.save();
  } else {
    item = await Cart.create({
      customer_id: userId,
      product_id: productId,
      store_id: storeId,
      quantity: Number(quantity),
    });
  }

  return item;
};

/**
 * Set the exact quantity of a cart item.
 */
const updateCartQtySvc = async (userId, productId, quantity) => {
  const item = await Cart.findOneAndUpdate(
    { customer_id: userId, product_id: productId },
    { $set: { quantity: Number(quantity) } },
    { new: true },
  );
  return item;
};

/**
 * Remove a specific product from user's cart.
 */
const removeFromCartSvc = async (userId, productId) => {
  const result = await Cart.findOneAndDelete({
    customer_id: userId,
    product_id: productId,
  });
  return result;
};

/**
 * Clear the entire cart for a user.
 */
const clearCartSvc = async (userId) => {
  const result = await Cart.deleteMany({ customer_id: userId });
  return result;
};

const getCartItemService = async (productId) => {
  const product = await Product.findById({ _id: productId });
  return product;
};

module.exports = {
  getCartByUserIdSvc,
  addToCartSvc,
  updateCartQtySvc,
  removeFromCartSvc,
  clearCartSvc,
  getCartItemService,
};
