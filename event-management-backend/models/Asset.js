const { DataTypes } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Asset = sequelize.define("Asset", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uniqueId: {
            type: DataTypes.UUID,
            unique : true,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        floor: {
            type: DataTypes.INTEGER,
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
       
        status: {
            type: DataTypes.ENUM("IN_USE", "IN_MAINTENANCE", "SCRAP", "IN_STOCK"),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            defaultValue: "IN_STOCK",
        }, 

        createdBy : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                notEmpty : true
            }
        }
        
    });

    Asset.associate = (models) => {
        Asset.belongsTo(models.assets_type_m2m, { foreignKey: "type", as: 'assetType' });
        Asset.hasMany(models.assets_value_m2m, { foreignKey: "asset_id", as: 'assetValues' });
        Asset.hasMany(models.audit_asset_m2m,{ foreignKey: "asset_id", as: 'audits' }); 
    }

    return Asset;
} 
