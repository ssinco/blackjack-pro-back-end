const express = require('express');
const router = express.Router();
const verifyToken = require ('../middleware/verify-token.js');

const GameLogSingleCount = require ('../models/gameLogSingleCount.js')
const GameLogSnapshotCount = require ('../models/gameLogSnapshotCount.js');
const GameLogBasicStrategy = require('../models/gameLogBasicStrategy.js');
const UserRank = require('../models/userRank.js');


router.use(verifyToken);

// get all user rank data
router.get('/', async (req,res) => {
    try{
        const rankData = await UserRank.findOne({user:req.user._id})
        console.log('rankData', rankData)
        res.status(200).json(rankData)
    } catch(err) {
        res.status(500).json({ message: err.message});
    }
})

router.put('/update', async (req,res) => {
    const { rank, field, value } = req.body
    try {
        const userId = req.user._id
        const updatePath = `${rank}.${field}`

        const updatedUserRank = await UserRank.findOneAndUpdate(
            { user: userId},
            { $set: { [ updatePath ]: value }},
            { new: true, runValidators: true },
        )
        if (!updatedUserRank) {
            return res.status(404).json({ error: 'UserRank not found' });
        }

        res.status(200).json(updatedUserRank);

    } catch(err) {
        res.status(500).json({ message: err.message});
    }
})

// create user rank data
// router.post('/new', async (req,res) => {

// })

// update user rank data



module.exports = router;