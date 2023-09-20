import "express-async-errors";

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/connectDB";

import loggerMiddleware from "./middlewares/loggerMiddleware";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

app.use(loggerMiddleware);

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(
      `Server running in ${NODE_ENV} mode on port http://localhost:${PORT}`
    )
  )
);
