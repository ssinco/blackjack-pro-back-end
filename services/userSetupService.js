const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");

// services/userProgressService.js
const UserProgress = require('../models/userProgress');
const { challenges, version } = require('../config/challenges');

const userProgressSetup = async (userId) => {
    console.log(challenges)
  const userProgress = new UserProgress({
    user: userId,
    challengeVersion: version,
    rank: {
      currentRank: 0,
      challengesCompleted: { rankOne: false, rankTwo: false, rankThree: false },
      challengeDetails: challenges.map((challenge) => ({
        ...challenge,
        completed: false,
        completedAt: null
      }))
    }
  });

  await userProgress.save();
  return userProgress;
}

module.exports = { 
    userProgressSetup,
  };