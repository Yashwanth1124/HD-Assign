import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { sendOTP } from '../utils/mailer';
import { signToken } from '../utils/jwt';

const router = Router();

// POST /api/auth/send-otp (signup or signin)
router.post('/send-otp',
  body('email').isEmail().withMessage('Valid email required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, name, dob } = req.body as { email: string, name?: string, dob?: string };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, name, dob, otp, otpExpiry });
    else { user.otp = otp; user.otpExpiry = otpExpiry; if (name) user.name = name; if (dob) user.dob = new Date(dob); await user.save(); }

    try {
      await sendOTP(email, otp);
      res.json({ message: 'OTP sent' });
    } catch (e) {
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  }
);

// POST /api/auth/verify-otp
router.post('/verify-otp',
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body as { email: string, otp: string };
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signToken({ userId: user._id }, '1d');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  }
);

export default router;