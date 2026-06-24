const Product = require("./product.model");
const {
  addProductService,
  updateProductService,
  deleteProductService,
  deleteTempFolder,
} = require("./product.service");
const { uploadOnCloudinary } = require("../../utils/cloudinary");
const { default: Result_ } = require("postcss/lib/result");

const handleGetAllProducts = async (req, res) => {
  const { store_id } = req.query;

  const allProducts = (await Product.find({ store_id })) || [];

  if (allProducts.length === 0) {
    return res.status(400).json({
      success: false,
      message: "there is no products in your store",
      result: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Your products",
    result: allProducts,
  });
};

const handleAddProduct = async (req, res) => {
  const payload = req.body;
  const file = req.file;

  if (!payload) {
    return res
      .status(400)
      .json({ success: false, message: "formdata is required" });
  }

  if (!file) {
    return res.status(400).json({ success: false, message: "img is required" });
  }

  const uploadedImg = await uploadOnCloudinary(file.path);
  // console.log("uploaded image data: ", uploadedImg);

  if (!uploadedImg.success) {
    return uploadedImg;
  }

  const { url, public_id } = uploadedImg;

  const product = await addProductService(payload, url, public_id);

  return res
    .status(201)
    .json({ success: true, message: "Product added successfully" });
};

const handleFindProductById = async (req, res) => {
  return res.json({ msg: "One product found" });
};

const handleDeleteProductById = async (req, res) => {
  const { store_id } = req.body;
  const { productId } = req.params;

  const result = await deleteProductService(productId, store_id);
  return res.json({ success: true, result, msg: "deleted successfully" });
};

const handleUpdateProductById = async (req, res) => {
  const { store_id, updates } = req.body;

  const { productId } = req.params;

  if (!updates) {
    return {
      success: false,
      message: "Please send me data",
    };
  }
  const result = await updateProductService(productId, store_id, updates);
  return res.status(201).json({ msg: "Updated successfully" });
};

module.exports = {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
};
