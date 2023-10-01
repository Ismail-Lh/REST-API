import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type generateTokensProps = {
  username: string;
  email: string;
  userId: Types.ObjectId;
};

const generateTokens = ({ username, email, userId }: generateTokensProps) => {
  const accessToken = jwt.sign(
    { username, email, userId },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });

  return [accessToken, refreshToken];
};

export default generateTokens;
