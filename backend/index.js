import express from "express";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import ratelimit from "express-rate-limit";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import musicRouter from "./routes/musicRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { connectDB } from "./config/database.js";
import { isLoggedIn } from "./controllers/authController.js";

dotenv.config({ path: "config.env" });

//connect to the db
connectDB();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security HTTP headers
app.use(helmet());

//serving static files
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

// setting the home directory
app.use((req, res, next) => {
  req.homedir = __dirname;
  next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//compress the response body to reduce the size of the response
app.use(compression());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//limit the number of requests from an IP
const limiter = ratelimit({
  max: 200,
  windowMs: 1 * 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again!",
});

app.use("/api", limiter);
app.use("/api/v1/music", isLoggedIn, musicRouter);
app.use("/api/v1/user", userRouter);

// error handling middleware
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
