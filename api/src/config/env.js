require("dotenv").config();

const required = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
};

const numberValue = (key, fallback) => {
  const value = process.env[key];
  return value ? Number(value) : fallback;
};

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: numberValue("PORT", 5000),
  CLIENT_URLS: required("CLIENT_URL")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  MONGO_URI: required("MONGO_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  ADMIN_INVITE_CODE: required("ADMIN_INVITE_CODE"),
  PASSWORD_RESET_CLIENT_URL: required("PASSWORD_RESET_CLIENT_URL"),
  PASSWORD_RESET_TOKEN_EXPIRES_MINUTES: numberValue("PASSWORD_RESET_TOKEN_EXPIRES_MINUTES", 15),
  EMAIL_VERIFICATION_CLIENT_URL: required("EMAIL_VERIFICATION_CLIENT_URL"),
  EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES: numberValue("EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES", 60),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  EMAIL_DELIVERY_MODE: process.env.EMAIL_DELIVERY_MODE || "console",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: numberValue("SMTP_PORT", 587),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "CircuitCart <no-reply@circuitcart.local>",
  BCRYPT_SALT_ROUNDS: numberValue("BCRYPT_SALT_ROUNDS", 12),
  AUTH_RATE_LIMIT_WINDOW_MS: numberValue("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  AUTH_RATE_LIMIT_MAX: numberValue("AUTH_RATE_LIMIT_MAX", 25),
  UPLOAD_MAX_FILE_SIZE_BYTES: numberValue("UPLOAD_MAX_FILE_SIZE_BYTES", 2 * 1024 * 1024),
};
