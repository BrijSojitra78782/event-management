const auditService = require("../services/auditService");
const assetService = require("../services/assetService");
const assetUtils = require("../utils/assetsUtils");
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function getAssetsCategories(req, res, next) {
  try {
    const assetsCategories = await auditService.getAssetsCategories();
    return res.json(assetsCategories);
  } catch (e) {
    next(e);
  }
}

async function getPropertiesOfCategory(req, res, next) {
  try {
    let { categoryId } = req.params;
    const properties = await assetUtils.getPropertiesOfCategory(categoryId);
    return res.json({ data: properties });
  } catch (e) {
    next(e);
  }
}


async function getPropertyValues(req,res,next){
  try {
    let { property } = req.params;
    const values = await assetService.getPropertyValues(property);
    return res.json({data:values});
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAssetsCategories,
  getPropertiesOfCategory,
  getPropertyValues
};
