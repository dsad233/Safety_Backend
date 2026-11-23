import { config } from "dotenv";

console.log("process path: ", process.cwd() + "/" + ".env.prod");

if (process.env.NODE_ENV === "prod") {
  config({ path: process.cwd() + "/" + ".env.prod" });
} else if (process.env.NODE_ENV === "dev") {
  config({ path: process.cwd() + "/" + ".env.dev" });
} else {
  config({ path: process.cwd() + "/" + ".env.local" });
}

/**
 * 기본 설정
 */
export const NODE_ENV = String(process.env.NODE_ENV);
export const TIMEZONE = String(process.env.TIMEZONE);
export const SERVER_URL =
  String(process.env.SERVER_URL) === "http://localhost"
    ? String(process.env.SERVER_URL) + ":" + Number(process.env.SERVER_PORT)
    : String(process.env.SERVER_URL);
export const SERVER_PORT = Number(process.env.SERVER_PORT);

export const DB_HOST = String(process.env.DB_HOST);
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_USER = String(process.env.DB_USER);
export const DB_PASS = String(process.env.DB_PASS);
export const DB_DATABASE = String(process.env.DB_DATABASE);
export const DB_CONN_TIMOUT = Number(process.env.DB_CONN_TIMOUT);
export const DB_IDLE_TIMEOUT = Number(process.env.DB_IDLE_TIMEOUT);
export const DB_CONN_LIMIT = Number(process.env.DB_CONN_LIMIT);
export const DB_MAX_IDLE = Number(process.env.DB_MAX_IDLE);
export const DB_KEEP_ALIVE =
  process.env.DB_KEEP_ALIVE === "true" ? true : false;
export const DB_UNAUTHORIZED =
  process.env.DB_UNAUTHORIZED === "true" ? true : false;
export const DB_BIG_NUMBERS =
  process.env.DB_BIG_NUMBERS === "true" ? true : false;

/**
 * Redis 관련 설정
 */
export const REDIS_HOST = String(process.env.REDIS_HOST);
export const REDIS_USER = String(process.env.REDIS_USER);
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_PASS = String(process.env.REDIS_PASS);
export const REDIS_DB = Number(process.env.REDIS_DB);

/**
 * JWT 설정
 */
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

/**
 * JWT 관련 설정
 */
export const JWT_SECRET_KEY = String(process.env.JWT_SECRET_KEY);
export const JWT_ACCESS_TOKEN_EXPIRES_IN = String(
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
);
export const JWT_ACCESS_TOKEN_EXPIRES_TTL = Number(
  process.env.JWT_ACCESS_TOKEN_EXPIRES_TTL,
);

export const JWT_REFRESH_TOKEN_SECRET_KEY = String(
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
);
export const JWT_REFRESH_TOKEN_EXPIRES_IN = String(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
);
export const JWT_REFRESH_TOKEN_EXPIRES_TTL = Number(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_TTL,
);
