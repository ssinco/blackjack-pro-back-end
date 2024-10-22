const mongoose = require('mongoose')

const gameLogBasicStrategySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    playerScore: {
        type: Number, 
        required: true 
    },
    setting: {
        type:String,
        required:true
    },
    success: {
        type: Boolean,
        required: true
    },
    failScenario: {
        playerHand: {
            type: Number, // Players hand value
            required: function() { return !this.success; }, // Only required on failure
        },
        dealerUpcard: {
            type: Number, // Dealer’s upcard value (e.g., 2-11 with 11 representing Ace)
            required: function() { return !this.success; },
        },
        guess: {
            type: String, // Player's guessed action (e.g., 'Hit', 'Stand', 'Double')
            required: function() { return !this.success; },
        },
        correctAction: {
            type: String, // Correct action (e.g., 'Hit', 'Stand')
            required: function() { return !this.success; },
        },
    },
}, {timestamps: true}
)


module.exports=mongoose.model('GameLogBasicStrategy', gameLogBasicStrategySchema)