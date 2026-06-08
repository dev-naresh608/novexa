const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const distanceRoute = require("./routes/distance");
const {
  productRouter,
  orderRouter,
  cartRouter,
  loginSignupRouter,
} = require("./modules/moduleExport");
const app = express();
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error to connect DB, E: ", err));

app.get("/", (req, res) => {
  res.json({ msg: "api running" });
});

app.use("/api", distanceRoute);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);
app.use("/", loginSignupRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
