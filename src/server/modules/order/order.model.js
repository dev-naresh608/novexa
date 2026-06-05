const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 store_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Store",
  required: true
},
  customer_address: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  store_address: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
    default: "Unknown",
  },
  customer_phone: {
    type: String,
    required: true,
  },
  order_items: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  order_status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  createdAt: {
  type: Date,
  default: Date.now,
},
  payment_method: {
    type: String,
    default: "cash",
  },
  price_detail: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
