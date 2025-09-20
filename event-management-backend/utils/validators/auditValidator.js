const { body, query } = require("express-validator");
const { validateRequest } = require("../../middleware/validationMiddleware");
const { Audit } = require("../../models");

const sortOrders = ["ASC", "DESC"];
const scannedAssestStatus = ["IN_USE", "IN_STOCK", "IN_MAINTENANCE", "SCRAP"];
const auditStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];

let createAuditBody = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name is too short")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Name is too long")
    .bail()
    .custom(async (name) => {
      let audits = await Audit.findAll({
        where: {
          name: name,
        },
      });
      if (audits.length) {
        throw Error(`'${name}' already exists`);
      }
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail(),
  // body("start")
  //   .notEmpty()
  //   .withMessage("start date is required")
  //   .bail()
  //   .isISO8601()
  //   .bail()
  //   .withMessage("Invalid start date format. Should be ISO 8601")
  //   .toDate(),
  // body("end")
  //   .notEmpty()
  //   .withMessage("end date is required")
  //   .bail()
  //   .isISO8601()
  //   .withMessage("Invalid end date format. Should be ISO 8601")
  //   .bail()
  //   .toDate()
  //   .custom((endDate, { req }) => !req.body.start || endDate > req.body.start)
  //   .withMessage("end date should greater than start date"),
];

let getAuditsQuery = [
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

let addScannedAsset = [
  body("status")
    .notEmpty()
    .withMessage("Status is required field")
    .bail()
    .isIn(scannedAssestStatus)
    .withMessage(`status must be one of ${scannedAssestStatus.toString()}`),
];



module.exports = {
  createAuditInput: validateRequest(createAuditBody),
  getAudits: validateRequest(getAuditsQuery),
  addScannedAsset: validateRequest(addScannedAsset),
};
