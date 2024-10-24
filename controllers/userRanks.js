const express = require('express');
const router = express.Router();
const verifyToken = require ('../middleware/verify-token.js');

const GameLogSingleCount = require ('../models/gameLogSingleCount.js')
const GameLogSnapshotCount = require ('../models/gameLogSnapshotCount.js');
const GameLogBasicStrategy = require('../models/gameLogBasicStrategy.js');
const UserRank = require('../models/userRank.js');


router.use(verifyToken);

// Get all user rank data or create one if it doesn't exist
router.get('/', async (req, res) => {
    try {
        // Check if userRank exists
        let userRank = await UserRank.findOne({ user: req.user._id });

        if (!userRank) {
            console.log('No UserRank found. Creating a new one...');
            // Create a new userRank document
            userRank = await UserRank.create({ user: req.user._id });
            console.log('New UserRank created:', userRank);
        }

        res.status(200).json(userRank);
    } catch (err) {
        console.error('Error fetching or creating userRank:', err);
        res.status(500).json({ message: err.message });
    }
});


router.put('/update', async (req, res) => {
    console.log('reqbody', req.body)
    try {
        const { _id, setting } = req.body; // Expecting gameLog ID and setting from the request
        // Step 1: Add the new attempt to the progress array

        console.log('id', _id)
        console.log('setting', setting)
        let updatedUserRank = await UserRank.findOneAndUpdate(
            { user: req.user._id },
            {
                $push: {
                    'progress.basicStrategy.attempts': { _id, setting },
                },
            },
            { new: true, runValidators: true }
        );

        console.log(`Added new successful ${setting} attempt.`);

        // Step 2: Extract the settings from the progress attempts
        const settings = updatedUserRank.progress.basicStrategy.attempts.map((a) => a.setting);

        // Step 3: Update rankOne if 'hards' is complete
        if (settings.includes('hards') && !updatedUserRank.rankOne.challenges.basicStrategy) {
            await UserRank.findOneAndUpdate(
                { user: req.user._id },
                { $set: { 'rankOne.challenges.basicStrategy': true } },
                { new: true }
            );
            console.log('User completed Rank One basic strategy!');
        }

        // Step 4: Update rankTwo if 'hards', 'pairs', and 'softs' are complete
        const rankTwoSettingsCompleted = ['hards', 'pairs', 'softs'].every((s) =>
            settings.includes(s)
        );
        if (rankTwoSettingsCompleted && !updatedUserRank.rankTwo.challenges.basicStrategy) {
            await UserRank.findOneAndUpdate(
                { user: req.user._id },
                { $set: { 'rankTwo.challenges.basicStrategy': true } },
                { new: true }
            );
            console.log('User completed Rank Two basic strategy!');
        }

        // Step 5: Update rankThree if 'hards', 'pairs', 'softs', and 'random' are complete
        const rankThreeSettingsCompleted = ['hards', 'pairs', 'softs', 'random'].every((s) =>
            settings.includes(s)
        );
        if (rankThreeSettingsCompleted && !updatedUserRank.rankThree.challenges.basicStrategy) {
            await UserRank.findOneAndUpdate(
                { user: req.user._id },
                { $set: { 'rankThree.challenges.basicStrategy': true } },
                { new: true }
            );
            console.log('User completed Rank Three basic strategy!');
        }

        // Step 6: Return the updated user rank in the response
        updatedUserRank = await UserRank.findOne({ user: req.user._id });
        res.status(200).json(updatedUserRank);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;