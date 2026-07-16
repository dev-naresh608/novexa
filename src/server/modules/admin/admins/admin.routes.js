const express = require("express");
const router = express.Router();
const { getAdminsWorking } = require("./admin.controller");

router.route("/")
  .get(getAdminsWorking)
  .post(getAdminsWorking)
  .patch(getAdminsWorking)
  .delete(getAdminsWorking);

router.route("/:id")
  .get(getAdminsWorking)
  .post(getAdminsWorking)
  .patch(getAdminsWorking)
  .delete(getAdminsWorking);

module.exports = {
  adminsRoute: router,
};
