const { createLogger, format, transports, addColors } = require("winston");

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    http : 4
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
    http : "purple"
  },
};

addColors(config.colors);

const Logger = createLogger({
  levels: config.levels,
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, ...data }) => {
          let str = `[${timestamp}] ${level}: ${message}`;
          if (Object.keys(data).length) {
            str += " data: " + JSON.stringify(data);
          }
          return str;
        })
      ),
    }),
    new transports.File({
      filename: "logs/server.log",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, ...data }) => {
          let str = `[${timestamp}] ${level}: ${message}`;
          if (Object.keys(data).length) {
            str += " data: " + JSON.stringify(data);
          }
          return str;
        })
      ),
    }),
  ],
});

module.exports = Logger;
