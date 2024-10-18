const mongoose = require('mongoose')

const userRankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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