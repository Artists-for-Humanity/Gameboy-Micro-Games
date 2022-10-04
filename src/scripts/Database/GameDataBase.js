class GameDataBase {
  db;
  name;
  highscores;
  settings;
  leaderBoardLen;

  constructor() {
    this.db = localStorage;
    this.highscores = [];
    this.leaderBoardLen = 10;
    this.settings = {
      difficulty: "easy",
    };
    if (this.db.getItem("highscores") === null) {
      this.db.setItem("highscores", JSON.stringify(this.highscores));
    }
    if (this.db.getItem("settings") === null) {
      this.db.setItem("settings", JSON.stringify(this.settings));
    }
  }
  readScores() {
    return JSON.parse(localStorage.getItem("highscores"));
  }

  writeScores(highScores) {
    highScores.sort((a, b) => (a.score > b.score ? -1 : 1));
    const newHighScores = highScores.reduce((acc, score) => {
      if (acc.find((accScore) => accScore.name === score.name)) {
        return acc;
      }
      return [...acc, score];
    }, []);
    const slicedHighscores = newHighScores.slice(0, this.leaderBoardLen);
    this.db.setItem("highscores", JSON.stringify(slicedHighscores));
  }
  // setScore(playerName, playerScore) {
  //   if (!(typeof playerName === "string" && typeof playerScore === "number")) {
  //     console.error(
  //       "When setting highscore, the Username must be type of string, and score must be type of number"
  //     );
  //   }
  //   let highScores = this.readScores();
  //   // Conditions where the score should not be saved
  //   if (highScores.length > 0) {
  //     const lowestLeaderboardScore = highScores[highScores.length - 1];
  //     const existingScore = highScores.find(({ name }) => name === playerName);

  //     // 1) Current score must be higher than the database score of the user.
  //     if (existingScore && playerScore <= existingScore.score) {
  //       return;
  //     }

  //     // 2) If the user does not exist, and there are less than X total scores, and complies with previous
  //     if (playerScore < lowestLeaderboardScore) {
  //       return;
  //     }
  //   }
  //     highScores.push({
  //     name: playerName,
  //     score: playerScore,
  //   });
  //   this.writeScores(highScores);
  // }
  scoreIsHighScore(score) {
    // return true if greater than the lowest score
    const highScores = this.readScores();
    const lowestLeaderboardScore = highScores[highScores.length - 1];

    return score > lowestLeaderboardScore;
  }
  getTopScores() {
    const highScores = this.readScores();
    if (this.leaderBoardLen <= highScores.length) {
      return highScores.slice(0, this.leaderBoardLen);
    }
    return highScores;
  }
}
const gameDataBase = new GameDataBase();
export default gameDataBase;
