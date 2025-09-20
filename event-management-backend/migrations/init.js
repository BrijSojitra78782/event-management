const db = require("../models");
const xlsx = require("xlsx");
const { Op } = require("sequelize");
const fs = require("fs");

const winston = require("winston");
const e = require("express");
const { assetsStatus } = require("../constant");
const images = require("../data/images");
const logger = winston.createLogger({
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/initError.log" }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...extra }) => {
      return `${timestamp} ${level}: ${message} ${JSON.stringify(extra)}`;
    }) // winston.format.json() // Ensures logs are in JSON format
  ),
});

const filePath = "../data/asset.xlsx";

const typeMeta = {
  Chairs: {
    sheet: "chairs",
    skipLast: 14,
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  Tables: {
    sheet: "Tables",
    skipLast: 8,
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
    ],
  },
  AC: {
    sheet: "AC",
    skipLast: 2,
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particulars", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  "Ventilation System": {
    sheet: "Ventilation System",
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particulars", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  "Nilkamal Chair /Table - Canteen": {
    sheet: "nilkamal chair",
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  Lights: {
    sheet: "lights ",
    skipLast: 4,
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Category", db: "Category" },
    ],
  },
  Whiteboard: {
    sheet: "whiteboard",
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  Fan: {
    sheet: "Fan ",
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  Sofa: {
    sheet: "Sofa ",
    skipLast: 1,
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
  },
  "Other Asset ( RO, Cooler, geyser)": {
    sheet: "RO,Watercooler,geyser,STP,SOFTE",
    fields: [
      { sheet: "Company", db: "Company" },
      { sheet: "Area", db: "Area" },
      { sheet: "Particular", db: "Particular" },
      { sheet: "Category", db: "Category" },
    ],
    skipLast: 1,
  },
  "Guest House": {
    sheet: "Guest House",
    fields: [
      { sheet: "Make", db: "Make" },
      { sheet: "Particular", db: "Category" },
      { sheet: "Room On", db: "Room On" },
    ],
    skipLast: 1,
  },
};

async function init() {
  try {
    const mainSheetData = xlsx.readFile(filePath); // console.log(mainSheetData.SheetNames);
    let obj = {};

    for (let key in typeMeta) {
      let assets = xlsx.utils.sheet_to_json(
        mainSheetData.Sheets[typeMeta[key].sheet]
      );
      let properties = typeMeta[key].fields;
      let countObj = {};
      for (let { sheet } of properties) {
        countObj[sheet] = 0;
      }

      const typeObj = await createType(key, images[key]);

      for (let { db } of properties) {
        await addProperty(typeObj.id, db);
      }

      let arr = [];

      let skipLast = typeMeta[key].skipLast || 0;

      let err = 0,
        com = 0;
      //  let j=0;
      for (let i = 0; i < assets.length - skipLast; i++) {
        let asset = assets[i];
        //           if(j>2) break;
        let tag =
          asset["Asset Tag"] || asset["Asset Name"] || asset["Asset No"];
        
        if(key == 'Nilkamal Chair /Table - Canteen' ){
           tag = tag.replace("CH","CHNK");
        }
        arr.push(tag); // console.log(asset);
        //           j++;
        try {
          verifytag(tag);
          let Asset = await addAsset(
            tag,
            parseFloor(asset.Floor),
            typeObj.id,
            parseStatus(asset["Status"])
          );

          for (let { sheet, db } of properties) {
            if (asset[sheet]) {
              countObj[sheet]++;
              let property = await getProperty(typeObj.id, db);
              await addValue(Asset.id, property.id, asset[sheet]);
            }
          }

          com++;
        } catch (error) {
          err++;
          logger.error(`Error in ${i + 2} row of sheet : ${key}`, {
            error: error.errors || error.message,
            asset: asset,
          }); // console.log(i,asset,error);
        }
      }
      fs.writeFile("../data/data.json", JSON.stringify(arr), () => {}); // console.log(com, err,countObj);
      obj[key] = {
        countObj,
        com,
        err,
      };
    }
    console.log(obj)
  } catch (error) {
    console.log(error);
  }
}

async function auditData(auditId) {

  let scannedAssets = await db.audit_asset_m2m.findAll({
    attributes : ["asset_id"],
    where: { audit_id: auditId},
  });

  let assets = await db.Asset.findAll({
    attributes: ["id"],
    where: {
      status: {
        [Op.ne]: "SCRAP",
      },
    },
  });

  let data = [];

  for (let asset of assets) {  

    if(scannedAssets.find(scann => scann.asset_id == asset.id)) continue;

    data.push({
      audit_id: auditId,
      asset_id: asset.id,
      status: assetsStatus[Math.floor(Math.random() * assetsStatus.length)],
      scannedBy: "test.admin@google.com",
    });
  }

  console.log(data);
  await db.audit_asset_m2m.bulkCreate(data);
}

db.sequelize.sync().then((req) => {
    // init();
  auditData(39);
});

async function createType(name, image) {
  let type = await db.assets_type_m2m.create({
    type: name,
    image: image,
  });
  return type;
}

async function getType(name) {
  const types = await db.assets_type_m2m.findAll({
    where: {
      type: {
        [Op.eq]: name,
      },
    },
  });

  return types.length == 0 ? null : types[0];
}

async function getProperty(type, key) {
  const props = await db.assets_attribute.findAll({
    where: {
      type: {
        [Op.eq]: type,
      },
      key: {
        [Op.eq]: key,
      },
    },
  });

  return props.length == 0 ? null : props[0];
}

async function addProperty(type, key) {
  let prop = await db.assets_attribute.create({
    key: key,
    type: type,
  });

  return prop;
}

async function addAsset(tag, floor, type, status) {
  let asset = await db.Asset.create({
    uniqueId: tag,
    floor: parseFloor(floor),
    type: type,
    status: status,
    createdBy: "test.user@google.com",
  });

  return asset;
}

async function addValue(asset, property, value) {
  let assetValue = await db.assets_value_m2m.create({
    attribute_id: property,
    asset_id: asset,
    value: value,
  });

  return assetValue;
}
// getProperty()

(async () => {
  // let obj = await getType("Chairs");
  // console.log(obj.createdAt);
  // console.log(await getProperty("1", "colour"));
  // let t = await createType("Some");
  // console.log(await addProperty(t.id,"Company"))
  // addProperty("3", "colour");
})();

function parseFloor(floor) {
  if (!floor) return 0; // have to handle for the
  if (Number.isInteger(floor)) return floor;
  else if (typeof floor == "string") {
    floor = floor.toLocaleLowerCase();

    if (floor == "g.f" || floor == "gf") return 0;
    else if (floor == "b1" || floor == "basement 1") return -1;
    else if (floor == "b2") return -2;
    else if (floor == "terrace") return 100;
    return 0; // default
  }
}

function parseStatus(status) {
  if (!status) return "IN_STOCK";
  status = status.toLocaleLowerCase();
  if (status == "in use" || status == "working") {
    return "IN_USE";
  } else if (
    status == "not in use" ||
    status == "damage & threw" ||
    status == "off condition"
  ) {
    return "SCRAP";
  } else if (status == "stock" || status == "store") {
    return "IN_STOCK";
  } else if (status == "damage") {
    return "IN_MAINTENANCE";
  }

  return "IN_STOCK";
}

function verifytag(tag) {
  if (!/^[A-Z]{2,16}[0-9]{3,4}$/.test(tag)) {
    throw new Error("Invalid tag");
  }
}
