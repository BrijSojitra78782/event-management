const { user } = require("../models");
const { CustomError } = require("../utils/Errors");

async function checkAdmin(req, res, next) {
  try {
    if (req.user && req.user.isAdmin) next();
    else throw new CustomError("Unauthorized access", 403);
  } catch (e) {
    next(e);
  }
}

module.exports = checkAdmin;
