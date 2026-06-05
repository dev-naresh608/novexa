const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  address_place_type: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Address',addressSchema);