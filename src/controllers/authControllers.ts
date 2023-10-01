import { Request, Response } from "express";

import User from "../models/User";
import generateTokens from "../helpers/generateToken";
import isPasswordsMatched from "../helpers/isPasswordsMatched";
import {
  ExpressMiddleware,
  UserLoginCredentials,
  UserRegisterCredentials,
} from "../types/types";

type RegisterRes = Record<"message", string>;

type LoginRes = RegisterRes & {
  username?: string;
  accessToken?: string;
};

export const register: ExpressMiddleware<
  UserRegisterCredentials,
  RegisterRes
> = async (req, res) => {
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

export const login: ExpressMiddleware<UserLoginCredentials, LoginRes> = async (
  req,
  res
) => {
  const { email, password } = req.body;

  if (!email || !password)
    res.status(400).json({ message: "All fields are required!" });

  const user = await User.findOne({ email }).exec();

  if (!user)
    res.status(401).json({
      message: "Unauthorized user, invalid email address. Please try again.",
    });

  const isMatched = await isPasswordsMatched(password, user?.password);

  if (!isMatched)
    res.status(401).json({
      message: "Unauthorized user, invalid password. Please try again.",
    });

  const [accessToken, refreshToken] = generateTokens({
    username: user.username,
    email: user.email,
    userId: user._id,
  });

  // ?: Creates Secure Cookie with refresh token
  res.cookie("token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login Successfully...",
    username: user.username,
    accessToken,
  });
};
