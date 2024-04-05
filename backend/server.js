import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";
import { connectDB } from "./config/database.js";

dotenv.config({ path: "config.env" });
//connect to the db
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/music", musicRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running at port ${process.env.PORT || 5000}`);
});
