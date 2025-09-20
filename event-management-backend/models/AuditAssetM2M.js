const {DataTypes} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const AuditAssetM2M = sequelize.define("audit_asset_m2m", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        audit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        asset_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status:{
            type: DataTypes.ENUM("IN_USE", "IN_MAINTENANCE", "SCRAP", "IN_STOCK"),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        scannedBy : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                notEmpty : true
            }
        }
    });

    AuditAssetM2M.associate = (models)=>{
        AuditAssetM2M.belongsTo(models.Audit, {
            foreignKey: "audit_id",
            as: "audit" 
        });
        AuditAssetM2M.belongsTo(models.Asset, {
            foreignKey: "asset_id",
            as: "asset"
        });
    }

    return AuditAssetM2M;
}