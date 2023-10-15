"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGODB_URI = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("./logger");
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config({ path: "./custom/server/.env" });
exports.MONGODB_URI = process.env["MONGODB_URI"];
if (!exports.MONGODB_URI) {
    logger_1.logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
exports.PORT = Number(process.env["PORT"]);
if (!(exports.PORT > 0)) {
    logger_1.logger.error("No Port number set. Set PORT environment variable.");
    process.exit(1);
}
//# sourceMappingURL=secrets.js.map