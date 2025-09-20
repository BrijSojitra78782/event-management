const auditService = require("../services/auditService");
const assetService = require("../services/assetService");
const userService = require("../services/userService");
const { CustomError } = require("../utils/Errors");
const { validateAssetInAudit } = require("../utils/auditUtils");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function getFilteredAudits(req, res, next) {
  try {
    const audits = await auditService.getAudits(req.query);
    return res.json(audits);
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function createAudit(req, res, next) {
  try {
    const audit = await auditService.createAudit(req.body,req.user.email);
    return res.json({ data: audit });
  } catch (e) {
    next(e);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 */
async function submitAudit(req, res, next) {
  try {
    let { auditId } = req.params;
    const audit = await auditService.submitAudit(auditId,req.user.email);
    return res.json({ data: audit });
  } catch (e) {
    next(e);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 */
async function addScannedAsset(req, res, next) {
  try {
    let { auditId, assetId } = req.params;
    const scannedAsset = await auditService.addScannedAsset(
      auditId,
      assetId,
      req.body.status,
      req.user.email
    );
    return res.json(scannedAsset);
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function getAssetSummary(req, res, next) {
  try {
    const assetSummary = await auditService.getAssetSummary(
      req.params.auditId,
      req.params.assetType
    );
    return res.json(assetSummary);
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function getRemainingAssets(req, res, next) {
  try {
    const remainingAsset = await auditService.getRemainingAssets(
      req.params.auditId,
      req.params.assetType,
      req.query
    );
    return res.json(remainingAsset);
  } catch (e) {
    next(e);
  }
}


async function generateReport(req,res,next) {
  try {
    let audit = await auditService.getAudit(req.params.auditId);
    if(!audit){
      throw new CustomError("Audit not found",404);
    }
    let report = await auditService.generateReport(req.params.auditId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${audit.name}.xlsx`);
    await report.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

async function getDashboardCounts(req,res,next){
  try {
    let data = {
      audits : await auditService.getAuditsCount(),
      assets : await assetService.getAssetsCount(),
      users : await userService.getUsersCount(),
    } 
    res.json(data);
  } catch (e) {
    next(e);
  }
}

async function getRemainingAssetsQr(req,res,next) {
  try {
    let html = await auditService.getReamingngAssetsQr(req.params);
    // writeFile("./data.html",html,()=>{})
    return res.json({data:html})
  } catch (e) {
    next(e);
  }
}

async function validateAsset(req,res,next) {
  try {
    await validateAssetInAudit(req.params.assetId,req.params.auditId);
    return res.json({data:"Asset is Valid"})
  } catch (e) {
    next(e);
  }
}


module.exports = {
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
};
