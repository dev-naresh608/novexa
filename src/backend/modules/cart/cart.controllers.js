const Cart = require("./cart.model");
const { getCartItemService } = require("./cart.service");
const handleGetAllCartItems = async (req, res) => {
  const allCartItems = (await Cart.find({})) || [];

  return res.json({
    message: "get all cart items details",
    AllCartItems: `${allCartItems?.length === 0 ? "No orders found" : allCartItems.length}`,
  });
};

const handleAddItemToCart = async (req, res) => {
  return res.json({ message: "item added" });
};

const handleFindCartItemById = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product id required",
    });
  }
  const product = await getCartItemService(productId);
  return res.status(200).json({
    success: true,
    message: "product fetched successfully",
    product,
  });
};

const handleDeleteCartItemById = async (req, res) => {
  return res.json({ message: "item deleted successfully" });
};

const handleUpdateCartItemById = async (req, res) => {
  return res.json({ message: "item updated successfully" });
};

module.exports = {
  handleGetAllCartItems,
  handleAddItemToCart,
  handleFindCartItemById,
  handleDeleteCartItemById,
  handleUpdateCartItemById,
};
