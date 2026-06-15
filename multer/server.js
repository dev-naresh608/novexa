const express = require("express");
const app = express();

const mongoose = require("mongoose");
const PORT = 3000;


//Db Connection.
mongoose
  .connect("mongodb://127.0.0.1:27017/multerProjectOne")
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log("db not connected. E: ", err));


app.listen(PORT, () => console.log('http://localhost:3000'))