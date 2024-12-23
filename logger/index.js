import { format, createLogger, transports } from "winston";
const { combine, timestamp, label, printf, colorize } = format;
import 'winston-daily-rotate-file';

const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/log-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: '20m',
    maxFiles: "14d",
});

const CATEGORY = "SOLEVO JIRA INTEGRATION";

//Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    level: "debug",
    format: combine(label({ label: CATEGORY }), timestamp(), customFormat, colorize()),
    transports: [
        fileRotateTransport,
        new transports.Console()
    ],
});

export default logger;