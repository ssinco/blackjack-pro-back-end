// Function to calculate the best time
export function findBestTime(gameLogs) {
    if (!gameLogs) return null;
  
    const bestTimeLog = gameLogs
      .filter(log => log.duration > 0 && log.guessLastCardCorrect && log.guessCountCorrect)
      .sort((a, b) => a.duration - b.duration)[0];
  
    return bestTimeLog ? bestTimeLog.duration : null;
  }

// Function to calculate the best streak
export function findBestStreak(gameLogs) {
    if (!gameLogs) return 0;
  
    let currentStreak = 0;
    let maxStreak = 0;
  
    gameLogs.forEach(log => {
      if (log.guessLastCardCorrect && log.guessCountCorrect) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0; // Reset streak on incorrect guess
      }
    });
    return maxStreak;

}

export function findMedianTime(gameLogs) {
    if (!gameLogs || gameLogs.length === 0) return null;
  
    // Filter logs to extract durations of valid records
    const durations = gameLogs
      .filter(log => log.duration > 0 && log.guessLastCardCorrect && log.guessCountCorrect)
      .map(log => log.duration)
      .sort((a, b) => a - b);
  
    if (durations.length === 0) return null;
  
    const mid = Math.floor(durations.length / 2);
  
    // If the number of durations is odd, return the middle one. If even, return the average of the two middle ones.
    return durations.length % 2 !== 0
      ? durations[mid]
      : (durations[mid - 1] + durations[mid]) / 2;
  }