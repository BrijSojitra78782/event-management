const { Sequelize, Op } = require("sequelize");
const { Asset, assets_type_m2m, assets_value_m2m } = require("../models");

const { CustomError } = require("../utils/Errors");
const { MAX_ASSET_LEN, assetTypeMeta } = require("../constant");
const { getQrUri, generateHtmlContent, saveHTMLToPDFDirect } = require("../utils/generateQrUtils");
const { fetchAssetCategories } = require("../utils/auditUtils");
const { getPropertiesOfCategory } = require("../utils/assetsUtils");
const Logger = require("../utils/logger/logger");
const { sendMail } = require("./mailService");

async function getAssetDetails(assetTag) {
  const assetDetails = await Asset.findAll({
    attributes: ["id", "uniqueId", [Sequelize.col("assetType.type"), "type"]],
    include: [
      {
        model: assets_type_m2m,
        as: "assetType",
        attributes: [],
      },
    ],
    where: {
      uniqueId: assetTag,
    },
  });

  if (assetDetails.length == 0) {
    throw new CustomError("Asset not found!", 404, `No asset found with tag : ${assetTag}`);
  }

  return {
    data: assetDetails[0],
  };
}

async function createAsset(body, user) {
  let assetType = body.type;
  let data = await assets_type_m2m.findByPk(assetType, {
    attributes: ["type"],
  });
  let typeName = data.type;
  if(typeName != 'Guest House' && !("floor" in body)){
    throw new CustomError("Floor is required",400);
  }

  let uniqueId = await getUniqueId(body,typeName);
  let asset = await Asset.create({
    type: body.type,
    floor: body.floor,
    uniqueId: uniqueId,
    status: body.status,
    createdBy: user,
  });

  let properties = await getPropertiesOfCategory(body.type);
  let values = [];

  for (let property of properties) {``
    if (body[property.key]) {
      values.push({
        attribute_id: property.id,
        asset_id: asset.id,
        value: body[property.key],
      });
    }
  }

  Logger.info("Asset created",{...asset.dataValues,values})

  await assets_value_m2m.bulkCreate(values);
  return asset;
}

async function generateQr(assetTag, size = "S") {
  let asset = await Asset.findOne({ where: { uniqueId: assetTag } });
  if (!asset) throw new CustomError("Asset not found", 404 , `No asset found with tag : ${assetTag}`);
  return await getQrUri(
    {
      tag: asset["uniqueId"],
      type: asset["type"],
    },
    size,
    true
  );
}

async function getUniqueId(body,typeName) {
  let assetType = body.type;

  let prefix, count;

  if (!assetTypeMeta[typeName].subtypes) {
    prefix = assetTypeMeta[typeName].prefix;

    let latestAsset = await Asset.findAll({
      where: {
        type: assetType,
      },
      attributes: ["uniqueId"],
      order: [["uniqueId", "DESC"]],
      limit: 1,
      raw: true,
    });
    if(latestAsset.length){
      count = parseInt(latestAsset[0].uniqueId.replaceAll(/\D/g,''));
    }else{
      count = 0;
    }
  } else {
    // 1 level nesting

    let subtypeColumn = "Category";
    let subtype = body[subtypeColumn];
    if (!subtype) {
      throw new CustomError("Please provide category of the asset", 400);
    }

    let subtypes = assetTypeMeta[typeName].subtypes;

    if (subtypes[subtype]) {
      prefix = subtypes[subtype].prefix;
    } else {
      // deafult prefix
      prefix = assetTypeMeta[typeName].prefix;
    }


    let latestAsset = await Asset.findAll({
      where: {
        uniqueId: {
          [Op.regexp]: `^${prefix}[0-9]+$`
        },
      },
      attributes: ["uniqueId"],
      order: [["uniqueId", "DESC"]],
      limit: 1,
      raw: true,
    });


    if(latestAsset.length){
      count = parseInt(latestAsset[0].uniqueId.replaceAll(/\D/g,''));
    }else{
      count = 0;
    }
  }

  return prefix + (count + 1).toString().padStart(MAX_ASSET_LEN, "0");
}

async function getAllAssets() {
  let catagories = await fetchAssetCategories();

  let assets = {};
  for (let catagory of catagories) {
    let { type, id } = catagory;
    const assetTags = await Asset.findAll({
      attributes: ["uniqueId", "type"],
      where: {
        type: id,
      },
      raw: true,
    });
    assets[type] = { assetTags };
  }
  return assets;
}

async function getAssetsCount() {
  return await Asset.count();
}

async function getAssetTypeCount(params) {
  return await assets_type_m2m.count();
}

async function getPropertyValues(propertyID){
  let data = await assets_value_m2m.findAll({
    attributes : ['value'],
    where: {
      attribute_id :propertyID
    },
    raw : true,
    group: ["value"],
  });
  return data;
}

async function generateAllAssetsQR(email){
  try {
    let assets = await getAllAssets();
    let htmlContent = await generateHtmlContent(assets);
    let pdfRaw = await saveHTMLToPDFDirect(htmlContent);
    let attachments = [{
      filename: `assets_${Date.now()}.pdf`,
      content: pdfRaw,
      encoding: 'base64'
    }]
    await sendMail(email,
      'Attached: QR Codes for Assets',
      'Attached is the initial PDF containing QR codes for all the assets.',
      attachments
    );
    Logger.info(`Email containing QR Codes for Assets has been successfully sent to ${email}`)
  } catch (error) {
    Logger.error("Error while generating qr for all assets " + error.message, error);
  }
}

module.exports = {
  getAssetDetails,
  createAsset,
  generateQr,
  getUniqueId,
  getAllAssets,
  getAssetsCount,
  getAssetTypeCount,
  getPropertyValues,
  generateAllAssetsQR
};
