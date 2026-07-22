require("dotenv").config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI undefined in environment variable");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET undefined in environment variable");
}

if (!process.env.CLOUDINARY_CLOUDE_NAME) {
  throw new Error("CLOUDINARY_CLOUDE_NAME undefined in environment variable");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY undefined in environment variable");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET undefined in environment variable");
}

if (!process.env.OPEN_ROUTER_SERVICE_API_KEY) {
  throw new Error(
    "OPEN_ROUTER_SERVICE_API_KEY undefined in environment variable",
  );
}

const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUDE_NAME: process.env.CLOUDINARY_CLOUDE_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  OPEN_ROUTER_SERVICE_API_KEY: process.env.OPEN_ROUTER_SERVICE_API_KEY,
};

module.exports = { config };
