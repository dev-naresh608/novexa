const express = require("express");
const router = express.Router();
const { getDashboardWorking } = require("./dashboard.controller");

router.route("/")
  .get(getDashboardWorking)
  .post(getDashboardWorking)
  .patch(getDashboardWorking)
  .delete(getDashboardWorking);

router.route("/:id")
  .get(getDashboardWorking)
  .post(getDashboardWorking)
  .patch(getDashboardWorking)
  .delete(getDashboardWorking);

module.exports = {
  dashboardRoute: router,
};
