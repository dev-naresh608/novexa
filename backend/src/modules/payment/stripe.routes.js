import express from "express";
import {
  handleCreateCheckout,
  handleVerifySession,
} from "./stripe.controller.js";

const router = express.Router();

router.post("/create-checkout-session", handleCreateCheckout);
router.get("/verify-session/:sessionId", handleVerifySession);
router.get("/session/:sessionId", handleVerifySession);

export default router;
