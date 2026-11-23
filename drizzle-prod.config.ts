import { defineConfig } from "drizzle-kit";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_USER,
  NODE_ENV,
} from "./src/common/configs/keys";

if (NODE_ENV !== "prod") {
  throw new Error("prod 환경이 아닙니다. 다시 시도해 주세요.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./schema/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  },
});
