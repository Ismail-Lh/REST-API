import { NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// !: Password encryption (hashing)
userSchema.pre("save", async function (next: NextFunction) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// !: Password Reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // !: Reset token expires in 10 minute
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
