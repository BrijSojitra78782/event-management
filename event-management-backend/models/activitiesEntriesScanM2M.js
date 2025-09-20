module.exports = (Sequelize, DataTypes) => {
    const activitiesEntriesScanM2M = Sequelize.define(
      "activitiesEntriesScanM2M",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        eventActivity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          valedate: {
            notEmpty: true,
          },
        },
        eventEntry: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        scannedBy: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        scannedTime: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      }
    );
  
    activitiesEntriesScanM2M.associate = (models) => {
      activitiesEntriesScanM2M.belongsTo(models.EventActivities, {
        foreignKey: "eventActivity",
        as: "activitiesEntriesScanM2M",
      });
    };
  
    activitiesEntriesScanM2M.associate = (models) => {
      activitiesEntriesScanM2M.belongsTo(models.EventEntries, {
        foreignKey: "eventEntry",
        as: "EventEntries",
      });
    };
  
    return activitiesEntriesScanM2M;
  };
   