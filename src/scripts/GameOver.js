import eventsCenter from './EventsCenter'
import gameDataBase from '../Database/GameDataBase';
const X = 1080
const Y = 720
export default class GameOver extends Phaser.Scene {

    // Game  Class Constructor
    gameData;
    
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'GameOver',
        });
    this.confirmKey;
    this.arrowButtons;
    this.HighScoreText;
    this.initials = [];
    this.active_letter = 0;
    this.letters = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
          ];
    }

    preload() {
        this.load.image('go_bg', new URL('globalAssets/go_screen.png', import.meta.url).href);
    }

    create() {
        this.arrowButtons = this.input.keyboard.createCursorKeys();
        this.add.image(X / 2, Y / 2, "go_bg");
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        this.action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.HighScoreText = this.add.text(this.game.config.width - 590, this.game.config.height - 325, (this.letters[this.active_letter]), {
            fontFamily: '',
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '',
            align: 'center',
          });
        // this.buttonHandlers.addKey(this.arrowButtons.down, () => this.onDownInput());
        // this.buttonHandlers.addKey(this.arrowButtons.up, () => this.onUpInput());
        // this.buttonHandlers.addKey(this.confirmKey, () => this.onConfirmInput());
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.up)) {
            this.onUpInput(); 
            }

        if (Phaser.Input.Keyboard.JustDown(this.action)) {
            this.onConfirmInput(); 
            }

        if (Phaser.Input.Keyboard.JustDown(this.down)) {
            this.onDownInput(); 
            }

        if (this.initials.length === 3) {
            gameDataBase.setScore(this.initials.join(''), this.globalState.score);
            this.globalState.resetScore();
            this.initials = [];
            location.reload();
        }
        this.updateText();
        // this.buttonHandlers.update();
        // if (!this.gamePad) {
        // this.startGamePad();}
    
    }

    updateText() {
        const initials = this.initials.join('') + this.letters[this.active_letter];
        if (this.HighScoreText) {
          this.HighScoreText.setText(`${initials}`);
        }
    }

    onUpInput() {
        if (this.active_letter < this.letters.length - 1) {
          this.active_letter += 1;
        } else {
          this.active_letter = 0;
        }
    }
    onDownInput() {
        if (this.active_letter > 0) {
          this.active_letter -= 1;
        } else {
          this.active_letter = this.letters.length - 1;
        }
    }
    onConfirmInput() {
        this.initials.push(this.letters[this.active_letter]);
    }
      
}
