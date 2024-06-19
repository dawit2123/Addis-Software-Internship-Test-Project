import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as methods from "./methods.js";
import * as statics from "./statics.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
    },
    profileImage: {
      type: String,
      default: "avatar.jpg",
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
    },
    passwordResetToken: {
      type: String,
      minlength: 8,
      select: false,
    },
    passwordResetExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);
userSchema.static(statics);
userSchema.method(methods);

//doing a pre save hook in the userSchema
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default userSchema;
