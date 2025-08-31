import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';
import { signToken } from '../utils/jwt';

const router = Router();

type DoneFn = (error: any, user?: any) => void;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:4000/api/auth/google/callback',
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: DoneFn
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email: profile.emails?.[0]?.value });
          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              name: profile.displayName,
            });
          }
        }
        return done(null, { id: user._id });
      } catch (e) {
        return done(e as any);
      }
    }
  )
);

router.use(passport.initialize());

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/signin`,
  }),
  (req: any, res) => {
    const token = signToken({ userId: req.user.id }, '1d');
    const redirectUrl = `${
      process.env.CLIENT_ORIGIN || 'http://localhost:5173'
    }/oauth/callback?token=${token}`;
    res.redirect(redirectUrl);
  }
);

export default router;