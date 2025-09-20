const {
    assets_type_m2m, Asset, audit_asset_m2m
} = require("../models");
const { CustomError } = require("./Errors");

async function fetchAssetCategories() {
    let data = await assets_type_m2m.findAll({
        attributes: ["id", "type", "image"],
        raw: true,
    });
    return data;
}

async function validateAssetInAudit(assetId,auditId) {
    let asset = await Asset.findByPk(assetId,{
        properties : ['status','uniqueId']
    });
    if(!asset){
        throw new CustomError(
            `Invalid assetId`,
            404
        );
    }

    if(asset.status == 'SCRAP'){ 
        throw new CustomError("Scrapped asset can't be scanned",404);
    }

    let scannedAsset = await audit_asset_m2m.findOne({
        where: { audit_id: auditId, asset_id: assetId },
    });

    if (scannedAsset) {
        throw new CustomError(
            `${asset.uniqueId} has already been scanned`,
            409
        );
    }
}


module.exports = {
    fetchAssetCategories,
    validateAssetInAudit,
}