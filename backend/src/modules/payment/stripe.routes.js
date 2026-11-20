import express from "express";
import { authenticateAccessToken } from "../../middlewares/auth.middleware.js";
import {
  handleCreateCheckout,
  handleVerifySession,
  handleCancelPayment,
} from "./stripe.controller.js";

const router = express.Router();

router.post("/create-checkout-session", authenticateAccessToken, handleCreateCheckout);
router.post("/cancel/:orderId", authenticateAccessToken, handleCancelPayment);
// Public on purpose: the Checkout Session id is an unguessable secret and the
// order state is only ever changed to match what Stripe reports.
router.get("/verify-session/:sessionId", handleVerifySession);

export default router;
