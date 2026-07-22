module.exports = {
  ...require("./product.controllers"),
  ...require("./product.service"),
  ...require("./product.routes"),
  ...require("./product.model"),
};