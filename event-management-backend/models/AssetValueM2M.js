const {DataTypes} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const AssetValueM2M = sequelize.define("assets_value_m2m", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        attribute_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        asset_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    AssetValueM2M.associate = (models) => {
        AssetValueM2M.belongsTo(models.Asset, {
            foreignKey: "asset_id", 
            as: "asset", 
        });

        AssetValueM2M.belongsTo(models.assets_attribute, {
            foreignKey: "attribute_id",
            as: "attribute"
        });
    }

    return AssetValueM2M;
}