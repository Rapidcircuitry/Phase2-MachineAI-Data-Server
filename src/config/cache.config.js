import { Redis } from "ioredis";
import { config } from "./index.js";

const redis = new Redis(
  `rediss://${config.REDIS.USERNAME}:${config.REDIS.PASSWORD}@${config.REDIS.HOST}:${config.REDIS.PORT}`
);

export default redis;
