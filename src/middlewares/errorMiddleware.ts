import { NextFunction, Request, Response } from "express";
import { logEvents } from "../helpers/logEvents";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLogs.log"
  );

  console.log(err.tack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status).json({ message: err.message });
};

const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);

  res.status(404);

  next(error);
};

export { errorHandler, notFoundRoute };
