const express = require("express");
const mongoose = require("mongoose");
const app = require('./app');
require("dotenv").config();

const { connectDB, config } = require("./configs/index");

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT || 5000, () => {
    console.log(`http://localhost:${config.PORT || 5000}`);
  });
};

startServer();
