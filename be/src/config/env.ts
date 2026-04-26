import "dotenv/config";

export const env = {
  PORT: process.env.PORT || "3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgres://app:app@localhost:5432/app",
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
};
