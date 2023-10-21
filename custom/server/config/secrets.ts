import {logger} from "./logger.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env"});

const MONGODB_ADDRESS = process.env["MONGODB_ADDRESS"];
const MONGODB_USER_ID = process.env["MONGODB_USER_ID"];
const MONGODB_USER_SECRET = process.env["MONGODB_USER_SECRET"];

if (!MONGODB_ADDRESS || !MONGODB_USER_ID || !MONGODB_USER_SECRET) {
    logger.error("One or more enviroment variables for MONGODB connection not set. Use: MONGODB_ADDRESS, MONGODB_USER_ID and MONGODB_USER_SECRET");
    process.exit(1);
}

export const MONGODB_URI = `mongodb://${MONGODB_USER_ID}:${MONGODB_USER_SECRET}@${MONGODB_ADDRESS}`

export const PORT = Number(process.env["PORT"]);

if (!(PORT > 0)) {
  logger.error("No Port number set. Set PORT environment variable.");
  process.exit(1);
}
