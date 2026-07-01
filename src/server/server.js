const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const {
  distanceRoute,
  storeRoute,
  addressRoute,
  authRoute,
  productRoute,
  orderRoute,
  cartRoute,
} = require("./routes");

const app = express();
app.use(cors());
app.use(
  express.json({
    limit: "100mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  }),
);

app.use("/", authRoute);
app.use("/api", distanceRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);
app.use("/cart", cartRoute);
app.use("/stores", storeRoute);
app.use("/address", addressRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error to connect DB, E: ", err));

app.get("/", (req, res) => {
  res.json({ msg: "api running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
