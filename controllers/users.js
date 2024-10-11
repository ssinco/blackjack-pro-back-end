const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');


const SALT_LENGTH = 12;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET; // Use a separate secret for reset tokens
const RESET_PASSWORD_EXPIRY = '1h'; // Token expiration time

// Mobile Google Auth client setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_IOS);


/* ================================================================
HANDLER FUNCTIONS
================================================================ */

// Mobile Google OAuth flow: Handles ID token sent from the mobile app
const handleMobileGoogleLogin = async (req, res) => {
  console.log('handleMobileGoogleLogin hit')
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID_IOS });
    const { email, sub } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ googleId: sub, email });
      await user.save();
    }
    // const jwtToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const jwtToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Error with mobile Google login:', error);
    res.status(400).json({ error: 'Google login failed' });
  }
};

/* ================================================================
ROUTES
================================================================ */


router.get('/signup', (req,res)=>{
    res.send('signup page')
})

router.get('/signin', (req,res)=>{
    res.send('signin page')
})

router.post('/signup', async (req, res) => {
    try {
        // Check for unique email
        const userByEmail = await User.findOne({ email: req.body.email });
        if (userByEmail) {
          if (userByEmail.googleId) {
              // User exists with Google OAuth; suggest signing in via Google
              return res.status(400).json({ error: 'This email is already associated with a Google account. Try signing in with Google!' });
          } else {
              // Email exists via traditional sign-up
              return res.status(400).json({ error: 'This email is already registered. Try signing in!' });
          }
      }

        // Create a new user with hashed password
        const user = await User.create({
            // username: req.body.username,
            email:req.body.email,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        const token = jwt.sign({
            // username: user.username,
            email: user.email,
            _id: user._id,
        }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        // const user = await User.findOne({ username: req.body.username });
        const user = await User.findOne({ email: req.body.email });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({
                // username: user.username,
                email:user.email,
                _id: user._id,
            }, process.env.JWT_SECRET);
            console.log(token);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to request password reset
router.post('/request-reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found.' });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ email: user.email, _id: user._id }, RESET_PASSWORD_SECRET, {
      expiresIn: RESET_PASSWORD_EXPIRY,
    });

    // Send the reset link via email (configure nodemailer properly)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/game/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
    });

    res.json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      // Verify the reset token
      const decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
      const user = await User.findOne({ _id: decoded._id, email: decoded.email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.hashedPassword = hashedPassword;
      await user.save();
  
      res.json({ message: 'Password has been successfully reset.' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Invalid or expired token.' });
    }
  });


// Google OAuth route (redirects to Google) for desktop
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/signin', session: false }), (req, res) => {
  const user = req.user.user || req.user; // Fallback in case it's structured differently
  console.log('google callback', user)

    // Log the payload you're about to sign
    const payload = {
      email: user.email,
      _id: user._id,
    };
    console.log('Payload for JWT:', payload); // Check that this is correct

  const token = jwt.sign({
    // username: user.username,
    email:user.email,
    _id: user._id,
}, process.env.JWT_SECRET);

  console.log('generatd jwt', token)

  // Redirect with the token in the URL hash (not query params)
  res.redirect(`${process.env.FRONTEND_URL}/game/oauth-complete#token=${token}`);
});


// Mobile route for Google login
router.post('/google-mobile', handleMobileGoogleLogin);


module.exports = router;