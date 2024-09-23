const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const SALT_LENGTH = 12;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET; // Use a separate secret for reset tokens
const RESET_PASSWORD_EXPIRY = '1h'; // Token expiration time


router.get('/signup', (req,res)=>{
    res.send('signup page')
})

router.get('/signin', (req,res)=>{
    res.send('signin page')
})

router.post('/signup', async (req, res) => {
    try {
        // Check if the username is already taken
        // const userInDatabase = await User.findOne({ username: req.body.username });
        // if (userInDatabase) {
        //     return res.json({ error: 'Username already taken.' });
        // }

        // Check for unique email
        const userByEmail = await User.findOne({ email: req.body.email });
        if (userByEmail) {
            return res.status(400).json({ error: 'This email already has an account. Try signing in!' });
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
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

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

module.exports = router;