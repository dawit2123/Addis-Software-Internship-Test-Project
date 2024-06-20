import express from "express";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";
import musicRouter from "./routes/musicRoutes.js";
import userRouter from "./routes/userRoutes.js";
import validateEnv from "./validate/validateEnv.js";
import { connectDB } from "./config/database.js";
import { isLoggedIn } from "./controllers/authController.js";
import {
  handleRateLimitExceeded,
  redisClient,
} from "./controllers/rateLimitController.js";

dotenv.config({ path: "config.env" });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();

// Validate the environment variables
app.use(validateEnv);

// Connect to the db
connectDB();

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security HTTP headers
app.use(helmet());

// Serving static files
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

// Setting the home directory
app.use((req, res, next) => {
  req.homedir = __dirname;
  next();
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compress the response body to reduce the size of the response
app.use(compression());

// Determine log file path (optional)
const logFilePath = path.join(__dirname, "/public/morgan.log");
// Create a write stream (choose append mode)
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Redirecting console.log to the same log file stream
const originalConsoleLog = console.log;
console.log = (...args) => {
  const logMessage = args
    .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
    .join(" ");
  accessLogStream.write(`[CONSOLE.LOG] ${logMessage}\n`);
  originalConsoleLog.apply(console, args);
};
// Development logging
app.use(morgan("combined", { stream: accessLogStream }));

// Function to initialize the server
const initializeServer = () => {
  console.log("Redis client connected");

  // Limit the number of requests from an IP
  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    max: 200,
    windowMs: 1 * 60 * 60 * 1000,
    handler: handleRateLimitExceeded,
  });

  app.use("/api", limiter);

  app.use("/api/v1/music", isLoggedIn, musicRouter);
  app.use("/api/v1/user", userRouter);

  // Error handling middleware
  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
      res.status(err.status || 400).json({
        status: "fail",
        error: err.message,
        stack: err.stack,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  });

  app.all("*", (req, res, next) => {
    next(`Can't find ${req.originalUrl} on this server!`);
  });

  const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running at port ${process.env.PORT || 5000}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message, err);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  });
};

const connectRedisAndInitialize = async () => {
  try {
    await redisClient.connect();
    initializeServer();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
};
connectRedisAndInitialize();
