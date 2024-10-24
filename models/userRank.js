const mongoose = require('mongoose')

const userRankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    progress: {
        singleCount: {
            attempts: [
                { type: mongoose.Schema.Types.ObjectId, ref: 'GameLogSingleCount' }
            ], // Array of attempts from BasicStrategy model that meet progress criteria. Will not store all attempts
        },
        basicStrategy: {
            attempts: [
                {
                    gameLog: { type: mongoose.Schema.Types.ObjectId, ref: 'GameLogBasicStrategy' },
                    setting: { type: String, enum: ['hards', 'pairs', 'softs', 'random'], required: true },
                },
            ], // Array of attempts from BasicStrategy model that meet progress criteria. Will not store all attempts
        },
    },
    rankOne: {
        completed: {
            type: Boolean,
            default: false,
        },
        challenges: {
            singleCount: {
                type: Boolean,
                default: false,
            },
            basicStrategy: {
                type: Boolean,
                default: false,
            }
        }
    },
    rankTwo: {
        completed: {
            type: Boolean,
            default: false,
        },
        challenges: {
            singleCount: {
                type: Boolean,
                default: false,
            },
            basicStrategy: {
                type: Boolean,
                default: false,
            }
        }
    },
    rankThree: {
        completed: {
            type: Boolean,
            default: false,
        },
        challenges: {
            singleCount: {
                type: Boolean,
                default: false,
            },
            basicStrategy: {
                type: Boolean,
                default: false,
            }
        }
    },
    // You can easily add more levels in the future
});


module.exports=mongoose.model('userRank', userRankSchema)