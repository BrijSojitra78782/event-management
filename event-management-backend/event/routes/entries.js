const { Router } = require("express");
const checkAdmin = require("../../middleware/checkAdmin");
const { scanEventQr, generateEventQr } = require("../controllers/entries");

const entryRouter = Router();

entryRouter.post("/generateQr",checkAdmin,generateEventQr);
entryRouter.post("/scanEntryQr/:eventId/:activityId",scanEventQr)
module.exports = entryRouter;