import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/database.js";

dotenv.config({ path: "config.env" });

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running");
});
