import winston from "winston";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "debug" : "info",
    defaultMeta: { service: "Knowtify" },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.errors({ stack: true }),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
})

export default logger