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
    },
    guessLastCardRange: {
        type: String,
    },
    actualLastCard: {
        type: Object,
    },
    guessCountCorrect: {
        type: Boolean,
    },
    guessLastCardCorrect: {
        type: Boolean,
    },
    duration: {
        type:Number, // Stored in milliseconds
    },

}, {timestamps: true}
)

module.exports=mongoose.model('GameLogSingleCount', gameLogSingleCountSchema)