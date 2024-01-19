// Mapper for environment variables
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

export const environment = process.env.NODE_ENV || "development";
export const port = process.env.PORT || 3000;
export const jwt_secret = process.env.JWT_SECRET || "";
export const email = process.env.EMAIL || "";

export const db = {
  name: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_USER_PWD || "",
};

export const corsUrl = process.env.CORS_URL || "";

export const tokenInfo = {
  accessTokenValidityDays: parseInt(
    process.env.ACCESS_TOKEN_VALIDITY_SEC || "24*60*60"
  ),
  refreshTokenValidityDays: parseInt(
    process.env.REFRESH_TOKEN_VALIDITY_SEC || "24*60*60"
  ),
  issuer: process.env.TOKEN_ISSUER || "",
  audience: process.env.TOKEN_AUDIENCE || "",
};

export const logDirectory = process.env.LOG_DIR || "";
export const DB_TYPE = process.env.DB_TYPE || "sql";
export const DATABASE_URL = process.env.DATABASE_URL;
export const DATABASE_URL_MONGODB = process.env.DATABASE_URL_MONGODB;
