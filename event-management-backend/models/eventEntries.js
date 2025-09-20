module.exports = (Sequelize, DataTypes) => {
    const EventEntries = Sequelize.define("EventEntries", {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email_send: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      passcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      verifycount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      source: {
        type: DataTypes.ENUM("HRMS", "MANUAL", "EXCEL"),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        defaultValue: "EXCEL",
      },
    });
  
  
    // EventEntries.associate = (models) => {
    //   EventEntries.belongsTo(models.EventEntries, {
    //     foreignKey: "event",
    //     as: "EventEntries",
    //   });
    // };
  
    EventEntries.associate = (models) => {
      EventEntries.hasMany(models.activitiesEntriesScanM2M, {
        foreignKey: "eventEntry",
        as: "activitiesEntriesScanM2M",
      });
    };
  
    return EventEntries;
  };
  