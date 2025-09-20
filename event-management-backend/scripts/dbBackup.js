const mysqldump = require("mysqldump");
const fs = require("fs");
const path = require("path");
const {exec} = require("child_process");
const Logger = require("../utils/logger/logger");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const LOCAL_BACKUP_DIR = process.env.LOCAL_BACKUP_DIR;
const MAX_BACKUPS = process.env.MAX_BACKUP;

if (!fs.existsSync(LOCAL_BACKUP_DIR)) {
  fs.mkdirSync(LOCAL_BACKUP_DIR, { recursive: true });
}

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(LOCAL_BACKUP_DIR, `backup-${timestamp}.sql`);

  await mysqldump({
    connection: DB_CONFIG,
    dumpToFile: backupFile,
  });

  return backupFile;
}

async function transferBackupToRemote(filePath) {
  const scpCommand = `sshpass -p ${process.env.BACKUP_VM_PASS} scp ${filePath} ${process.env.BACKUP_VM_DIRICTORY_PATH}`;
  exec(scpCommand, (error, stdout, stderr) => {
    if (error) {
      Logger.error(`Backup_VM: Error copying ${filePath} : ${error.message}`,error);
      return;
    }
    Logger.error(`Backup_VM: stderr: Error copying ${filePath}: ${stderr}`);
    Logger.info(`Backup_VM: stdout: ${stdout}`);
    Logger.info(`Backup_VM: File ${filePath} copied successfully.`);
  });
}

function cleanOldBackups() {
  const files = fs
    .readdirSync(LOCAL_BACKUP_DIR)
    .filter((file) => file.startsWith("backup-") && file.endsWith(".sql"))
    .map((file) => ({ file, time: fs.statSync(path.join(LOCAL_BACKUP_DIR, file)).mtime }))
    .sort((a, b) => b.time - a.time);

  if (files.length > MAX_BACKUPS) {
    const oldFiles = files.slice(MAX_BACKUPS);
    oldFiles.forEach(({ file }) => {
      Logger.info(`Removed the ${file} from main server`);
      fs.unlinkSync(path.join(LOCAL_BACKUP_DIR, file));
    });
  }
}

async function executeBackup() {
  try {
    Logger.info("Backup process started");
    const backupFile = await createBackup();
    await transferBackupToRemote(backupFile);
    cleanOldBackups();
  } catch (error) {
    Logger.error("Backup Process Failed:",error)
  }
}

module.exports = {
  executeBackup
};
