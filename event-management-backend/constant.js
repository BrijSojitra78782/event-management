const fs = require('fs');
const path = require('path');

const MAX_ASSET_LEN = 4;
const assetsStatus = ["IN_USE", "IN_STOCK", "IN_MAINTENANCE", "SCRAP"];
const QR_SIZE = {
  S: { qrSize: 80 , textHeight: 16 },
  // M: { qrSize: 200, textHeight: 30 },
  // L: { qrSize: 250, textHeight: 40 },
  XL: { qrSize: 320, textHeight: 50 },
};

// for now it is static need to updated this in future
const assetTypeMeta = {
  Chairs: {
    prefix: "CHCHAIR",
  },
  Tables: {
    prefix: "CHTAB",
  },
  AC: {
    prefix: "CHAC",
  },
  "Ventilation System": {
    subtypes: {
      "Ventilation System": {
        prefix: "CHVS",
      },
      Panel: {
        prefix: "CHEP",
      },
      "Dual Speed Axial Jet Fan": {
        prefix: "CHVS",
      },
    },
    prefix: "CHVS",
  },
  "Nilkamal Chair /Table - Canteen": {
    subtypes: {
      Chair: {
        prefix: "CHNKCHAIR",
      },
      "Table Base": {
        prefix: "CHNKTAB",
      },
      "Table Top": {
        prefix: "CHNKTAB",
      },
    },
    prefix: "CHNK",
  },
  Lights: {
    prefix: "CHLIGHT",
  },
  Whiteboard: {
    prefix: "CHWHITEB",
  },
  Fan: {
    prefix: "CHFAN",
  },
  Sofa: {
    subtypes: {
      "Side table": {
        prefix: "CHSOFATAB",
      },
      Table: {
        prefix: "CHSOFATAB",
      },
      "Table set": {
        prefix: "CHSOFATAB",
      },
      Chair: {
        prefix: "CHSOFACHAIR",
      },
      "Chair with Bottom": {
        prefix: "CHSOFACHAIR",
      },
      "Leisure Chair": {
        prefix: "CHSOFACHAIR",
      },
      "Chair with ss legs": {
        prefix: "CHSOFACHAIR",
      },
      Stool: {
        prefix: "CHSOFASTOOL",
      },
      Puff: {
        prefix: "CHSOFAPUFF",
      },
      Sofa: {
        prefix: "CHSOFA",
      },
      Bed: {
        prefix: "CHDOUBLEBED",
      },
      Bench: {
        prefix: "CHSOFABEN",
      },
      Set: {
        prefix: "CHSOFADIN",
      },
      "Carrom Board": {
        prefix: "CHCARROM",
      },
      "Foosball Table": {
        prefix: "CHFOOSTAB",
      },
      "Table tennis": {
        prefix: "CHTABTEN",
      },
    },
    prefix: "CHSOFA",
  },
  "Other Asset ( RO, Cooler, geyser)": {
    subtypes: {
      "RO system": {
        prefix: "CHWATCOL",
      },
      "Deep Freezer": {
        prefix: "CHDEEFRE",
      },
      "Exhaust Fan": {
        prefix: "CHEXHAUS",
      },
      "Gas Geyser": {
        prefix: "CHGASGEY",
      },
      "Lubi 1 HP": {
        prefix: "CHLUBIPUM",
      },
      "Lubi single phase": {
        prefix: "CHLUBIPUM",
      },
      "Open well pump": {
        prefix: "CHWATSOF",
      },
      "Scrubber drier": {
        prefix: "CHSCRUBDRI",
      },
      "Semi Automatic": {
        prefix: "CHWATSOF",
      },
      "Storage Tank": {
        prefix: "CHROWTAN",
      },
    },
    prefix: "CHOTH",
  },
  "Guest House": {
    subtypes: {
      Mattress: {
        prefix: "GHMAT",
      },
      Bed: {
        prefix: "GHBED",
      },
      Cupboard: {
        prefix: "GHCUP",
      },
    },
    prefix: "GH",
  },
};

const FLOORS = {
  "-1": "B1",
  "-2": "B2",
  0: "G.F",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  100: "Terrace",
};
// add private key file to utils folders from PROD VM.
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname,"utils","private_key.pem"), 'utf8');

module.exports = {
  MAX_ASSET_LEN,
  assetsStatus,
  QR_SIZE,
  assetTypeMeta,
  FLOORS,
  PRIVATE_KEY
};
