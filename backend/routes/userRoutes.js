import express from "express";
import { signup, login } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../validate/validateUser.js";

const userRouter = express.Router();
userRouter.post("/signup", validateSignup, signup);
userRouter.post("/login", validateLogin, login);
export default userRouter;
