const express = require('express');
const router = express.Router();
const verifyToken = require ('../middleware/verify-token.js');

const GameLogSingleCount = require ('../models/gameLogSingleCount.js')
const GameLogSnapshotCount = require ('../models/gameLogSnapshotCount.js')





/*
=============== Routes for single deck count =============== */

router.use(verifyToken);

// Show all the records    
router.get('/count-single', async (req,res) => {
    console.log(req.user)
    try{
        const gameLogs = await GameLogSingleCount.find({
            user: req.user._id,
            duration: { $gt: 0 }  // Exclude records with a duration of 0
        });

        res.status(200).json(gameLogs)
    }catch(err){
        res.status(500).json({ message: err.message});
    }
})

// Create a record of a game
router.post('/count-single', async (req,res) => {
    try{
        req.body.user = req.user._id
        console.log('form submit is', req.body)
        console.log('userid is ', req.user._id)
        const newLog = await GameLogSingleCount.create(req.body)
        console.log(newLog)
        res.status(200).json(newLog)
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


/*
=============== Routes for snapshot count =============== */

// Show all the records    
router.get('/count-snapshot', async (req,res) => {
    try{
        const logs = await GameLogSnapshotCount .find({user: req.user._id})
        res.status(200).json(logs)
    }catch(err){
        res.status(500).json({ message: err.message});
    }
})

// Create a record of a game
router.post('/count-snapshot', async (req,res) => {
    try{
        req.body.user = req.user._id
        console.log('form submit is', req.body)
        console.log('userid is ', req.user._id)
        const newLog = await GameLogSnapshotCount .create(req.body)
        console.log(newLog)
        res.status(200).json(newLog)
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


// Edit a record
// Delete a record

// Routes for snapshot count


// Routes for blackjack game

module.exports = router;