const Order = require("./order.model");

const handleGetAllOrders = async (req, res) => {
  const allOrders = (await Order.find({})) || [];

  return res.json({
    msg: "get all orders details",
    AllOrders: `${allOrders?.length === 0 ? "No orders found" : allOrders.length}`,
  });
};

const handleAddOrder = async (req, res) => {
  return res.json({ msg: "order created" });
};

const handleFindOrderById = async (req, res) => {
  return res.json({ msg: "One order found" });
};

const handleDeleteOrderById = async (req, res) => {
  return res.json({ msg: "deleted successfully" });
};

const handleUpdateOrderById = async (req, res) => {
  return res.json({ msg: "Updated successfully" });
};

module.exports = {
  handleGetAllOrders,
  handleAddOrder,
  handleFindOrderById,
  handleDeleteOrderById,
  handleUpdateOrderById,
};
