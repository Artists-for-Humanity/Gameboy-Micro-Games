class GameDataBase{
    db;
    name;
    highscores;
    settings;
    leaderBoardLen;

    constructor(){
        this.db = localStorage;
        this.highscores = [];
        this.leaderBoardLen = 10;
        this.settings = {
          difficulty: 'easy',
        }; 
        if (this.db.getItem('highscores') === null) {
            this.db.setItem('highscores', JSON.stringify(this.highscores));
        }
        if (this.db.getItem('settings') === null) {
            this.db.setItem('settings', JSON.stringify(this.settings));
        }  
         
    }

}const gameDataBase = new GameDataBase();
export default gameDataBase;