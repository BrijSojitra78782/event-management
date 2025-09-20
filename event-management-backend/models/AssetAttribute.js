const {DataTypes} = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const AssetAttributes = Sequelize.define("assets_attribute", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        type:{
            type: DataTypes.INTEGER,
            allowNull: false,
            valedate:{
                notEmpty: false
            }
        },
        key:{
            type: DataTypes.STRING,
            allowNull: false,
            valedate:{
                notEmpty: false 
            }  
        }
    });

    AssetAttributes.associate = (models) => {
        // AssetAttributes.belongsTo(models.assets_type_m2m, {
        //     foreignKey: 'type', 
        //     as: 'assetType',
        //   });
        AssetAttributes.belongsTo(models.assets_type_m2m, {
            foreignKey: 'type',
            as: 'assetType'
        })
        AssetAttributes.hasMany(models.assets_value_m2m, { 
            foreignKey: 'attribute_id',
            as: 'assetValue'
        })
    }

    return AssetAttributes; 

}