const { Router } = require("express");
const { getAssetDetails, addAsset, generateQr, getPropertyValues, generateAllAssetsQR } = require("../controllers/asset");
const assetValidator = require("../utils/validators/assetValidator");
const checkAdmin = require("../middleware/checkAdmin");

const assetRouter = Router();

assetRouter.get("/:assetTag", getAssetDetails);

assetRouter.post("/create", checkAdmin , assetValidator.createAsset, addAsset);

assetRouter.get("/all/generateQr", checkAdmin, generateAllAssetsQR);

assetRouter.get("/:assetTag/generateQr", checkAdmin , generateQr);

module.exports = assetRouter;
