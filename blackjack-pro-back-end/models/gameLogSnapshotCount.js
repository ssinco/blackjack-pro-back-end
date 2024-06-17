const mongoose = require('mongoose')

const gameLogSnapshotCountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    guessCount: {
        type: Number,
        required: true,
    },
    actualCount: {
        type: Number,
        required: true,
    },
    guessCountCorrect: {
        type: Boolean,
        required: true,
    },
    duration: {
        type:Number, // Stored in milliseconds
        required: true,
    },

}, {timestamps: true}
)

module.exports=mongoose.model('GameLogSnapshotCount', gameLogSnapshotCountSchema)