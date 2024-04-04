import asyncHandler from "express-async-handler";
import { User } from "../models/usersModel.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc    Create single user
// @route   POST /api/users/
// @access  Public
export const createUser = asyncHandler(async (req, res) => {
  let required_fields = ["firstname", "lastname", "age", "gender", "height"];
  let errors = [];
  required_fields.forEach((field) => {
    if (!req.body[field]) errors.push(field + " is required!");
  });

  if (errors.length !== 0) {
    res.status(400).json({ message: errors });
  } else {
    const user = await User.create(req.body);
    res.status(200).json(user);
  }
});

// @desc    Update single user
// @route   PATCH /api/users/:id
// @access  Public
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "User not found!" });
  } else {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  }
});

// @desc    Delete single user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "User not found!" });
  } else {
    await user.remove();
    res.status(200).json({ id: req.params.id });
  }
});
