const epxress = require("express");
const router = epxress.Router();
const {
  handleGetAllStores,
  handlegetAllStoreProduct,
  handleGetOneStore,
} = require("../controllers/store");

router.get("/", handleGetAllStores);
router.get("/:storeId", handleGetOneStore);
router.get("/allproducts/:storeId", handlegetAllStoreProduct);

module.exports = { storeRoute: router };