import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            if (!profile.emails || !profile.emails[0]?.value) {
                return done(new Error("No email found in Google profile"));
            }

            const email = profile.emails[0].value;

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    email,
                    fullnamename: profile.displayName,
                    socialProvider: "google",
                    socialId: profile.id
                });
            } else if (!user.socialProvider) {
                user.socialProvider = "google";
                user.socialId = profile.id;
                await user.save();
            }

            return done(null, {
                userId: user._id.toString(),
                fullname: user.fullname,
                email: user.email,
                role: user.role
            });
        }
    )
);

export default passport;
