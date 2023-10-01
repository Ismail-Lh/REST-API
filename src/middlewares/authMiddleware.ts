import jwt, { type JwtPayload } from "jsonwebtoken";

import User from "../models/User";
import { ExpressMiddleware } from "../types/types";

type CheckUserReq = {
  username: string;
  email: string;
};

type PRoutesRes = Record<"message", string>;
type PRoutesReq = {};

export const checkDuplicateUser: ExpressMiddleware<CheckUserReq> = async (
  req,
  res,
  next
) => {
  const { username, email } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  req.existingUser = existingUser;

  next();
};

export const protectedRoutes: ExpressMiddleware<
  PRoutesReq,
  PRoutesRes
> = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders && !authHeaders?.startsWith("Bearer"))
    res.status(401).json({
      message:
        "Unauthorized user, you are not logged in. Please log in again to get access...",
    });

  const token: string | undefined = authHeaders.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_KEY,
    (err: any, payload: JwtPayload) => {
      if (err) res.status(403).json({ message: err.message });

      req.payload = payload;

      next();
    }
  );
};
