const Logger = require("../utils/logger/logger");

function errorMiddleware(err, req, res, next) {
  Logger.error(err.message,err);

  if (err.name == "ValidationError") {
    return res.status(400).json({
      errors: err.errors,
    });
  } else if (err.name == "SequelizeDatabaseError") {
    return res.status(400).json({
      errors: [{ msg: "Database Error" }],
    });
  }

  let status = err.statusCode || 500;
  res.status(status).json({ errors: [{ msg: err.message }] });
}

module.exports = {
  errorMiddleware,
};
