module.exports = (Sequelize, DataTypes) => {
  const EventActivities = Sequelize.define("EventActivities", {
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
    event: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  EventActivities.associate = (models) => {
    EventActivities.belongsTo(models.EventActivities, {
      foreignKey: "event",
      as: "EventActivities",
    });
  };

  EventActivities.associate = (models) => {
    EventActivities.hasMany(models.activitiesEntriesScanM2M, {
      foreignKey: "eventActivity",
      as: "activitiesEntriesScanM2M",
    });
  };

  return EventActivities;
};
