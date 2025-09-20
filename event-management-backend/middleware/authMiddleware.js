const jwt = require('jsonwebtoken');
const { CustomError } = require('../utils/Errors');
const { user } = require("../models");

async function verifyToken(req, res, next) {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            throw new CustomError("Access denied.", 401, "No token provided.")
        }
        try {
            let data = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("data",data)
            let User = await user.findOne({
                where: {
                  email: data.email,
                },
                raw: true,
              });
            req.user = User;
            next();
        } catch (e) {
            throw new CustomError("Login expired", 401, "Invalid or expired token")
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {verifyToken};