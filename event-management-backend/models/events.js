/**
 * @param {import('sequelize').Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns
 */
module.exports = (Sequelize, DataTypes) => {
    const Events = Sequelize.define("Event", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        valedate: {
          notEmpty: true,
        },
      },
      end: {
        type: DataTypes.DATE,
      },
      passCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        valedate: {
          notEmpty: true,
        },
        defaultValue: 1,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
        valedate: {
          notEmpty: true,
        },
        defaultValue: new Date(),
      },
      status: {
        type: DataTypes.ENUM("NOT STARTED", "ONGOING", "COMPLETED"),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        defaultValue: "NOT STARTED",
      }
    });
  
    Events.associate = (models) => {
      Events.hasMany(models.EventEntries, {
        foreignKey: "event",
        as: "EventEntries",
      });
  
      Events.hasMany(models.EventActivities, {
        foreignKey: "event",
        as: "EventActivities",
      });
    };
  
    return Events;
  };
  