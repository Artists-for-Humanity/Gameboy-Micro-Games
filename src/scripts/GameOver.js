import eventsCenter from "./EventsCenter";
import gameDataBase from "./Database/GameDataBase";
import ButtonPressHandlers from './ButtonPressHandlers';
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
    
  }

  preload() {
    this.setGameOver();
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
    console.log(this.globalState.scores);
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
    this.pointer = this.add
      .image(150, 350, "pointer")
      .setRotation(Math.PI / 2);
    this.pointer.visible = false;
    this.name[0] = this.add.sprite(600, 470, "alphaSheet").setScale(0.3);
    // this.buttonHandlers.addKey(this.arrowButtons.down, () => this.onDownInput());
    // this.buttonHandlers.addKey(this.arrowButtons.up, () => this.onUpInput());
    // this.buttonHandlers.addKey(this.confirmKey, () => this.onConfirmInput());
  }

  update() {
    this.buttonHandlers.update();
    if (!this.gamePad) {
      // console.log("yes");
      this.startGamePad();
    }
    this.buttonHandlers.update();
    console.log(this.globalState.names.length);

    if (this.globalState.names.length === 3) {
      gameDataBase.setScore(this.globalState.names, this.globalState.scores);
      this.globalState.resetScore();
      this.globalState.names = [];
      // this.scene.start('MainMenu');
    }

    this.updateText();
  }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.5, () => this.checkInput(1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.5, () => this.checkInput(0));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.checkInput(3));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.checkInput(2));
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => this.checkInput(4));
  }

  updateText() {
    if (this.name[this.letterPos]) {
      this.name[this.letterPos].setFrame(this.active_letter);
    }
  }
  checkInput(x) {
    if (x === 1) {
      this.onDownInput();
    }

    if (x === 0) {
      this.onUpInput();
    }
    if (x === 4) {
      if (this.count < 3) {
        this.globalState.names.push(this.active_letter);
      }
      this.onConfirmInput();
      this.count++;
      console.log(this.globalState.names);
      if (this.count > 2 && this.pointer.visible === false) {
        this.confirmNamePrompt();
      }
    }
    if (this.pointer.visible === true) {
      this.bouyantMotion(this.pointer, 0.8, 4);
      if (x === 3) {
        this.pointerStuff(1);
      }
      if (x === 2) {
        this.pointerStuff(0);
      }
    }

  }
  onDownInput() {
    if (this.count < 3) {
      // console.log(this.active_letter);
      if (this.active_letter < 25) {
        this.active_letter += 1;
      } else {
        this.active_letter = 0;
      }
    }
  }
  onUpInput() {
    if (this.count < 3) {
      // console.log(this.active_letter);
      if (this.active_letter > 0) {
        this.active_letter -= 1;
      } else {
        this.active_letter = 25;
      }
    }
  }
  onConfirmInput() {
    if (this.letterPos < 2) {
      this.active_letter = 0;
      this.letterPos++;
      this.name[this.letterPos] = this.add
        .sprite(600 + 60 * this.letterPos, 470, "alphaSheet")
        .setScale(0.3);
    }

    if (this.pointer.visible === true) {
      switch (this.pointerPos) {
        case 0: // Scores
          console.log("no");
          this.scene.restart();
          this.pointerPos = 1;
          this.active_letter = 0;
          this.letterPos = 0;
          this.count = -1;
          this.pointer.visible = false;
          this.pointer.y = 350;
          this.clearArray(this.prompt1);
          this.promptPrinted = false;
        default:
          break;
        case 1: 
          this.scene.start('HiScoreScene');
          break;
      }
    }
  }
  clearArray(array) {
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

    for (let p = 0; p < 2;) {
      for (let n = 0; n < this.yesNoLetters[p].length; n++) {
        this.yesNoOptions[p] = this.add
          .image(100 + 50 * n + 200 * p, 475, "alphaSheet")
          .setFrame(this.yesNoLetters[p][n])
          .setScale(0.3);
      }
      p++;
    }
    if (this.promptPrinted === false) {
      this.pointer.visible = true;
      this.promptPrinted = true;
    }
  }
  pointerStuff(y) {
    this.updatePointer();
    if (y === 1) {
      this.pointerPos === 0
        ? (this.pointerPos = this.yesNoOptions.length - 1)
        : this.pointerPos--;
      console.log(this.pointerPos);
    }
    if (y === 0) {
      this.pointerPos === this.yesNoOptions.length - 1
        ? (this.pointerPos = 0)
        : this.pointerPos++;
      console.log(this.pointerPos);
    }
  }
  updatePointer() {
    this.pointer.x = 150 + 150 * this.pointerPos;
  }
  setGameOver(){
    this.confirmKey;
    this.arrowButtons;
    this.HighScoreText;
    this.initials = [];
    this.active_letter = 0;
    this.sprite1;
    this.letterPos = 0;
    this.count = 0;
    this.name = [];
    this.temp = [];
    this.yesNoLetters = [
      [24, 4, 18],
      [13, 14],
    ];
    this.yesNoOptions = [];
    this.prompt1 = [];
    this.confirm = [2, 14, 13, 5, 8, 17, 12];
    this.pointerPos = 1;
    this.promptPrinted = false;
    this.bobberTimer = 0;
    this.bobDir = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  bouyantMotion(obj, amount, speed) {
    this.bobberTimer += speed;
    if (this.bobberTimer % 100 === 0) {
      this.bobDir = !this.bobDir;
    }
    this.bobDir ? (obj.y += amount) : (obj.y -= amount);
  }
}
