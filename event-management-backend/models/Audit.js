const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Audit = sequelize.define("Audit", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      defaultValue: "PENDING",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING
    },
    createdBy : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
          notEmpty : true
      }
    },
    submittedBy : {
      type : DataTypes.STRING,
    }
  });

  Audit.associate = (models) => {
    // Audit.hasMany(models.audit_asset_m2m,{ foreignKey: "audit_id", as: 'audits' });
    Audit.hasMany(models.audit_asset_m2m, {
      foreignKey: "audit_id",
      as: "audits",
    });
  };

  return Audit;
};
