const Product = require("../product/product.model");

const getCartItemService = async (productId) => {
  const product = await Product.findById({ _id: productId });
  return product;
};

module.exports = {
  getCartItemService
}
