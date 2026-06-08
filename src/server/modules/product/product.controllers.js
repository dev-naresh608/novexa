const Product = require("./product.model");

const handleGetAllProducts = async (req, res) => {
  const allProducts = (await Product.find({})) || [];

  return res.json({
    msg: "get all orders details",
    AllProducts: `${allProducts?.length === 0 ? "No products found" : allProducts.length}`,
  });
};

const handleAddProduct = async (req, res) => {
  const payload = req.body;
  return res.json({ msg: "Product added successfully" });
};

const handleFindProductById = async (req, res) => {
  return res.json({ msg: "One product found" });
};

const handleDeleteProductById = async (req, res) => {
  return res.json({ msg: "deleted successfully" });
};

const handleUpdateProductById = async (req, res) => {
  return res.json({ msg: "Updated successfully" });
};

module.exports = {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
};
