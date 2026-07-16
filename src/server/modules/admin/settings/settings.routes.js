const express = require("express");
const router = express.Router();
const { getSettingsWorking } = require("./settings.controller");

router.route("/")
  .get(getSettingsWorking)
  .post(getSettingsWorking)
  .patch(getSettingsWorking)
  .delete(getSettingsWorking);

router.route("/:id")
  .get(getSettingsWorking)
  .post(getSettingsWorking)
  .patch(getSettingsWorking)
  .delete(getSettingsWorking);

module.exports = {
  settingsRoute: router,
};
