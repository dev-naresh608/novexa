const express = require("express");
const router = express.Router();
const {
  handleGetAllOrders,
  handleAddOrder,
  handleFindOrderById,
  handleDeleteOrderById,
  handleUpdateOrderById,
} = require("./order.controllers");

router.get("/:userId", handleGetAllOrders);
router.post("/", handleAddOrder);

router
  .route("/detail/:orderId")
  .get(handleFindOrderById)
  .delete(handleDeleteOrderById)
  .patch(handleUpdateOrderById);

module.exports = router;
