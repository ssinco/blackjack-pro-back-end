const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");

const GameLogSingleCount = require("../models/gameLogSingleCount.js");
const GameLogBasicStrategy = require("../models/gameLogBasicStrategy.js");
const UserProgress = require("../models/userProgress.js");

// Helper function to calculate the median
const calculateMedian = (arr) => {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
      ? sorted[mid] 
      : (sorted[mid - 1] + sorted[mid]) / 2;
};


const updateProgressSingleCount = async (userId) => {
    console.log('update single count progress function hit')
    try {
      // Fetch all valid game logs (exclude logs with duration 0)
      const gameLogs = await GameLogSingleCount.find({
          user: userId,
          duration: { $gt: 0 },
      }).sort({ createdAt: -1 }); // Most recent first

      if (gameLogs.length === 0) {
          console.log('No valid game logs found.');
          return; // Exit if no logs are found
      }

      // Calculate the **median time for the last 10 games**
      const durations = gameLogs.map(log => log.duration);
      const medianTime = calculateMedian(durations.slice(0, 10));

      // Calculate the fastest time from successful logs
      const successfulDurations = gameLogs
          .filter(log => log.guessCountCorrect && log.guessLastCardCorrect)
          .map(log => log.duration);
      const fastestTime = successfulDurations.length 
          ? Math.min(...successfulDurations) 
          : null;

      // Track the current and best streaks
      let currentStreak = [];
      let bestStreak = [];
      let tempCurrentStreak = [];

      for (let i = gameLogs.length - 1; i >= 0; i--) {
          const log = gameLogs[i];
          if (log.guessCountCorrect && log.guessLastCardCorrect) {
              tempCurrentStreak.push(log._id);

              // Update best streak if current streak is the longest
              if (tempCurrentStreak.length > bestStreak.length) {
                  bestStreak = [...tempCurrentStreak];
              }
          } else {
              tempCurrentStreak = [];
          }
      }

      // Set the final current streak
      currentStreak = [...tempCurrentStreak];

      // Update the user’s progress in the UserProgress collection
      let userProgress = await UserProgress.findOneAndUpdate(
          { user: userId },
          {
              $set: {
                  'singleCount.currentStreak': currentStreak,
                  'singleCount.bestStreak': bestStreak,
                  'singleCount.fastestTime': fastestTime,
                  'singleCount.medianTime': medianTime,
                  'singleCount.currentStreakMedianTime': calculateMedian(
                      currentStreak.map(id => gameLogs.find(log => log._id.equals(id)).duration)
                  ),
                  'singleCount.bestStreakMedianTime': calculateMedian(
                      bestStreak.map(id => gameLogs.find(log => log._id.equals(id)).duration)
                  ),
              },
          },
          { new: true }
      );

      console.log('User progress updated successfully!');

      // Check for challenges to update
      const completedChallenge = await checkAndUpdateChallenge(userProgress);
      // Check for an upgrade
      const rankInProgress = await checkAndUpdateRank(userProgress)

      return { userProgress, completedChallenge, rankInProgress }

  } catch (error) {
      console.error('Error updating user stats:', error);
      throw error; // Propagate the error to handle it in the route
  }
};

const updateProgressBasicStrategy= async (newLog, userId) => {
  try {
      const { _id, setting} = newLog // grab the id created for the bs game logged and the setting

      const updateField = `${setting}Win` // i.e. 'hardsWin'

      let userProgress = await UserProgress.findOne({user:userId}) // pull up the users current Progress

      console.log('userProgress in update progress serviecfuncion'. userProgress)
      // Check if a successful log exists. If no, then push game in
      if (userProgress.basicStrategy[updateField].length === 0) {
          userProgress.basicStrategy[updateField].push(_id);
      }


      // Check for challenges to update
      const completedChallenge = await checkAndUpdateChallenge(userProgress);

      // Check for an upgrade
      const rankInProgress = await checkAndUpdateRank(userProgress)

      return {userProgress, completedChallenge, rankInProgress}

  } catch (err) {
      res.status(500).json()
  }
  return
}

const checkAndUpdateRank = async (userProgress) => {
  let updated = false;
  let rankInProgress = userProgress.rank.currentRank;

  // Helper function to check if all challenges for a given rank are completed
  const areChallengesCompletedForRank = (rank) => {
    return userProgress.rank.challengeDetails
      .filter((challenge) => challenge.uid.includes(`-${rank}-`))
      .every((challenge) => challenge.completed);
  };

  // Track the highest rank achieved based on completed challenges
  let highestEligibleRank = rankInProgress;

  // Check if rank ONE challenges are completed
  if (areChallengesCompletedForRank(1) && !userProgress.rank.challengesCompleted.rankOne) {
    userProgress.rank.challengesCompleted.rankOne = true;
    highestEligibleRank = Math.max(highestEligibleRank, 1);
    updated = true;
  }

  // Check if rank TWO challenges are completed
  if (areChallengesCompletedForRank(2) && !userProgress.rank.challengesCompleted.rankTwo) {
    userProgress.rank.challengesCompleted.rankTwo = true;
    highestEligibleRank = Math.max(highestEligibleRank, 2);
    updated = true;
  }

  // Check if rank THREE challenges are completed
  if (areChallengesCompletedForRank(3) && !userProgress.rank.challengesCompleted.rankThree) {
    userProgress.rank.challengesCompleted.rankThree = true;
    highestEligibleRank = Math.max(highestEligibleRank, 3);
    updated = true;
  }

  // Update the current rank if it is lower than the highest eligible rank
  if (highestEligibleRank > userProgress.rank.currentRank) {
    userProgress.rank.currentRank = highestEligibleRank;
    updated = true;
  }

  // Save if there were updates
  if (updated) {
    await userProgress.save();
  }

  return {
    rankInProgress,
    updated,
  };
};




const checkAndUpdateChallenge = async (userProgress) => {
  let updated = false
  let completedChallenge = {}

  function markComplete(challenge) {
      challenge.completed = true;
      challenge.completedAt = new Date();
      updated = true;
      completedChallenge = challenge;
    }
  
  for (let challenge of userProgress.rank.challengeDetails) {
    // skip if the challenge is completed
    if (challenge.completed) continue

    // List of check completion conditions directly

    // rank 1
    if (challenge.uid === '0-1-1' && userProgress.singleCount.bestStreak.length > 0) {markComplete(challenge)}
    if (challenge.uid === '0-1-2' && userProgress.basicStrategy.hardsWin.length > 0) {markComplete(challenge)}

    // rank 2


    // for testing
    if (challenge.uid === '0-2-1' && userProgress.singleCount.bestStreak.length > 1) {markComplete(challenge)}
    // for deployment
    // if (challenge.uid === '0-2-1' && userProgress.singleCount.bestStreak.length >= 5) {markComplete(challenge)}
    if (challenge.uid === '0-2-2' && userProgress.basicStrategy.pairsWin.length > 0) {markComplete(challenge)}
    if (challenge.uid === '0-2-3' && userProgress.basicStrategy.softsWin.length > 0) {markComplete(challenge)}

    // rank 3

    // for testing
    if (challenge.uid === '0-3-1' && userProgress.singleCount.bestStreak.length > 2) {markComplete(challenge)}
    // for deployment
    // if (challenge.uid === '0-3-1' && userProgress.singleCount.bestStreak.length >= 10 && userProgress.singleCount.bestStreakMedianTime <= 120000) {markComplete(challenge)}
    if (challenge.uid === '0-3-2' && userProgress.basicStrategy.randomWin.length > 0) {markComplete(challenge)}
  }

  // Save if there were updates
  if (updated) {
    await userProgress.save();
  }

  return completedChallenge
}

module.exports = { 
  checkAndUpdateRank, 
  checkAndUpdateChallenge, 
  updateProgressBasicStrategy,
  updateProgressSingleCount,
};
