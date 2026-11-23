import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import {
  DB_BIG_NUMBERS,
  DB_CONN_LIMIT,
  DB_CONN_TIMOUT,
  DB_DATABASE,
  DB_HOST,
  DB_IDLE_TIMEOUT,
  DB_KEEP_ALIVE,
  DB_MAX_IDLE,
  DB_PASS,
  DB_PORT,
  DB_UNAUTHORIZED,
  DB_USER,
  TIMEZONE,
} from "./keys";

const poolConnection = mysql.createPool({
  timezone: TIMEZONE,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  connectTimeout: DB_CONN_TIMOUT,
  idleTimeout: DB_IDLE_TIMEOUT,
  connectionLimit: DB_CONN_LIMIT,
  maxIdle: DB_MAX_IDLE,
  enableKeepAlive: DB_KEEP_ALIVE,
  ssl: {
    rejectUnauthorized: DB_UNAUTHORIZED,
  },
  supportBigNumbers: DB_BIG_NUMBERS,
});

export const db: MySql2Database = drizzle({
  client: poolConnection,
});

poolConnection.on("connection", async (connection) => {
  if (connection.state === "authenticated") {
    console.log("MySQL 연결 완료.");
  }
});

poolConnection.getConnection((error) => {
  if (error) console.error("MySQL 연동 에러 발생! :", error);
});
