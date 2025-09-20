const { Op, Sequelize } = require("sequelize");
const {
  Audit,
  Asset,
  audit_asset_m2m,
  assets_type_m2m,
} = require("../models");
const { CustomError } = require("../utils/Errors");
const ExcelJS = require("exceljs");
const { generateHtmlContent, saveHTMLToPDFDirect } = require("../utils/generateQrUtils");
const { fetchAssetCategories, validateAssetInAudit } = require("../utils/auditUtils");
const { updateScrapedAsset, getAuditAssets, getPropertiesOfCategory } = require("../utils/assetsUtils");
const { FLOORS } = require("../constant");
const Logger = require("../utils/logger/logger");

// Retrive the all the Audits data
async function getAudits(params) {
  const {
    filter = "",
    page = 1,
    limit = 10,
    orderBy = "start",
    order = "DESC",
  } = params;

  const offset = (page - 1) * limit;

  const audits = await Audit.findAll({
    attributes: ["id", "name", "start", "status"],
    order: [[orderBy, order]],
    limit: limit,
    offset: offset,
    where: {
      name: {
        [Op.like]: `%${filter}%`,
      },
    },
    raw: true,
  });

  const totalAsset = await getTotalAssetCount();

  let auditList = await Promise.all(
    audits.map(async (audit) => {
      if (audit.status === "IN_PROGRESS") {
        return {
          ...audit,
          total: totalAsset,
          remaining: totalAsset - (await getScannedAssetCount(audit.id)),
        };
      } else {
        return {
          ...audit,
          total: await getScannedAssetCount(audit.id),
          remaining: 0,
        };
      }
    })
  );

  let auditdata = {
    data: auditList,
    total_audits: await Audit.count(),
    count: auditList.length,
    page: page,
  };

  return auditdata;
}

// Retrieve the particular asset's summary according to the asset type
async function getAssetSummary(auditId, assetType) {
  const assetSummary = await audit_asset_m2m.findAll({
    where: { audit_id: auditId },
    include: [
      {
        model: Asset,
        as: "asset",
        where: { type: assetType },
        attributes: [],
        required: true,
      },
    ],
    attributes: [
      "audit_asset_m2m.status",
      [Sequelize.fn("COUNT", Sequelize.col("audit_asset_m2m.status")), "count"],
    ],
    group: ["audit_asset_m2m.status"],
    raw: true,
  });

  let assetSummaryDetails = {
    data: {
      total_asset: 0,
      completed: 0,
      in_use: 0,
      in_maintenance: 0,
      in_stock: 0,
      scrap: 0,
    },
  };

  const auditStatus = await Audit.findByPk(auditId, {
    attributes: ["status"],
  });

  for (let asset of assetSummary) {
    assetSummaryDetails.data[asset.status.toLowerCase()] = asset.count;
    assetSummaryDetails.data.completed += asset.count;
  }

  if (auditStatus.status != "COMPLETED") {
    assetSummaryDetails.data.total_asset = await Asset.count({
      where: {
        type: assetType,
        status: {
          [Op.ne]: "SCRAP",
        },
      },
    });
  } else {
    assetSummaryDetails.data.total_asset = assetSummaryDetails.data.completed;
  }

  return assetSummaryDetails;
}

// Retrive all the different asset category
async function getAssetsCategories() {
  const assetsCategories = await fetchAssetCategories();
  let assetsCategoryList = {
    data: assetsCategories,
    count: assetsCategories.length,
  };

  return assetsCategoryList;
}

// Create new Audit
async function createAudit(audit,user) {
  let auditExist = await checkInProgressAudit();
  if (auditExist) {
    throw new CustomError(
      `Please complete "${auditExist.name}"`,
      400
    );
  }
  let createdAudit = await Audit.create({
    name: audit.name,
    description: audit.description,
    start: Date.now(),
    status: "IN_PROGRESS",
    createdBy : user
  });
  Logger.info("Audit created",createdAudit.dataValues);
  return  createdAudit;
}

async function submitAudit(auditId, user) {
  let audit = await Audit.findByPk(auditId);
  if(!audit){
    throw new CustomError("Audit not found",404);
  }

  let scans = await getScannedAssetCount(auditId);
  let total = await getTotalAssetCount();

  if (scans < total) {
    throw new CustomError(
      `Please scan all remaining assets`,
      400
    );
  }
  await updateScrapedAsset(auditId);
  
  audit.status = 'COMPLETED';
  audit.end = Date.now();
  audit.submittedBy = user;

  Logger.info(`${audit.name} submitted by ${user}`);
  return await audit.save();
}

async function checkInProgressAudit() {
  return await Audit.findOne({ where: { status: "IN_PROGRESS" } });
}

// Retrive all asset Count
async function getTotalAssetCount() {
  return await Asset.count({
    where: {
      status: {
        [Op.ne]: "SCRAP",
      },
    },
  });
}

// Retrive Audit wise Scanned asset count
async function getScannedAssetCount(auditId) {
  return await audit_asset_m2m.count({
    where: {
      audit_id: auditId,
    },
  });
}

async function addScannedAsset(auditId, assetId, status,user) {
  await validateAssetInAudit(assetId, auditId)

  let asset = await audit_asset_m2m.create({
    audit_id: auditId,
    asset_id: assetId,
    status: status,
    scannedBy : user
  });

  Logger.info(`Asset : ${assetId} scanned as ${status} in audit : ${auditId} by ${user}`);

  if (status != "SCRAP") {
    // update the status in the assets table as well, for scrap update it on completion of audit
    let asset = await Asset.findByPk(assetId);
    asset.status = status;
    await asset.save();
  }

  return asset;
}

async function getRemainingAssets(auditId, assetType, params) {
  const audit = await Audit.findByPk(auditId, {
    attributes: ["status"],
  });

  if (!audit) {
    throw new CustomError("Audit not found", 404);
  }

  if (audit.status == "COMPLETED") {
    return {
      data: [],
      total_records: 0,
      count: 0,
      page: 1,
    };
  }

  const {
    filter = "",
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    order = "DESC",
  } = params;

  const offset = (page - 1) * limit;

  const excludedAssetIds = await audit_asset_m2m.findAll({
    attributes: ["asset_id"],
    raw: true,
    include: [
      {
        model: Asset,
        as: "asset",
        where: { type: assetType },
        attributes: [],
        required: true,
      },
    ],
    where: { audit_id: auditId },
  });

  const assetIds = excludedAssetIds.map((record) => record.asset_id);

  const remainingAssets = await Asset.findAll({
    attributes: ["id", "uniqueId", [Sequelize.col("assetType.type"), "type"], "floor"],
    include: [
      {
        model: assets_type_m2m,
        as: "assetType",
        attributes: [],
      },
    ],
    order: [
      [orderBy, order],
      ["uniqueId", order],
    ],
    limit: limit,
    offset: offset,
    where: {
      id: { [Op.notIn]: assetIds },
      status: {
        [Op.ne]: "SCRAP",
      },
      uniqueId: {
        [Op.like]: `%${filter}%`,
      },
      type: assetType,
    },
    raw: true,
  });

  const totalRemainingRecordCount = await Asset.count({
    include: [
      {
        model: assets_type_m2m,
        as: "assetType",
        attributes: [],
      },
    ],
    where: {
      id: { [Op.notIn]: assetIds },
      status: {
        [Op.ne]: "SCRAP",
      },
      type: assetType,
    },
  });

  let remainingAssetList = {
    data: remainingAssets,
    total_records: totalRemainingRecordCount,
    count: remainingAssets.length,
    page: page,
  };

  return remainingAssetList;
}

async function generateReport(auditId) {
  const workbook = new ExcelJS.Workbook();
  const types = await getAssetsCategories();

  for (const type of types.data) {
    let sheetName = type.type.replaceAll("/", "")
    const worksheet = workbook.addWorksheet(sheetName);

    let columns = [
      { header: "Asset Tag", key: "uniqueId" },
      { header: "Type", key: "type" },
      { header: "Status", key: "status" },
      { header : "Scanned By", key : "scannedBy"}
    ];

    if(sheetName != "Guest House"){
      columns.push({ header: "Floor", key: "floor" });
    }

    const properties = await getPropertiesOfCategory(type.id);
    for (let property of properties) {
      columns.push({
        header: property.key,
        key: property.key,
      });
    }

    var assets = await getAuditAssets(auditId, type.id);

    worksheet.columns = columns.map(column => ({...column, width : 20}));
    for (let asset of assets) {
      let obj = { ...asset, type: type.type };
      if(sheetName != "Guest House"){
        obj.floor = FLOORS[asset.floor]
      }
      worksheet.addRow(obj);
    }

  }

  await workbook.xlsx.writeFile("output.xlsx")

  return workbook.xlsx;
}

async function getAudit(auditId) {
  return await Audit.findByPk(auditId, {
    raw: true
  })
}

async function getReamingngAssetsQr(query) {
  let { assetType, auditId } = query;
  const excludedAssetIds = await audit_asset_m2m.findAll({
    attributes: ["asset_id"],
    raw: true,
    include: [
      {
        model: Asset,
        as: "asset",
        where: { type: assetType },
        attributes: [],
        required: true,
      },
    ],
    where: { audit_id: auditId },
  });

  const assetIds = excludedAssetIds.map((record) => record.asset_id);

  const type = await assets_type_m2m.findByPk(assetType, {
    attributes: ["type"],
    raw: true
  });

  const remainingAssets = await Asset.findAll({
    attributes: ["uniqueId", "type"],
    where: {
      id: { [Op.notIn]: assetIds },
      status: {
        [Op.ne]: "SCRAP",
      },
      type: assetType,
    },
    raw: true,
  });
  // console.log(remainingAssets)
  let obj = {};
  obj[type.type] = { assetTags: remainingAssets };
  const html = await generateHtmlContent(obj);
  return await saveHTMLToPDFDirect(html);
}
async function getAuditsCount() {
  return await Audit.count();
}



module.exports = {
  getAudits,
  createAudit,
  addScannedAsset,
  submitAudit,
  getAssetsCategories,
  getAssetSummary,
  getRemainingAssets,
  generateReport,
  getAudit,
  getReamingngAssetsQr,
  getAuditsCount
};
