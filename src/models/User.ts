import { NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a unique Username"],
      min: 4,
      max: 15,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an Email Address."],
      unique: true,
    },
    password: { type: String, required: true, min: 6, max: 15 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// !: Compare the password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// !: Password encryption (hashing)
userSchema.pre("save", async function (next: NextFunction) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
