const staticAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://novexa-indol.vercel.app",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/+$/, ""));

/**
 * Whether a browser origin is one of Novexa's own frontends.
 * Used for CORS and to decide where Stripe may redirect the customer back to.
 */
export const isAllowedClientOrigin = (origin) => {
  if (!origin || typeof origin !== "string") return false;
  return (
    staticAllowedOrigins.includes(origin) ||
    /^https:\/\/novexa(-[a-z0-9]+)?\.vercel\.app$/.test(origin) ||
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
  );
};
