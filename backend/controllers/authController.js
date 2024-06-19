import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/users/userModel.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    //commented intentionaly for the development purpose as we use http not https
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//sign up
export const signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = await User.signupUser({
    firstName,
    lastName,
    email,
    password,
  });
  createSendToken(user, 201, req, res);
});

//login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next("Please provide email and password!");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next("Incorrect email or password");
  }

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});
