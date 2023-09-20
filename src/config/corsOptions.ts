import allowedOrigins from "./allowedOrigins";

const corsOptions = {
  origin: (origin: string, callback: (...arg: any[]) => void) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed origin!"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
