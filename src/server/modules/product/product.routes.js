const express = require("express");
const router = express.Router();
const {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
} = require("./product.controllers");

router
.route("/")
.get(handleGetAllProducts)
.post(handleAddProduct);

router
  .route("/:productId")
  .get(handleFindProductById)
  .delete(handleDeleteProductById)
  .patch(handleUpdateProductById);

module.exports = router;
