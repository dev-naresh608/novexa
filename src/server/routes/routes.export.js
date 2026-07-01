// const {
//   authRoute,
//   cartRoute,
//   orderRoute,
//   productRoute,
//   addressRoute,
// } = require("../modules");

const { distanceRoute } = require("./distance");
const { storeRoute } = require("./store");

module.exports = {
  distanceRoute,
  storeRoute,
  ...require('../modules/moduleExport')
};
