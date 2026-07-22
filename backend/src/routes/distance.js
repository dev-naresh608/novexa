const epxress = require("express");
const router = epxress.Router();
const {
  handleGetDistanceAndEta,
  handleGetAddressApi,
} = require('../controllers/distance')
router.get("/distance", handleGetDistanceAndEta);
router.get("/address", handleGetAddressApi);

module.exports = {
  distanceRoute: router
};