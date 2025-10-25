import { get } from "http";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = Number(getEnv("PORT", "4000"));
export const MONGO_URI = getEnv("MONGO_URI");
export const CLIENT_URL = getEnv("CLIENT_URL", "http://localhost:5173");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
