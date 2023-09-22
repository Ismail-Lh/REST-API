import { NextFunction, Response, Request } from "express";
import User from "../models/User";

export const checkDuplicateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // @ts-ignore
  req.existingUser = existingUser;

  next();
};
