const { Router } = require("express");

const {
  getFilteredAudits,
  createAudit,
  addScannedAsset,
  submitAudit,
  getAssetSummary,
  getRemainingAssets,
  generateReport,
  getDashboardCounts,
  getRemainingAssetsQr,
  validateAsset
} = require("../controllers/audit");

const auditValidator = require("../utils/validators/auditValidator");
const checkAdmin = require("../middleware/checkAdmin");

const auditRouter = Router();

auditRouter.get("/audits",auditValidator.getAudits, getFilteredAudits);

auditRouter.post("/create", auditValidator.createAuditInput, checkAdmin ,createAudit);

auditRouter.put("/:auditId/submit", submitAudit);

auditRouter.post("/:auditId/asset/:assetId", auditValidator.addScannedAsset, addScannedAsset);

auditRouter.get("/:auditId/summary/:assetType", getAssetSummary);

auditRouter.get("/:auditId/:assetType/remainingAsset", auditValidator.getAudits, getRemainingAssets);

auditRouter.get("/:auditId/:assetType/remainingAsset/generateQR", checkAdmin , getRemainingAssetsQr);

auditRouter.get("/:auditId/report",generateReport);

auditRouter.get("/dashboard", checkAdmin, getDashboardCounts);

auditRouter.get("/:auditId/:assetId/validate", checkAdmin, validateAsset)

module.exports = auditRouter;
