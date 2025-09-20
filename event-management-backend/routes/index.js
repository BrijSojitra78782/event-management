const { Router } = require("express");
const auditRouter = require("./auditRoute");
const eventRouter = require("../event/routes/index");
const authRouter = require("./auth");
const rootRouter = Router();

rootRouter.use("/auth",authRouter);
rootRouter.use("/event",eventRouter);
rootRouter.use("/audit",auditRouter);
module.exports = rootRouter;
