import { Request, Response } from "express";
import User from "../models/User";

// *@desc   -->  Get all users
// *@route  -->  GET /api/v1/users
// *@access -->  public for now
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("-password").lean();

  !users?.length
    ? res.status(400).json({ message: "No users found!" })
    : res.status(200).json(users);
};

// *@desc   --> Get user by name
// *@route  --> GET /api/v1/users/:username
// *@access --> public
export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await User.findOne({ username })
    .select("-password")
    .lean()
    .exec();

  !user
    ? res.status(404).json({
        message:
          "No user found with this name. Please enter another valid username.",
      })
    : res.status(201).json(user);
};
