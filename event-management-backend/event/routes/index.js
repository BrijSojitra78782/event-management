const { Router } = require("express");
const { verifyToken } = require("../../middleware/authMiddleware");
const eventRouter = require("./events");
const activityRouter = require("./activities");
const entryRouter = require("./entries");
const router = Router();

router.use("/event",verifyToken,eventRouter);
// router.use("/activity",verifyToken,activityRouter);
// router.use("/entry",verifyToken,entryRouter);

module.exports = router;
