const express = require("express");
const router = express.Router();
const { getAnalyticsWorking } = require("./analytics.controller");

router.route("/")
  .get(getAnalyticsWorking)
  .post(getAnalyticsWorking)
  .patch(getAnalyticsWorking)
  .delete(getAnalyticsWorking);

router.route("/:id")
  .get(getAnalyticsWorking)
  .post(getAnalyticsWorking)
  .patch(getAnalyticsWorking)
  .delete(getAnalyticsWorking);

module.exports = {
  analyticsRoute: router,
};
