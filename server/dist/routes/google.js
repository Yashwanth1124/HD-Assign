"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:4000/api/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await User_1.default.findOne({ googleId: profile.id });
        if (!user) {
            user = await User_1.default.findOne({ email: profile.emails?.[0]?.value });
            if (user) {
                user.googleId = profile.id;
                await user.save();
            }
            else {
                user = await User_1.default.create({
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                });
            }
        }
        return done(null, { id: user._id });
    }
    catch (e) {
        return done(e);
    }
}));
router.use(passport_1.default.initialize());
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/signin`,
}), (req, res) => {
    const token = (0, jwt_1.signToken)({ userId: req.user.id }, '1d');
    const redirectUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/oauth/callback?token=${token}`;
    res.redirect(redirectUrl);
});
exports.default = router;
