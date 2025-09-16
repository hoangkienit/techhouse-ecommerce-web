import { createLogger, format, transports } from "winston";
import winston from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({ format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ) }),
        new transports.File({
            filename: "logs/error.log",
            level: "error",
            format: format.combine(format.timestamp(), format.json()) // Ensure format is set
        }),
        new transports.File({ filename: "logs/combined.log", format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ) })
    ],
});

export default logger;