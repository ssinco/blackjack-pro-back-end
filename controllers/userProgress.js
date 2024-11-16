const express = require('express');
const router = express.Router();
const verifyToken = require ('../middleware/verify-token.js');

const GameLogSingleCount = require ('../models/gameLogSingleCount.js')
const GameLogSnapshotCount = require ('../models/gameLogSnapshotCount.js');
const GameLogBasicStrategy = require('../models/gameLogBasicStrategy.js');
const UserProgress = require('../models/userProgress.js');

const { checkAndUpdateRank, updateProgressBasicStrategy, updateProgressSingleCount } = require('../services/rankService');
const { userProgressSetup } = require('../services/userSetupService');

router.use(verifyToken);

// GET all progress data. Create a document if none found
router.get('/', async (req,res) => {
    console.log('progress GET')
    try {
        let userProgress = await UserProgress.findOne({user: req.user._id,})

        // Create a new userProgress document if user doesnt have one already
        if (!userProgress) {
            console.log('No UserProgress found. Creating a new one...');
            
            // Create the new document
            userProgress = await userProgressSetup(req.user._id)
            // Update the progress with their single count data (if it exists)
            await updateProgressSingleCount(req.user._id)
            console.log('New UserProgress created:', userProgress);
        }
        console.log('progress of user', userProgress)
        return res.status(200).json(userProgress)
    } catch (err) {
        res.status(500).json()
    }
})

// router.put('/basic-strategy', async (req,res) => {
//     try {
//         const { _id, setting} = req.body // grab the id created for the bs game logged and the setting

//         const updateField = `${setting}Win` // i.e. 'hardsWin'

//         let userProgress = await UserProgress.findOne({user:req.user._id}) // pull up the users current Progress

//         // Check if a successful log exists. If no, then push game in
//         if (userProgress.basicStrategy[updateField].length === 0) {
//             userProgress.basicStrategy[updateField].push(_id);
//         }

//         // Check for an upgrade
//         const rankUpdated = await checkAndUpdateRank(userProgress)

//         res.status(400).json({userProgress, upgrade: rankUpdated});
//     } catch (err) {
//         res.status(500).json()
//     }
// })


// Update progress data for BS
    
    // store the successful attempt in basicStrategy.GAME

    // check for upgrade 


// router.put('/single-count', async (req,res) => {
//     try {
//         const { _id, setting} = req.body // grab the id created for the bs game logged and the setting

//         let userProgress = await UserProgress.findOne({user:req.user._id}) // pull up the users current Progress

//         // Check for an upgrade
//         const rankUpdated = await checkAndUpdateRank(userProgress)

//         res.status(400).json({userProgress, upgrade: rankUpdated});
//     } catch (err) {
//         res.status(500).json()
//     }
// })




module.exports = router;


