const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const AssetTypeM2M = sequelize.define("assets_type_m2m", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
            autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type : DataTypes.TEXT('long')
    }
  });

  AssetTypeM2M.associate = (models) => {
    AssetTypeM2M.hasMany(models.Asset, {
            foreignKey: 'type',
            as: 'asset'
        })
    AssetTypeM2M.hasMany(models.assets_attribute, {
            foreignKey: 'type',
            as: 'assetAttributes'
        })
    } 

  return AssetTypeM2M;
}