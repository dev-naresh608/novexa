import api from "@/configs/api";

/** Creates a Stripe Checkout Session for an order awaiting online payment. */
export const createCheckoutSessionApi = async (orderId) => {
  const { data } = await api.post("/payment/create-checkout-session", { orderId });
  return data;
};

/** Confirms a Checkout Session with Stripe and marks the order as paid. */
export const verifyPaymentSessionApi = async (sessionId) => {
  const { data } = await api.get(
    `/payment/verify-session/${encodeURIComponent(sessionId)}`,
  );
  return data;
};

/** Cancels an order whose Stripe payment was abandoned. */
export const cancelPaymentApi = async (orderId) => {
  const { data } = await api.post(`/payment/cancel/${encodeURIComponent(orderId)}`);
  return data;
};
