require("dotenv").config();
const { getUserOtp, generateOtp, expireOtp, getLoggedInUser, checkLogin } = require("../services/authService");
const jwt = require('jsonwebtoken');
const { CustomError } = require("../utils/Errors");
const { sendMail } = require("../services/mailService");

async function sendOtp(req, res, next, retries = 2 ) {
    try {
        var email = req.body.email;
        if (!email) {
            throw new CustomError("Email is required", 400);
        }
        var otp = await generateOtp(email);
        try {
            await sendMail(email,"Your OTP Code",`${otp} is the OTP for Event Management app login. It is valid for 5 minutes.`);
            res.status(200).json({ message: "OTP generated successfully" });
        } catch (error) {
            expireOtp(email);
            if(retries > 0) {
                await sendOtp(req,res,next, retries-1);
            }
            else {
                throw new CustomError("Something went wrong", 500,error.message);
            }
        }
    } catch (error) {
        next(error);
    }
}

async function verifyOtp(req, res, next) {
    try {
        var { otp, email } = req.body;
        // if (!otp || !email) {
        //     throw new CustomError("OTP and Email are required", 400);
        // }
        // email = email.toLowerCase();

        // const orgOtp = await getUserOtp(email);
        // if (otp === orgOtp) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });
            // expireOtp(email);
        //     return res.status(200).json({ message: "User verified", token, user : await getLoggedInUser(email) });
        // } else {
        //     throw new CustomError("Invalid OTP", 400);
        // }
    } catch (error) {
        next(error);
    }
}

async function verifyToken(req,res,next) {
   try {
    let user = await getLoggedInUser(req.user.email);
    res.json(user);
   } catch (error) {
    next(error);
   }
}

async function login(req, res, next) {
    try {
        console.log(req.body)
        let user = await checkLogin(req.body.email,req.body.password);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    sendOtp,
    verifyOtp,
    verifyToken,
    login
}