const {
    Asset, audit_asset_m2m, assets_value_m2m, assets_attribute
} = require("../models");
const { Sequelize, Op } = require("sequelize");
const Logger = require("./logger/logger");

async function updateScrapedAsset(auditId) {
    let scrapAssets = await audit_asset_m2m.findAll({
        attributes: ["asset_id"],
        where: { status: "SCRAP", audit_id: auditId },
        raw: true,
    });
    let ids = scrapAssets.map((record) => record.asset_id);
    await Asset.update(
        { status: "SCRAP" },
        {
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        }
    );
    Logger.info(`Assets :${ids} marked as scrapped`);
    return ids;
}

async function getAuditAssets(auditId, assetType) {
    let assets = await audit_asset_m2m.findAll({
        where: { audit_id: auditId },
        include: [
            {
                model: Asset,
                as: "asset",
                where: { type: assetType },
                attributes: [],
            },
        ],
        raw: true,
        attributes: [
            [Sequelize.col("audit_asset_m2m.asset_id"), "id"],
            [Sequelize.col("audit_asset_m2m.status"), "status"],
            [Sequelize.col("asset.uniqueId"), "uniqueId"],
            [Sequelize.col("asset.floor"), "floor"],
            "scannedBy"
        ],
    });

    for (let asset of assets) {
        let values = await assets_value_m2m.findAll({
            where: { asset_id: asset.id },
            include: [
                {
                    model: assets_attribute,
                    as: "attribute",
                    attributes: []
                }
            ],
            attributes: ["value", Sequelize.col("attribute.key", "key")],
            raw: true
        });
        for (let { key, value } of values) {
            asset[key] = value;
        }
    }

    return assets;
}

async function getPropertiesOfCategory(typeId) {
    return await assets_attribute.findAll({
        where: {
            type: typeId,
        },
    });
}

module.exports = {
    updateScrapedAsset,
    getAuditAssets,
    getPropertiesOfCategory
}