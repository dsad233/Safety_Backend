import * as redis from "redis";
import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
  REDIS_USER,
} from "./keys";

//* Redis 연결
export const redisClient = redis.createClient({
  url: `redis://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
});
redisClient.on("connect", () => {
  console.info("Redis 연결 완료.");
});
redisClient.on("error", (err) => {
  console.error("Redis 에러 발생!!", err);
});
redisClient.on("end", (err) => {
  redisClient.disconnect();
});

redisClient.connect();
