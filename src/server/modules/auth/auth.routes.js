const express = require("express");
const router = express.Router();
const { login, signup } = require("./auth.controllers");

router.post("/login", login);
router.post("/signup", signup);

module.exports = {
  authRoute: router
};