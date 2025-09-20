const {Router} = require('express');
const { sendOtp, verifyOtp, verifyToken : verify, login } = require('../controllers/auth');
const { verifyToken } = require('../middleware/authMiddleware');

const authRouter = Router();

authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.get("/verify-token", verifyToken, verify)
authRouter.post('/login',login);

module.exports = authRouter;