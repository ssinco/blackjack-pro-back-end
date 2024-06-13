/*
=============== SETUP =============== */

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')

/*
--------------- Controllers --------------- */
const usersRouter = require('./controllers/users.js')


/*
--------------- DB Setup --------------- */

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

/*
--------------- Middleware --------------- */
app.use(cors());
app.use(express.json());
// Insert the express.static for deployment



/*
=============== Routes =============== */

app.use('/users',usersRouter)

app.get('/', (req, res) => {
    res.send('this is the homepage from localhost 3000 backend')
  })

app.listen(process.env.PORT || 3000, () => {``
    console.log('The express app is ready!');
  });