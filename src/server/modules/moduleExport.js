const Product = require("./product/product");

const User = require("./User");
const Customer = require('./customer/customer.model');
const Driver = require('./driver/driver.model');
const Seller = require('./seller/seller.model');


const Address = require("./address/Address");
const Cart = require("./cart/cart");
const Order = require("./order/order");

const loginSignup = require("./auth/auth.routes");

module.exports = {
  productRouter: Product.routes,
  Product: Product.model,

  orderRouter: Order.routes,
  Order: Order.model,

  cartRouter: Cart.routes,
  Cart: Cart.model,

  loginSignupRouter: loginSignup,

  User,
  Customer,
  Seller,
  Driver,
  Address,
  Order,
};
