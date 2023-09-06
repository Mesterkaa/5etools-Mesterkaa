import {logger} from "./logger";
import * as dotenv from "dotenv";
dotenv.config();

export const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

export const PORT = Number(process.env["PORT"]);

if (!(PORT > 0)) {
  logger.error("No Port number set. Set PORT environment variable.");
  process.exit(1);
}
