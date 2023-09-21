import mongoose from "mongoose";

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

const User = mongoose.model("User", userSchema);

export default User;
