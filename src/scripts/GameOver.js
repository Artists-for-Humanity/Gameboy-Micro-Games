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
    this.pointerPos = 0;
    this.promptPrinted = false;
    this.bobberTimer = 0;
    this.bobDir = false;
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
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
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
    if (this.pointer) {
      this.pointerStuff();
      this.bouyantMotion(this.pointer, 0.8, 4);
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
    }
    
    if (this.pointer) { 
      switch (this.pointerPos) {
        case 0: //push data into array or something
          console.log("yes option");
          // location.reload(); 
          break;
        case 1: // Scores
          console.log("no");
          this.clearArray(this.prompt1);
          console.log(this.yesNoOptions)
        // this.promptPrinted = false;
        default:
          break;
      }
    }
    if (this.name.length === 3 && !this.pointer) {
      this.confirmNamePrompt(); 
    }
  }
  clearArray(array){
    for (let i = 0; i < array.length; i++) {
      array[i].destroy();
    }
    array = [];
  }
  confirmNamePrompt() {
    for (let i = 0; i < this.confirm.length; i++) {
      this.prompt1[i] = this.add
        .image(200 + 20 * i, 420, "alphaSheet")
        .setFrame(this.confirm[i])
        .setScale(0.1);
    }

    for (let p = 0; p < 2; ) {
      for (let n = 0; n < this.yesNoLetters[p].length; n++) {
        this.yesNoOptions[p] = this.add
          .image(100 + 50 * n + 200 * p, 475, "alphaSheet")
          .setFrame(this.yesNoLetters[p][n])
          .setScale(0.3);
      }
      p++;
    }
    if (this.promptPrinted === false) {
      this.pointer = this.add
        .image(150, 390, "pointer")
        .setRotation(Math.PI / 2);
      this.promptPrinted = true;
    }
  }
  pointerStuff() {
    this.updatePointer();
    if (Phaser.Input.Keyboard.JustDown(this.left)) {
      this.pointerPos === 0
        ? (this.pointerPos = this.yesNoOptions.length - 1)
        : this.pointerPos--;
    }
    if (Phaser.Input.Keyboard.JustDown(this.right)) {
      this.pointerPos === this.yesNoOptions.length - 1
        ? (this.pointerPos = 0)
        : this.pointerPos++;
    }
  }
  updatePointer() {
    this.pointer.x = 150 + 150 * this.pointerPos;
  }

  bouyantMotion(obj, amount, speed) {
    this.bobberTimer += speed;
    if (this.bobberTimer % 100 === 0) {
      this.bobDir = !this.bobDir;
    }
    this.bobDir ? (obj.y += amount) : (obj.y -= amount);
  }
}
