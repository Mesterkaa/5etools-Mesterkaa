"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston = require("winston");
exports.logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.File({ filename: '../app.log' })
    ]
});
//# sourceMappingURL=logger.js.map