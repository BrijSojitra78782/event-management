'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
config.logging = false;
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log()
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


//for authentication to the db in remote server
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('DB Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

/**
 * Loads all models in the current directory and associates them
 * with the Sequelize instance.
 *
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The Sequelize data types.
 */
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

/**
 * Calls the associate method on all models if it exists.
 */
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}); 

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
