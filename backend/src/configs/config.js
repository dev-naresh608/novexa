import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "DATABASE_URI",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRE",
  "JWT_REFRESH_TOKEN_EXPIRE",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
}

// Strip whitespace and accidental surrounding quotes that often sneak in when
// keys are pasted into hosting dashboards (Render, Railway, etc.).
const cleanEnv = (value) =>
  typeof value === "string"
    ? value.trim().replace(/^["']|["']$/g, "").trim()
    : "";

const stripeSecretKey = cleanEnv(process.env.STRIPE_SECRET_KEY);

if (!stripeSecretKey) {
  console.warn(
    "⚠️ STRIPE_SECRET_KEY is not set. Stripe online checkout will be disabled until added in environment variables.",
  );
} else if (!/^(sk|rk)_(test|live)_/.test(stripeSecretKey)) {
  console.warn(
    "⚠️ STRIPE_SECRET_KEY does not look like a Stripe secret key (expected it to start with sk_test_ or sk_live_). Did you paste the publishable key (pk_...) by mistake?",
  );
}

const pickHttpUrl = (...candidates) => {
  for (const candidate of candidates) {
    const value = cleanEnv(candidate);
    if (/^https?:\/\//.test(value)) return value.replace(/\/+$/, "");
  }
  return "http://localhost:3000";
};

const stripeConfig = {
  secretKey: stripeSecretKey,
  webhookSecret: cleanEnv(process.env.STRIPE_WEBHOOK_SECRET),
  clientUrl: pickHttpUrl(process.env.CLIENT_URL, process.env.FRONTEND_URL),
  currency: (cleanEnv(process.env.STRIPE_CURRENCY) || "inr").toLowerCase(),
};

export const config = {
  env: process.env.NODE_ENV || "development",
  database: {
    uri: process.env.DATABASE_URI,
  },

  server: {
    port: Number(process.env.PORT) || 5000,
  },

  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  },

  cloudinary: {
    cloudName:
      process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUDE_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  services: {
    openRouterApiKey: process.env.OPEN_ROUTER_SERVICE_API_KEY,
  },
  stripe: stripeConfig,
};
