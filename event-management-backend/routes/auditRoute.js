const { Router } = require("express");
const auditRouter = require("./audit");
const assetRouter = require("./asset");
const assetTypeRouter = require("./assetType");
const { verifyToken } = require("../middleware/authMiddleware");
const userRouter = require("./user");

const auditRoute = Router();

auditRoute.use("/audit", verifyToken, auditRouter);
auditRoute.use("/asset", verifyToken, assetRouter);
auditRoute.use("/category", verifyToken, assetTypeRouter);
auditRoute.use("/user", verifyToken, userRouter);
module.exports = auditRoute;