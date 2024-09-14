/*
=============== SETUP =============== */

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')

const PORT = process.env.PORT || 3001;


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

const corsOptions = {
  origin: isProduction ? 'https://your-production-frontend-url.com' : 'http://localhost:5173',
  credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());
// Insert the express.static for deployment


/*
=============== Routes =============== */

app.use('/users',usersRouter)
app.use('/game',gameLogsRouter)

app.get('/', (req, res) => {
    console.log('test')
    res.send('this is the homepage from localhost 3001 backend')
  })

app.listen(PORT, () => {``
    console.log(`Server is running on http://localhost:${PORT}`);
  });