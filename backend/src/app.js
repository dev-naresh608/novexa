import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./modules/auth/auth.routes.js";
import productRouter from "./modules/product/product.routes.js";
import orderHistoryRouter from "./modules/order/order-history/orderHistory.routes.js";
import activeOrdersRouter from "./modules/order/active-orders/activeOrders.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import addressRouter from "./modules/address/address.routes.js";
import storeRouter from "./modules/store/store.routes.js";
import distanceRouter from "./routes/distance.js";
import notificationRouter from "./modules/notification/notification.routes.js";
import wishlistRouter from "./modules/customer/wishlist.routes.js";
import profileRouter from "./modules/profile/profile.routes.js";
import driverRouter from "./modules/driver/driver.routes.js";
import { stripeRouter, handleStripeWebhook } from "./modules/payment/index.js";
import { isAllowedClientOrigin } from "./utils/origin.js";

const app = express();

// Trust reverse proxy for Render/Vercel HTTPS secure cookies
app.set("trust proxy", 1);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl, Stripe webhooks)
      if (!origin) return callback(null, true);
      return callback(null, isAllowedClientOrigin(origin));
    },
    credentials: true,
  }),
);

// Standard HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Stripe webhook needs the raw request body to verify its signature, so it
// must be registered before express.json() parses the body.
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(
  express.json({
    limit: "10mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Novexa API is running 🚀",
  });
});

// Mounted Routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderHistoryRouter);
app.use("/api/active-orders", activeOrdersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/driver", driverRouter);
app.use("/api/stores", storeRouter);
app.use("/api/distance", distanceRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/profile", profileRouter);
app.use("/api/payment", stripeRouter);
app.use("/api/stripe", stripeRouter);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
});

export default app;
