const express = require("express");
const {
  handleGetAddressApi,
  handleAddAddressApi,
  handleDeleteAddressApi,
  handleUpdateAddressApi,
} = require("./address.controllers");
const router = express.Router();

router.get("/all/:userId", handleGetAddressApi);
router.post("/add/:userId", handleAddAddressApi);
router.delete("/delete/:addressId", handleDeleteAddressApi);
router.patch("/update/:addressId", handleUpdateAddressApi);

module.exports = {
  addressRoute: router
};
