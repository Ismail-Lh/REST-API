import "express-async-errors";

import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/connectDB";

import corsOptions from "./config/corsOptions";
import credentials from "./middlewares/credentials";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import errorHandler from "./middlewares/errorMiddleware";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

app.use(loggerMiddleware);

app.use(credentials);

app.use(cors(corsOptions));

// ?: Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// ?: built-in middleware for json
app.use(express.json());

app.use(cookieParser());

// ?: compress all responses
app.use(compression());

// ?: Helps secure Express apps by setting HTTP response headers
app.use(helmet());

// ?: HTTP request logger middleware
app.use(morgan("tiny"));

// ?: By doing this, you can make your application a bit more secure by not revealing the specific technology stack it's built on.
app.disable("x-powered-by");

// ?: Global Error middleware
app.use(errorHandler);

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(
      `Server running in ${NODE_ENV} mode on port http://localhost:${PORT}`
    )
  )
);
