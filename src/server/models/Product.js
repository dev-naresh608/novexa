const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    require: true,
  },
  product_url: {
    type: String,
    require: true,
  },
  product_category: {
    type: String,
    default: "other",
  },
  product_weight: {
    type: Number,
    require: true,
  },
  product_weight_type: {
    type: String,
    default: "none",
  },
  product_price: {
    type: Number,
    require: true,
  },
  product_offer_price: {
    type: Number,
    default: 0,
  },
  product_description: {
    type: String,
    require: true,
  },
  product_id: {
    type: String,
    require: true,
    unique: true,
  },
  isProductInStock: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
