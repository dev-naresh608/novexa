import express from "express";
import { handleCreateCheckout } from "./stripe.controller.js";

const router = express.Router();

router.post("/create-checkout-session", handleCreateCheckout);

export default router;

