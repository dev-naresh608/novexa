const mongoose = require("mongoose");
const driverSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
  },
  driver_dob: {
    type: String,
    required: true,
  },
  driver_status: {
    type: Boolean,
    default: true,
  },
  driver_aadhaar_number: {
    type: Number,
    required: true,
  },
  driver_vehicle_number: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Driver", driverSchema);
