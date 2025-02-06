import express from "express";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

// Importing routes
import { PrismaClient } from "@prisma/client";
import { config } from "./src/config/index.js";
import {
  createLogger,
  createRequestLogger,
  errorLoggingMiddleware,
  securityLoggingMiddleware,
} from "./src/middlewares/logging.middleware.js";
import { APPLICATION_ENV_TYPES } from "./src/utils/constants.js";
import { initMqttManager } from "./src/service/core/mqtt.service.js";
import { initSocketManager } from "./src/service/core/socket.service.js";
import { initMqttConnectionClient } from "./src/config/mqtt.config.js";
import { createSocketConfig } from "./src/config/socket.config.js";
import { DeviceDataDecoder } from "./src/handlers/data/DataDecoder.handler.js";
import actionRoutes from "./src/routes/action.route.js";

const app = express();
const server = http.createServer(app);

export const prisma = new PrismaClient();

const environment = config.ENV || APPLICATION_ENV_TYPES.DEV; // Use the appropriate environment
const logger = createLogger(environment);
app.use(createRequestLogger(environment, logger));
app.use(securityLoggingMiddleware(logger));

app.use(compression());
app.use(cors(config.cors));
app.use(
  express.json({
    limit: "1mb",
    strict: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy:
      config.ENV === APPLICATION_ENV_TYPES.PROD
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:"],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
            },
          }
        : false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `Welcome to the Official IIoT Data Server API! 🚀`,
    environment: config.ENV,
    version: config.API_VERSION,
  });
});

app.use("/api/v1/action", actionRoutes);

// Route for handling 404 errors
app.use((req, res) => {
  logger.warn("Route Not Found", {
    method: req.method,
    path: req.path,
  });
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    error: "Not Found",
  });
});

// Error logging middleware
app.use(errorLoggingMiddleware(logger));

// Server Startup
const startServer = async () => {
  try {
    const { io } = createSocketConfig(server);
    initSocketManager(io);
    initMqttConnectionClient();
    initMqttManager(io);

    await DeviceDataDecoder.initialize();

    server.listen(config.PORT, () => {
      logger.info(`Server started on port ${config.PORT}`);
    });
  } catch (error) {
    console.log("Server Startup Failed", error);
    logger.error("Server Startup Failed", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();
