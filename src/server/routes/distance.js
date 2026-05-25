const epxress = require("express");
const router = epxress.Router();
const {
  handleGetDistanceAndEta,
  handleGetAddress,
} = require('../controllers/distance')
router.get("/distance", handleGetDistanceAndEta);
router.get("/address", handleGetAddress);

module.exports = router;