"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const mailer_1 = require("../utils/mailer");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
// POST /api/auth/send-otp (signup or signin)
router.post('/send-otp', (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { email, name, dob } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    let user = await User_1.default.findOne({ email });
    if (!user)
        user = await User_1.default.create({ email, name, dob, otp, otpExpiry });
    else {
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        if (name)
            user.name = name;
        if (dob)
            user.dob = new Date(dob);
        await user.save();
    }
    try {
        await (0, mailer_1.sendOTP)(email, otp);
        res.json({ message: 'OTP sent' });
    }
    catch (e) {
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});
// POST /api/auth/verify-otp
router.post('/verify-otp', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { email, otp } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    const token = (0, jwt_1.signToken)({ userId: user._id }, '1d');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});
exports.default = router;
