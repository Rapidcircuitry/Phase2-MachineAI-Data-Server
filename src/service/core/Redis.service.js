import { config } from "../../config/index.js";
import redis from "../../config/cache.config.js";


export class RedisService {
  static async set(key, value, ttl = config.REDIS.TTL.DAY_1) {
    value = JSON.stringify(value);
    await redis.set(key, value, "EX", ttl);
  }

  static async get(key) {
    const value = await redis.get(key);
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? [...parsedValue] : parsedValue;
  }

  static async del(key) {
    await redis.del(key);
  }

  static async expire(key, ttl) {
    await redis.expire(key, ttl);
  }

  static async keys(pattern) {
    return await redis.keys(pattern);
  }

  static async flushall() {
    await redis.flushall();
  }

  static async flushdb() {
    await redis.flushdb();
  }
}
