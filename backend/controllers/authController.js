import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AccessControl } from "accesscontrol";
import { promisify } from "util";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/users/userModel.js";
dotenv.config({ path: "config.env" });

const ac = new AccessControl();
// Define roles and permissions
ac.grant("user").createOwn("music").readOwn("music").updateOwn("music");

ac.grant("admin")
  .extend("user")
  .readAny("music")
  .updateAny("muisc")
  .deleteAny("music")
  .createAny("user");

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
    return next(new Error("Please provide email and password"));
  }
  const user = await User.findUser(email);
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new Error("Incorrect email or password"));
  }

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});
export const logout = catchAsync(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
});
export const isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1) verify token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new Error("Failed to find user with this token. Please login again!")
      );
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new Error("User recently changed password! Please login again.")
      );
    }
    // THERE IS A LOGGED IN USER
    req.userData = currentUser;
    return next();
  }
  next(new Error("You are not logged in! Please log in to get access."));
});

export const checkPermission = (action, resource) => (req, res, next) => {
  const permission = ac.can(req.userData.role)[action](resource);

  if (permission.granted) {
    next(); // Permission granted, proceed to the next middleware/route handler
  } else {
    res.status(403).json({
      status: "fail",
      message: "You don't have the right permission.",
    }); // Permission denied
  }
};
