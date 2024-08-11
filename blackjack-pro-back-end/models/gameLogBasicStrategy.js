const mongoose = require('mongoose')


const resultsSchema = new mongoose.Schema({
    dealerUpCard: { type: String, required: true },
    playerCards: { type: [String], required: true },
    userChoice: { type: String, required: true },
    optimalChoice: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  });
  


const gameLogBasicStrategySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    score: {
        type: Number, 
        required: true 
    },
    gameType: {
        type:String,
        required:true
    },
    resuts: [resultsSchema],
    endTime: { type: Date },        
    isActive: { type: Boolean, default: true },
}, {timestamps: true}
)


module.exports=mongoose.model('GameLogSingleCount', gameLogBasicStrategySchema)