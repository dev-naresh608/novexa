import Stripe from "stripe";
import { config } from "../../configs/config.js";

let stripeClient = null;

export const isStripeConfigured = () =>
  /^(sk|rk)_(test|live)_/.test(config.stripe.secretKey || "");

/** Lazily created Stripe client, or null when STRIPE_SECRET_KEY is missing/invalid. */
export const getStripe = () => {
  if (!isStripeConfigured()) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(config.stripe.secretKey, {
      maxNetworkRetries: 2,
      timeout: 20000,
    });
  }
  return stripeClient;
};
