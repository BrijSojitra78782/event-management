const { Router } = require("express");
const checkAdmin = require("../../middleware/checkAdmin");
const multer = require('multer');
const { getFilteredEvents, createEvent, editEvent, getEventSummary, uploadFile, generateQR, resendQR } = require("../controllers/events");
const cors = require("cors");


const eventRouter = Router();
eventRouter.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: storage });

// Add CORS middleware
eventRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

eventRouter.get("/events", getFilteredEvents);
eventRouter.post("/create", checkAdmin, createEvent);
eventRouter.post("/uploadfile", upload.single('file'), uploadFile);
eventRouter.get("/sendqr", generateQR);
eventRouter.get("/resendqr", resendQR);
// eventRouter.post("/:eventId/edit", checkAdmin, editEvent);
// eventRouter.post("/:eventId/delete", checkAdmin, deleteEvent);
// eventRouter.get("/:event/summary", getEventSummary);

module.exports = eventRouter;


