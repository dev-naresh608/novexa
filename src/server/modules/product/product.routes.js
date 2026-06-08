const express = require("express");
const router = express.Router();
const {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
} = require("./product.controllers");

router.get("/allproducts",handleGetAllProducts);
router.post("/add-product",handleAddProduct);

router
  .route("/:productId")
  .get(handleFindProductById)
  .delete(handleDeleteProductById)
  .patch(handleUpdateProductById);

module.exports = router;
