const assetService = require("../services/assetService");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function getAssetDetails(req, res, next) {
  try {
    const assetDetails = await assetService.getAssetDetails(
      req.params.assetTag
    );
    return res.json(assetDetails);
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function addAsset(req, res, next) {
  try {
    const assetDetails = await assetService.createAsset(req.body,req.user.email);
    return res.json(assetDetails);
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
async function generateQr(req, res, next) {
  try {
    let { assetTag } = req.params;
    let {size} = req.query;
    let qr = await assetService.generateQr(assetTag, size);
    res.json({data:qr});
  } catch (e) {
    next(e);
  }
}

async function generateAllAssetsQR(req,res,next){
  try {
    assetService.generateAllAssetsQR(req.user.email);
    res.json({data:"Pdf generation started"});
  } catch (error) {
    next(e);
  }
}

module.exports = {
  getAssetDetails,
  addAsset,
  generateQr,
  generateAllAssetsQR
};
