const express = require("express");
const router = express.Router();
const { getActivityWorking } = require("./activity.controller");

router.route("/")
  .get(getActivityWorking)
  .post(getActivityWorking)
  .patch(getActivityWorking)
  .delete(getActivityWorking);

router.route("/:id")
  .get(getActivityWorking)
  .post(getActivityWorking)
  .patch(getActivityWorking)
  .delete(getActivityWorking);

module.exports = {
  activityRoute: router,
};
