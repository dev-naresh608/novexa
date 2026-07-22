const express = require("express");
const router = express.Router();

const authController = require("./auth.controllers.js");

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.get("/refresh-token", authController.refreshToken);
router.get("/get-me", authController.getMe);

module.exports = {
  authRoute: router,
};
