const { DATE } = require("sequelize");
const {
    Event,
} = require("../../models");
const { CustomError } = require("../../utils/Errors");
const { createQrSvg } = require("../utils/QrUtils");
const { addEventActivityEntry } = require("../utils/entriesUtil");
const { ALLOWED_EVENTS } = require("../constants");

async function generateQr(body, user) {
    var {
        eventType,
        userMail,
        name
    } = body;
    if (!(eventType in ALLOWED_EVENTS)) {
        new CustomError("Invalid event type", 400);
    }
    var event = await Event.findOne({
        where:
        {
            status: "ONGOING",
            name: {
                $regex: ALLOWED_EVENTS[eventType], $options: 'i'
            }
        }
    });
    if (event) {
        var eventId = event.id;
        if ((event.endDate && (new Date(event.endDate).now() > new Date().now())) || event.status === "ONGOING") {
            // verifyUser(userMail);
            const data = {
                email: userMail,
                name: name,
                event: eventId,
                eventDate: new Date(),
                source: "HRMS",
            }
            await addEventActivityEntry(data);
            return await createQrSvg(eventId, userMail);
        } else {
            new CustomError("Invalid request for a past event", 400);
        }
    } else {
        new CustomError("Invalid event Id", 400);
    }
}

async function scanQr(eventId, activityId, body, user) {
    
}
module.exports = {
    generateQr,
    scanQr
}