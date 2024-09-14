const mongoose = require('mongoose')

const gameLogSingleCountSchema = new mongoose.Schema({
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
    guessLastCardRange: {
        type: String,
        required: true,
    },
    actualLastCard: {
        type: Object,
        required: true,
    },
    guessCountCorrect: {
        type: Boolean,
        required: true,
    },
    guessLastCardCorrect: {
        type: Boolean,
        required: true,
    },
    duration: {
        type:Number, // Stored in milliseconds
        required: true,
    },

}, {timestamps: true}
)

module.exports=mongoose.model('GameLogSingleCount', gameLogSingleCountSchema)