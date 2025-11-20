import { createLogger, format, transports } from "winston";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = createLogger({
  level: isDevelopment ? "silly" : "info",
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;