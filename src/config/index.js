import "dotenv/config";
import { APPLICATION_ENV_TYPES } from "../utils/constants.js";

export const config = {
  PORT: process.env.PORT,
  rateLimit: {
    windowMs: 5 * 60 * 1000,
    max: 100,
  },
  cors: {
    origin:
      process.env.NODE_ENV === APPLICATION_ENV_TYPES.PROD
        ? [process.env.CORS_PROD_ORIGIN]
        : [process.env.CORS_DEV_ORIGIN],
    credentials: true,
  },
  SOCKET_CORS: {
    origin:
      process.env.NODE_ENV === APPLICATION_ENV_TYPES.PROD
        ? [process.env.CORS_PROD_ORIGIN]
        : [process.env.CORS_DEV_ORIGIN],

    methods: ["GET", "POST"],
  },
  ENV: process.env.NODE_ENV,
  IS_PROD: process.env.NODE_ENV === APPLICATION_ENV_TYPES.PROD,
  API_VERSION: 1,
  JWT: {
    ACCESS_TOKEN: {
      SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
      EXPIRES_IN: "1d",
    },
    REFRESH_TOKEN: {
      SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
      EXPIRES_IN: "7d",
    },
  },
  COOKIE: {
    REFRESH_MAX_AGE: 1000 * 60 * 60 * 24 * 7, // 7 days
    ACCESS_MAX_AGE: 1000 * 60 * 60 * 24, // 1 day
  },
  PROD_WEB_URL: process.env.CORS_PROD_ORIGIN,
  MQTT: {
    HOST: process.env.AWS_MQTT_HOST,
    PORT: process.env.AWS_MQTT_PORT,
    USERNAME: process.env.MQTT_USERNAME,
    PASSWORD: process.env.MQTT_PASSWORD,
    PROTOCOL: process.env.AWS_MQTT_PROTOCOL,
    CA: process.env.AWS_MQTT_CA,
    CERT: process.env.AWS_MQTT_CERT,
    KEY: process.env.AWS_MQTT_KEY,
  },
  MQTT_DEV: {
    HOST: process.env.MQTT_HOST,
    PORT: process.env.MQTT_PORT,
    USERNAME: process.env.MQTT_USERNAME,
    PASSWORD: process.env.MQTT_PASSWORD,
  },
  EMAIL: {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  },
  REDIS: {
    USERNAME: process.env.REDIS_USERNAME,
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
    PASSWORD: process.env.REDIS_PASSWORD,
    TTL: {
      HOUR_1: 60 * 60,
      DAY_1: 60 * 60 * 24,
      WEEK_1: 60 * 60 * 24 * 7,
      MONTH_1: 60 * 60 * 24 * 30,
    },
  },
  BATCH_SIZE: process.env.BATCH_SIZE,
  SECURE_COOKIE: true,
};
