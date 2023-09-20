import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

import { v4 as uuid } from "uuid";
import { format } from "date-fns";

const __dirname = path.resolve();

export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
