const express = require("express");
const { handleGetAddressApi, handleAddAddressApi } = require("./address.controllers");
const router = express.Router();

router.get("/all/:userId", handleGetAddressApi);
router.post("/add/:userId", handleAddAddressApi);

module.exports = {
  addressRoute: router
};
