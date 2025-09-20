const { body, query } = require("express-validator");
const { validateRequest } = require("../../middleware/validationMiddleware");
const { user } = require("../../models");
const sortOrders = ["ASC", "DESC"];


let getUsersQuery = [
  query("page").optional().isInt().withMessage("page must be a number").toInt(),
  query("limit")
    .optional()
    .isInt()
    .withMessage("limit must be a number")
    .toInt(),
  body("filter").optional(),
  query("order")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage(`order must be one of ${sortOrders.toString()}`),
];


module.exports = {
  getUsers: validateRequest(getUsersQuery),
};