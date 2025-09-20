const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "000000",
            validate: {
                notEmpty: true,
            },
        },
        generateDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date('2024-01-01T00:00:00Z'),
            validate: {
                notEmpty: true,
            },
        },
        isAdmin :{
            type : DataTypes.BOOLEAN,
            default : false
        }, 
        createdBy : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                notEmpty : true
            }
        }
    });

    return User;
}