import { Request, Response } from "express";
import User from "../models/User";

type responseProps = {
  statusCode: number;
  message: string;
  data?: object;
};

export const register = async (req: Request, res: Response) => {
  // @ts-ignore
  const { existingUser } = req;
  const { username, email, password } = req.body;

  // !: Check for required fields
  if (!username || !email || !password)
    res.status(400).json({ message: "All fields are required!" });

  if (!existingUser) {
    // !: Create new user
    const newUser = await User.create({ username, password, email });

    if (!newUser)
      res
        .status(400)
        .json({ message: "Invalid user data received. Please try again." });

    res.status(201).json({
      message: `New user ${newUser.username} created!`,
      user: newUser,
    });
  }

  // !: Check for duplicate users
  if (existingUser.username === username)
    res.status(409).json({
      message: "Username already used! Please try another name!",
    });

  if (existingUser.email === email)
    res.status(409).json({
      message: "Email address already used! Please try another address!",
    });
};
