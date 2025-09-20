const entryService = require("../services/entryService");

async function generateEventQr(req, res, next) {
    try {
        const qr = await entryService.generateQr(req.body, req.user);
        return res.json({ data: qr });
    } catch (e) {
        next(e);
    }
}

async function scanEventQr(req, res, next) {
    try {
        let { eventId, activityId } = req.params;
        const response = await entryService.scanQr(eventId, activityId, req.body, req.user);
        return res.json({ data: response });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    generateEventQr,
    scanEventQr
}