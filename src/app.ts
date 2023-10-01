import "express-async-errors";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

import corsOptions from "./config/corsOptions";

import credentials from "./middlewares/credentials";
import { errorHandler, notFoundRoute } from "./middlewares/errorMiddleware";
import loggerMiddleware from "./middlewares/loggerMiddleware";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app: Express = express();

app.use(loggerMiddleware);

app.use(credentials);

app.use(cors(corsOptions));

// ?: Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// ?: built-in middleware for json
app.use(express.json());

// ?: Middleware for cookies
app.use(cookieParser());

// ?: compress all responses
app.use(compression());

// ?: Helps secure Express apps by setting HTTP response headers
app.use(helmet());

// ?: HTTP request logger middleware
app.use(morgan("tiny"));

// ?: By doing this, you can make your application a bit more secure by not revealing the specific technology stack it's built on.
app.disable("x-powered-by");

// ?: General Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

// ?: Global Error middleware
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
