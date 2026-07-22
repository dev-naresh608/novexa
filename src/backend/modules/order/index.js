module.exports = {
  ...require("./order.controllers"),
  ...require("./order.service"),
  ...require("./order.routes"),
  ...require("./order.model"),
};