const { Op, Sequelize } = require("sequelize");
const {
 Event,
 EventEntries
} = require("../../models");
const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

async function getEvents(params) {
  const {
   filter = "",
   orderBy = "eventDate",
   order = "DESC",
  } = params;
  const eventsData = await Event.findAll({
    attributes: ["id", "name", "eventDate"],
    order: [[orderBy, order]],
    where: {
     name: {
      [Op.like]: `%${filter}%`,
     },
    },
    raw: true,
   });
   let eventList = [];
   eventsData.forEach((event) => {
      if(event.name.toLowerCase().includes("birthday")) {
        eventList.unshift(event);
      } else eventList.push(event);
   });
  return eventList;
}

async function createEvent(body, userEmail) {
  const { name, end, passcount, eventDate } = body;
  const newEvent = await Event.create({
    name: name,
    end: end,
    passcount: passcount,
    createdBy: userEmail,
    eventDate: eventDate,
    status: "NOT STARTED",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return newEvent;
}

async function editEvent(data, userEmail) {
  const { id, name, eventDate } = data;
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error("Event not found");
  }
  event.name = name || event.name;
  event.eventDate = eventDate || event.eventDate;
  event.updatedBy = userEmail;
  await event.save();
  return event;
}

async function fileUpload(filePath) {
 return new Promise((resolve, reject) => {
  const rows = [];
  fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => {
    const passcount = parseInt(data.passcount) || 1;
    for (let i = 0; i < passcount; i++) {
      rows.push({
        id: uuidv4(),
        name: data.name,
        email: data.email,
        passcount: data.passcount
      });
    }
  })
  .on('end', async () => {
   try {
    await EventEntries.destroy({ where: {} });
    await EventEntries.bulkCreate(rows);
    resolve({ message: `Inserted ${rows.length} records into MySQL.` });
   } catch (err) {
    console.error('Insert error:', err);
    reject(err);
    
   }
  })
  .on('error', (err) => {
   console.error('CSV parse error:', err);
   reject(err);
  });
 });
}

module.exports = {
  getEvents,
  createEvent,
  editEvent,
  fileUpload
}