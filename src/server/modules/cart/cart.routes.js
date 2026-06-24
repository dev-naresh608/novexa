const express = require("express");
const router = express.Router();

const {
  handleGetAllCartItems,
  handleAddItemToCart,
  handleFindCartItemById,
  handleDeleteCartItemById,
  handleUpdateCartItemById,
} = require("./cart.controllers");

router.get('/',handleGetAllCartItems);

router
  .route("/:productId")
  .get(handleFindCartItemById)
  .post(handleAddItemToCart)
  .delete(handleDeleteCartItemById)
  .patch(handleUpdateCartItemById);

module.exports = router;
