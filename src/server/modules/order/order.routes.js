const express = require("express");
const router = express.Router();
const {
  handleGetAllOrders,
  handleAddOrder,
  handleFindOrderById,
  handleDeleteOrderById,
  handleUpdateOrderById,
} = require("./order.controllers");

router
.route("/")
.get(handleGetAllOrders)
.post(handleAddOrder);

router
  .route("/:orderId")
  .get(handleFindOrderById)
  .delete(handleDeleteOrderById)
  .patch(handleUpdateOrderById);

module.exports = router;
