import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, min: 4, max: 15 },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6, max: 15 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
