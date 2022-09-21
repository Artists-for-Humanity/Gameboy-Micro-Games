
import gameDataBase from "./Database/GameDataBase";
 let hsv = [];
 let i = 0;
 export default class HiScoreScene extends Phaser.Scene{
    gameData;
    names = [];
    scores = [];
    isPrinted = false;
    tintedTitle = null;
    tintedText = null;
    tintedScore = null;
    textObj1 = null;
    constructor(){
        super({
            key: 'HiScoreScene'
        });
    }
    preload(){
        this.load.image('HISCORE-BG', new URL ('../../assets/HSBG.png', import.meta.url).href);
    }
    create() {
        this.background = this.add.image(
          this.game.config.width / 2,
          this.game.config.height / 2,
          'background'
        );
    
        if (Phaser.Input.Keyboard.JustDown(this.action)) {
            location.reload();
        }
        hsv = Phaser.Display.Color.HSVColorWheel();
    
        this.gameData = gameDataBase.getTopScores();
    
        this.createLists();
        this.displayLists();
        this.resetLists();
    }
}