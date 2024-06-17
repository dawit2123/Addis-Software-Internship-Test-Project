import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";
import { connectDB } from "./config/database.js";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { error } from "console";

dotenv.config({ path: "config.env" });

//connect to the db
connectDB();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//serving static files
app.use(express.static(__dirname + "/public"));

// setting the home directory
app.use((req, res, next) => {
  req.homedir = __dirname;
  next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/music", musicRoutes);
// error handling middleware
app.use((err, req, res, next) => {
  if(process.env.NODE_ENV === 'development') {
   res.status(err.status||400).json({
     status:"fail",
     error:err.message,
     stack:err.stack
   })
  }
  else{
   res.status(500).json({
     status:"error",
     message:"Something went wrong"
   })
  }
})

app.all('*', (req, res, next) => {
  next(`Can't find ${req.originalUrl} on this server!`);
});


const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running at port ${process.env.PORT || 5000}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message,err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});