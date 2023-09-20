import { NextFunction, Request, Response } from "express";
import { logEvents } from "../helpers/logEvents";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}`, "reqLogs.log");

  next();
};

export default loggerMiddleware;
