import User from "../models/User";
import {
  ExpressMiddleware,
  TUser,
  UpdateUserCredentials,
  UpdateUserRes,
} from "../types/types";

// *@desc   -->  Get all users
// *@route  -->  GET /api/v1/users
// *@access -->  public for now
export const getAllUsers: ExpressMiddleware = async (req, res) => {
  const users = await User.find().select("-password").lean();

  !users?.length
    ? res.status(400).json({ message: "No users found!" })
    : res.status(200).json({ users });
};

// *@desc   --> Get user by name
// *@route  --> GET /api/v1/users/:username
// *@access --> public
export const getUser: ExpressMiddleware = async (req, res) => {
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

// *@desc   --> Update the current user profile
// *@route  --> GET /api/v1/users/update-current-user
// *@access --> private
export const updateCurrentUser: ExpressMiddleware<
  UpdateUserCredentials,
  UpdateUserRes
> = async (req, res) => {
  const { username, email } = req.body;
  const { payload } = req;

  const user = await User.findById(payload.userId).select("-password").exec();

  if (!user)
    res.status(404).json({ message: "User not found. Please try again." });

  if (user.username === username && user.email === email)
    res.status(200).json({ message: "User up to date" });

  user.username = username || user.username;
  user.email = email || user.email;

  await user.save();

  res.status(201).json({ message: "user updated successfully!", user });
};
