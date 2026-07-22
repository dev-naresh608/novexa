const express = require("express");
const router = express.Router();
const { getProfileWorking } = require("./profile.controller");

router.route("/")
  .get(getProfileWorking)
  .post(getProfileWorking)
  .patch(getProfileWorking)
  .delete(getProfileWorking);

router.route("/:id")
  .get(getProfileWorking)
  .post(getProfileWorking)
  .patch(getProfileWorking)
  .delete(getProfileWorking);

module.exports = {
  profileRoute: router,
};
