const { body } = require("express-validator");
const { validateRequest } = require("../../middleware/validationMiddleware");
const { getAssetsCategories } = require("../../services/auditService");
const { assetsStatus } = require("../../constant");

let createAsset = [
  body("type")
    .notEmpty()
    .withMessage("Asset type is required")
    .bail()
    .isInt()
    .withMessage(`Asset type must be of int`)
    .bail()
    .custom(async (type) => {
      let { data: categories } = await getAssetsCategories();
      if (!categories.find((category) => category.id == type)) {
        throw new Error(`Invalid type`);
      }
    }),
  body("status")
    .notEmpty()
    .withMessage("Asset status is required")
    .bail()
    .isString()
    .withMessage("Asset status must be a string")
    .bail()
    .isIn(assetsStatus)
    .withMessage(`Asset status must be one of ${assetsStatus.toString()}`),
  body("floor")
    .optional()
    .isInt()
    .withMessage("Floor must be of int type"),
];

module.exports = {
  createAsset: validateRequest(createAsset),
};
