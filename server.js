/*
=============== SETUP =============== */

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const passport = require('passport');

const PORT = process.env.PORT || 3001;

// Load Passport config
require('./config/passport');


/*
--------------- Controllers --------------- */
const usersRouter = require('./controllers/users.js')
const gameLogsRouter = require('./controllers/gameLogs.js')

/*
--------------- DB Setup --------------- */

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

/*
--------------- Middleware --------------- */
const isProduction = process.env.NODE_ENV === 'production';

// List of allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Development frontend URL
  'https://www.blackjackpro.io',
  'https://blackjackpro.io',
  'http://www.blackjackpro.io',
  'http://blackjackpro.io',
  'capacitor://localhost',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the allowed origins list
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));


app.use(express.json());
// Insert the express.static for deployment

// Initialize Passport (for Google OAuth)
app.use(passport.initialize());



/*
=============== Routes =============== */

app.use('/users',usersRouter)
app.use('/game',gameLogsRouter)

app.get('/', (req, res) => {
    console.log('test')
    res.send('this is the homepage from localhost 3001 backend')
  })

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });