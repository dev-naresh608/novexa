const express = require("express");
const router = express.Router();

const {
  handleGetAllCartItems,
  handleAddItemToCart,
  handleFindCartItemById,
  handleDeleteCartItemById,
  handleUpdateCartItemById,
} = require("./cart.controllers");

router.route("/").get(handleGetAllCartItems).post(handleAddItemToCart);

router
  .route("/:cartItemId")
  .get(handleFindCartItemById)
  .delete(handleDeleteCartItemById)
  .patch(handleUpdateCartItemById);

module.exports = router;
