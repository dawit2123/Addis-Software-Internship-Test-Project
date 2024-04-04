import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
      default: "M",
    },
    height: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
