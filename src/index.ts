import dotenv from "dotenv";

import app from "./app";
import connectDB from "./config/connectDB";

dotenv.config();

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(
      `Server running in ${NODE_ENV} mode on port http://localhost:${PORT}`
    )
  )
);
