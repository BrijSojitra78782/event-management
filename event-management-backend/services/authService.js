const { PRIVATE_KEY } = require("../constant");
const { user } = require("../models");
const { CustomError } = require("../utils/Errors");
const crypto = require('crypto');

async function checkLogin(email,password) {
    password = Buffer.from(password, 'base64');
    var decryptedPassword = crypto.privateDecrypt(PRIVATE_KEY, password).toString();
}
async function getUserOtp(email) {
    const userOtp = await _findUser(email);
    if (userOtp) {
        const date = new Date();
        if (new Date(userOtp.generateDate) - date > 5 * 60 * 1000) {
            throw new CustomError("OTP expired!", 400);
        } else {
            return userOtp.otp;
        }
    }
    else {
        throw new CustomError("Unauthorized user", 401);
    }
}

async function generateOtp(email) {
    const userOtp = await _findUser(email);
    if (userOtp) {
        const date = new Date();
        if (date - new Date(userOtp.generateDate) > 5 * 60 * 1000) {
            const otp = _generateOtp();
            await user.update(
                {
                    otp: otp,
                    generateDate: date
                },
                {
                    where: {
                        email: email
                    }
                }
            );
            return otp;
        } else {
            return userOtp.otp;
        }
    } else {
        throw new CustomError("Unauthorized user", 401);
    }
}

async function expireOtp(email) {
    _validateEmail(email);
    email = email.toLowerCase();
    email = email.split('@')[0] + "@google.com";
    var date = new Date();
    date.setMinutes(date.getMinutes() - 10);
    await user.update(
        {
            otp: "000000",
            generateDate: date
        },
        {
            where: {
                email: email
            }
        }
    );

}
function _generateOtp() {
    var otp = '';
    for (var i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}

async function _findUser(email) {
    email = email.toLowerCase();
    _validateEmail(email);
    email = email.split('@')[0] + "@google.com";
    return await user.findOne(
        {
            attributes: ["otp", "generateDate"],
            where: {
                email: email
            },
            raw: true,
        })
}

function _validateEmail(email) {
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[0-9]*@(?:google\.com)$/;
    if(!emailRegex.test(email)) {
        throw new CustomError('Invalid email',400);
    }
}

async function getLoggedInUser(email){
    let userData = await user.findOne({
        where :{
            email : email
        },
        attributes : ['id','email','isAdmin']
    });
    if(!userData) {
        throw new CustomError("Invalid user",404);
    }
    return userData;
}

module.exports = {
    getUserOtp,
    generateOtp,
    expireOtp,
    getLoggedInUser,
    checkLogin
}