const express = require('express');
const router = express.Router();
const verifyToken = require ('../middleware/verify-token.js');

const GameLogSingleCount = require ('../models/gameLogSingleCount.js')
const GameLogSnapshotCount = require ('../models/gameLogSnapshotCount.js');
const GameLogBasicStrategy = require('../models/gameLogBasicStrategy.js');

const { 
    updateProgressBasicStrategy, 
    updateProgressSingleCount,
} = require('../services/rankService.js');


router.use(verifyToken);

/* =============== Routes for single deck count =============== */


// Show all the records    
router.get('/count-single', async (req,res) => {
    console.log(req.user)
    try{
        const gameLogs = await GameLogSingleCount.find({
            user: req.user._id,
            duration: { $gt: 0 }  // Exclude records with a duration of 0
        });
        const lastTenLogs = gameLogs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
        res.status(200).json(lastTenLogs)
    }catch(err){
        res.status(500).json({ message: err.message});
    }
})

// Create a record of a game
router.post('/count-single', async (req,res) => {
    try{
        req.body.user = req.user._id
        const newLog = await GameLogSingleCount.create(req.body)
        console.log('New Log:', newLog);

        // Trigger stats update
        // const newStats = await updateUserStats(req.user._id);

        if (newLog.success) {
            const newUserProgress = await updateProgressSingleCount(req.user._id)
            return res.status(200).json({newLog, newUserProgress})
        }
        res.status(200).json(newLog)
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


/* =============== Routes for basic strategy =============== */


router.post('/basic-strategy', async (req,res) => {
    try {
        req.body.user = req.user._id
        const newLog = await GameLogBasicStrategy.create(req.body);
        console.log('New Log:', newLog);

        // If successful attempt, update user progress
        if (newLog.success) {
            console.log('new update progress conditional hit')
            const newUserProgress = await updateProgressBasicStrategy(newLog, req.user._id)
            return res.status(200).json({newLog, newUserProgress});
        }
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


/* =============== Routes for snapshot count =============== */

// Show all the records    
// router.get('/count-snapshot', async (req,res) => {
//     try{
//         const logs = await GameLogSnapshotCount .find({user: req.user._id})
//         res.status(200).json(logs)
//     }catch(err){
//         res.status(500).json({ message: err.message});
//     }
// })

// // Create a record of a game
// router.post('/count-snapshot', async (req,res) => {
//     try{
//         req.body.user = req.user._id
//         console.log('form submit is', req.body)
//         console.log('userid is ', req.user._id)
//         const newLog = await GameLogSnapshotCount .create(req.body)
//         console.log(newLog)
//         res.status(200).json(newLog)
//     }catch(err){
//         res.status(500).json({ message: err.message });
//     }
// })



module.exports = router;