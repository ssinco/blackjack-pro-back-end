const mongoose = require('mongoose');
const GameLogSingleCount = require('./gameLogSingleCount.js');
const GameLogBasicStrategy = require('./gameLogBasicStrategy.js');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  singleCount: {
    currentStreak: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameLogSingleCount' }],
    currentStreakMedianTime: { type: Number, default: null },  // ms
    bestStreak: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameLogSingleCount' }],
    bestStreakMedianTime: { type: Number, default: null },  // ms
    medianTime: { type: Number, default: null },  // median time for last 10 logs
    fastestTime: { type: Number, default: null },  // best time for all successful logs
  },
  basicStrategy: {
    hardsWin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameLogBasicStrategy' }],
    pairsWin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameLogBasicStrategy' }],
    softsWin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameLogBasicStrategy' }],
    randomWin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameLogBasicStrategy' }],
  },
  rank: {
    currentRank: { type: Number, default: 0 },  // Track the current rank
    challengesCompleted: {
      rankOne: { type: Boolean, default: false },
      rankTwo: { type: Boolean, default: false },
      rankThree: { type: Boolean, default: false },
    },
    challengeDetails: [
      {
        challengeId: Number,
        challengeVersion: Number,
        rank: Number,
        uid: String,
        description: String,
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
        deprecated: { type: Boolean, default: false },
      },
    ],
  },
  
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
