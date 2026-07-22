const express = require("express");
const multer = require('multer');
const {upload} = require('../../middlewares/multer.middleware');

const router = express.Router();
const {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
} = require("./product.controllers");

router.get("/allproducts/:userId",handleGetAllProducts);
router.post("/add-product",upload.single('product_img'), handleAddProduct);

router
  .route("/:productId")
  .get(handleFindProductById)
  .patch(handleUpdateProductById)
  .delete(handleDeleteProductById)

module.exports = {
  productRoute: router
};
