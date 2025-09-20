const {
    EventEntries
} = require("../../models");
const { CustomError } = require("../../utils/Errors");

async function addEventActivityEntry(data) {
    try{
        var entry = await EventEntries.create(data);
    }
    catch(error) {
        new CustomError("error adding new entry for event", 500, error.message);
    }
}

module.exports = {
    addEventActivityEntry
}