require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require('morgan');

const db = require("./models");
const rootRouter = require("./routes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { CustomError } = require("./utils/Errors");
const Logger  = require("./utils/logger/logger");

const morganStream = {
  write: (message) => {
    const cleanMessage = message.replace(/\x1b\[[0-9;]*m/g, '');

    const statusCode = parseInt(cleanMessage.split(' ')[2]); // Extract the status code
    let logLevel;
    
    if(statusCode >= 200 && statusCode < 400){
      logLevel = 'info'; 
    }else if(statusCode >= 400){
      logLevel = 'error';
    } 

    Logger.log(logLevel,cleanMessage);
  }
};

morgan.token('user',(req)=>{
  if(req.user) return req.user.email;
  return 'unauth'
})

app.use(cors());
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :user",{ stream: morganStream}));
app.use(express.json());
app.use("/api", rootRouter);
app.use((req, res) => {
  throw new CustomError("Not Found", 404);
});
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    Logger.info("server started on " + PORT);
  });
}).catch((e)=>{
  Logger.error(e.message,e);
})

if (process.env.IS_DB_BACKUP_ENEBALED) {
  const cron = require("node-cron");
  const { executeBackup } = require("./scripts/dbBackup");
  // Runs at 12:00 AM Everyday
  cron.schedule("0 0 * * *", executeBackup);
}
