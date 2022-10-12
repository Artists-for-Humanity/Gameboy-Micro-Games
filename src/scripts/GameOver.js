import eventsCenter from "./EventsCenter";
import gameDataBase from "./Database/GameDataBase";
const X = 1080;
const Y = 720;
export default class GameOver extends Phaser.Scene {
  // Game  Class Constructor
  gameData;

  constructor() {
    super({
      active: false,
      visible: false,
      key: "GameOver",
    });
    this.confirmKey;
    this.arrowButtons;
    this.HighScoreText;
    this.initials = [];
    this.active_letter = 0;
    this.sprite1;
    this.letterPos = 0;
    this.name = [];
    this.yesNoLetters = [
      [24, 4, 18],
      [13, 14],
    ];
    this.yesNoOptions = [];
    this.prompt1 = [];
    this.confirm = [2, 14, 13, 5, 8, 17, 12];
  }

  preload() {
    this.load.image(
      "go_bg",
      new URL("globalAssets/go_screen.png", import.meta.url).href
    );
    this.load.spritesheet(
      "alphaSheet",
      new URL("../scripts/Team Notateam/assets/alphaSheet.png", import.meta.url)
        .href,
      {
        frameHeight: 236,
        frameWidth: 209,
      }
    );
    this.load.image(
      "pointer",
      new URL("gameAssets/finger.png", import.meta.url).href
    );
  }

  create() {
    this.arrowButtons = this.input.keyboard.createCursorKeys();
    this.add.image(X / 2, Y / 2, "go_bg");
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.action = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.textObj2 = this.add.text(480, 400, "ENTER YOUR INITIALS", {
      fontSize: "32px",
      fontStyle: "bold",
      align: "center",
    });
    this.name[0] = this.add.sprite(600, 470, "alphaSheet").setScale(0.3);
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

    // if (this.initials.length === 3) {
    //   this.initials.push(this.globalState.score)
    //   if (this.globalState.names.length < 10) {
    //     this.globalState.names.push(this.initials)
    //     this.initials = [];
    //     console.log(this.globalState.names, "names");
    //     // location.reload();
    //   }
    // }
    this.updateText();
    // this.buttonHandlers.update();
    // if (!this.gamePad) {
    // this.startGamePad();}
  }

  updateText() {
    if (this.name[this.letterPos]) {
      this.name[this.letterPos].setFrame(this.active_letter);
    }
  }


  onUpInput() {
    if (this.active_letter < 25) {
      this.active_letter += 1;
    } else {
      this.active_letter = 0;
    }
  }
  onDownInput() {
    if (this.active_letter > 0) {
      this.active_letter -= 1;
    } else {
      this.active_letter = 25;
    }
  }
  onConfirmInput() {
    if (this.letterPos != 2) {
      this.letterPos++;
      this.name[this.letterPos] = this.add
        .sprite(600 + 60 * this.letterPos, 470, "alphaSheet")
        .setScale(0.3);
    } else {
      //filler code
      this.confirmNamePrompt();
    }
  }

  confirmNamePrompt() {
    for (let i = 0; i < this.confirm.length; i++) {
      this.prompt1[i] = this.add
        .image(70 + 15 * i, 350, "alphaSheet")
        .setFrame(this.confirm[i])
        .setScale(0.1);
    }

    for (let p = 0; p < 2; ) {
      for (let n = 0; n < this.yesNoLetters[p].length; n++) {
        this.yesNoOptions[p] = this.add
          .image(100 + (15 * n) + 60*p, 410, "alphaSheet")
          .setFrame(this.yesNoLetters[p][n]).setScale(.09)
        }
      p++;
    }

    console.log(this.yesNoOptions)
  }
}
//confirm cunfion{
// case switch
//      number 1 = yes{
//        push initials into names in global/databse
//      number 2{
//        delete
// }
// }
// }
