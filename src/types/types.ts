import type { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { FlattenMaps, Types } from "mongoose";
import type { DeepPartial } from "utility-types";

// See this for the following types
// https://stackoverflow.com/questions/34508081/how-to-add-typescript-definitions-to-express-req-res
// https://stackoverflow.com/questions/61132262/typescript-deep-partial
export type TUser = FlattenMaps<
  {
    createdAt: NativeDate;
    updatedAt: NativeDate;
  } & {
    username: string;
    email: string;
    password: string;
    active: boolean;
  }
> & {
  _id: Types.ObjectId;
};

export type TypedRequest<
  ReqBody = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  DeepPartial<ReqBody>,
  DeepPartial<QueryString>
> & {
  payload?: JwtPayload;
  existingUser?: TUser;
};

export type ExpressMiddleware<
  ReqBody = Record<string, unknown>,
  Res = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = (
  req: TypedRequest<ReqBody, QueryString>,
  res: Response<Res>,
  next: NextFunction
) => Promise<void> | void;

export interface UserRegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export type UserRegisterRes = Record<"message", string>;

export type UserLoginCredentials = Omit<UserRegisterCredentials, "username">;

export type UserLoginRes = UserRegisterRes & {
  username?: string;
  accessToken?: string;
};

export type UpdateUserCredentials = Omit<UserRegisterCredentials, "password">;

export type UpdateUserRes = Record<"message", string> & { user?: TUser };

export type CheckUserReq = UpdateUserCredentials;

export type PRoutesRes = Record<"message", string>;
export type PRoutesReq = {};
