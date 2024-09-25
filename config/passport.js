const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Import User model
const jwt = require('jsonwebtoken');

// Serialize user for session (this is optional, needed only if using sessions)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (token, tokenSecret, profile, done) => {
    try {
        // Check if a user with this email already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
            // If the user exists but doesn't have a googleId, link it
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
        } else {
            // If the user doesn't exist, create a new one with googleId
            user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                displayName: profile.displayName,
            });
            await user.save();
        }

        // Generate a JWT token for the user
        const jwtToken = jwt.sign({
            _id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Pass the JWT token with the user information
        done(null, { user, jwtToken });
    } catch (err) {
        done(err, null);
    }
}));
