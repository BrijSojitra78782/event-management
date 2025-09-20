const { Router } = require("express");
const {
  getAssetsCategories,
  getPropertiesOfCategory,
  getPropertyValues,
} = require("../controllers/assetType");
const checkAdmin = require("../middleware/checkAdmin");

const assetTypeRouter = Router();

assetTypeRouter.get("/all", getAssetsCategories);

assetTypeRouter.get("/:categoryId/properties", getPropertiesOfCategory);

assetTypeRouter.get("/:property",checkAdmin, getPropertyValues);

module.exports = assetTypeRouter;
