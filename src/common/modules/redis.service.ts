import { redisClient } from "../configs/redis.config";

export class RedisService {
  static get = async (
    key: string,
  ): ReturnType<(key: string) => Promise<string | null>> => {
    return await redisClient.get(key);
  };

  static set = async (
    key: string,
    value: string,
  ): ReturnType<(key: string, value: string) => Promise<void>> => {
    await redisClient.set(key, value);
  };

  static setex = async (
    key: string,
    ttl: number,
    value: string,
  ): ReturnType<(key: string, ttl: number, value: string) => Promise<void>> => {
    await redisClient.setEx(key, ttl, value);
  };

  static remove = async (
    key: string,
  ): ReturnType<(key: string) => Promise<void>> => {
    await redisClient.del(key);
  };
}
