const express = require("express");
const router = express.Router();

const {
  handleGetCartByUser,
  handleAddToCart,
  handleUpdateCartQty,
  handleRemoveFromCart,
  handleClearCart,
  handleFindCartItemById,
} = require("./cart.controllers");

router.get("/user/:userId", handleGetCartByUser);
router.post("/add", handleAddToCart);
router.patch("/update", handleUpdateCartQty);
router.delete("/remove/:userId/:productId", handleRemoveFromCart);
router.delete("/clear/:userId", handleClearCart);
router.get("/:productId", handleFindCartItemById);

module.exports = { cartRoute: router };
