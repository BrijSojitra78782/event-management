const eventService = require("../services/eventService");
const { generateAllEventEntriesQR } = require("../../services/eventService");

async function getFilteredEvents(req, res, next) {
  try {
    const events = await eventService.getEvents(req.query);
    return res.json({data : events});
  } catch (e) {
    next(e);
  }
}

/**
*
* @param {Request} req
* @param {Response} res
*/
async function createEvent(req, res, next) {
  try {
    const event = await eventService.createEvent(req.body, req.user.email);
    return res.json({ data: event });
  } catch (e) {
    next(e);
  }
}

async function editEvent(req, res, next) {
  try {
    const event = await eventService.editEvent(req.body, req.user.email);
    return res.json({ data: event });
  } catch (e) {
    next(e);
  }
}

async function getEventSummary(req, res, next) {
  try {
    const event = await eventService.getEventSummary(req.body, req.user.email);
    return res.json({ data: event });
  } catch (e) {
    next(e);
  }
}

async function uploadFile(req, res, next) {
  try {
    // Ensure multer is used in the route and req.file is available
    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: "No file uploaded or file path missing" });
    }
    await eventService.fileUpload(req.file.path);
    res.json({ message: 'Upload complete' });
  } catch (e) {
    next(e);
  }
}

async function generateQR(req, res, next) {
  try {
    let message = await generateAllEventEntriesQR();
    res.json({message: message})
  } catch (error) {
    Logger.error("Error while generating qr for all assets " + error.message, error);
  }
}

async function resendQR(req, res, next) {
  try {
    let message = await generateAllEventEntriesQR(true);
    res.json({message: message})
  } catch (error) {
    Logger.error("Error while generating qr for all assets " + error.message, error);
  }
}

module.exports = {
  getFilteredEvents,
  createEvent,
  editEvent,
  getEventSummary,
  uploadFile,
  generateQR,
  resendQR
}