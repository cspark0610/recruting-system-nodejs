import process from "process";
import User from "../../db/schemas/User.schema";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser((user: any, done: any) => {
	done(null, user.id);
});

passport.deserializeUser(async (userId: string, done: any) => {
	const user = await User.findById(userId);
	if (user) {
		return done(null, user);
	}
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			proxy: true,
		},
		async (accessToken: any, refreshToken: any, profile: any, done: any) => {
			const existingUser = await User.findOne({ google_id: profile.id });
			if (existingUser) {
				return done(null, existingUser);
			}
			const userBody = {
				google_id: profile.id,
				google_sign_in: true,
			};
			const newUser = await new User(userBody).save();

			done(null, newUser);
		}
	)
);
