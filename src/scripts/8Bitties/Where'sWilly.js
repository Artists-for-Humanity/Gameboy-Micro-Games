import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from "../ButtonPressHandlers";
export default class WhereisWilly extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "WhereisWilly",
    });
    this.victory = false;
    this.gameOver = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
    this.finger;
    this.bricks;
    this.field;
    this.started = false;
    this.suspects = 7;
    this.wantedNum = 0;
    this.wanted;
    this.correct;
    this.suspectArray = [];
  }
  preload() {
    this.load.image(
      "8B6_finger",
      new URL("../8Bitties/assets/Where'sWilly/Clicker.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B6_wall",
      new URL(
        "../8Bitties/assets/Where'sWilly/Brick_Wall_Small.png",
        import.meta.url
      ).href
    );
    this.load.image(
      "8B6_field",
      new URL(
        "../8Bitties/assets/Where'sWilly/Black_Screen_BG_Small.png",
        import.meta.url
      ).href
    );
    this.load.spritesheet(
      "8B6_Posters",
      new URL(
        "../8Bitties/assets/Where'sWilly/Wanted_Posters.png",
        import.meta.url
      ).href,
      {
        frameWidth: 550,
        frameHeight: 726,
      }
    );
    this.load.spritesheet(
      "8B6_Heads",
      new URL(
        "../8Bitties/assets/Where'sWilly/Willy_Heads.png",
        import.meta.url
      ).href,
      {
        frameWidth: 264,
        frameHeight: 235,
      }
    );
  }
  create() {
    this.bricks = this.add.image(540, 360, "8B6_wall");
    this.field = this.add.image(540, 360, "8B6_field");
    this.finger = this.physics.add.image(540, 360, "8B6_finger").setDepth(100);
    this.createKeys();
    eventsCenter.on("start_game", () => {
      this.started = true;
      this.globalState.timerMessage("start_timer");
    });
    this.finger.body.collideWorldBounds = true;
    this.gameStart();
  }
  update() {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      //this.playSwatText();

      this.movefinger();
      this.borders();
      if (this.gameOver && !this.sent) {
        eventsCenter.emit("stop_timer");
        eventsCenter.emit("game-end", this.victory);
        this.sent = true;
      }
    }
  }
  createKeys() {
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }
  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }
  initGamePad() {
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x < -0.5,
      () => this.movefinger(-1)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === -1,
      () => this.movefinger(-11)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x > 0.5,
      () => this.movefinger(1)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === 1,
      () => this.movefinger(11)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y > 0.5,
      () => this.movefinger(-2)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y === 1,
      () => this.movefinger(-22)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y < -0.5,
      () => this.movefinger(2)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y === -1,
      () => this.movefinger(22)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y === 0,
      () => this.movefinger(4)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === 0,
      () => this.movefinger(3)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.buttons[0].pressed,
      () => {
        this.choose();
      }
    );
  }
  movefinger(x) {
    if (this.finger) {
      if (x === 2) {
        this.finger.setVelocityY(-400);
      }
      if (x === 22) {
        this.finger.setVelocityY(-800);
      }
      if (x === -2) {
        this.finger.setVelocityY(400);
      }
      if (x === -22) {
        this.finger.setVelocityY(800);
      }
      if (x === -1) {
        this.finger.setVelocityX(-400);
      }
      if (x === -11) {
        this.finger.setVelocityX(-800);
      }
      if (x === 1) {
        this.finger.setVelocityX(400);
      }
      if (x === 11) {
        this.finger.setVelocityX(800);
      }
      if (x === 3) {
        this.finger.setVelocityX(0);
      }
      if (x === 4) {
        this.finger.setVelocityY(0);
      }
    }
  }
  getSuspectPos() {
    const position = {
      x: Math.floor(Phaser.Math.Between(100, 1000)),
      y: Math.floor(Phaser.Math.Between(100, 400)),
    };
    if (
      (position.x > this.correct.body.x + 100) &
      (position.x < this.correct.body.x - 100)
    )
      this.getSuspectPos();
    if (
      (position.y > this.correct.body.y + 100) &
      (position.y < this.correct.body.y - 100)
    )
      this.getSuspectPos();
    return position;
  }
  getRandomPosition() {
    const position = {
      x: Math.floor(Phaser.Math.Between(100, 1000)),
      y: Math.floor(Phaser.Math.Between(100, 400)),
    };
    return position;
  }

  choose() {
    if (
      Phaser.Geom.Intersects.CircleToRectangle(
        this.correct.body,
        this.finger.body
      )
    ) {
      this.add.image(540, 360, "8B6_Posters").setFrame(this.wantedNum * 2 + 1);
      this.victory = true;
      setTimeout(() => {
        this.gameOver = true;
      }, 1500);
    }
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  spawnCorrect() {
    const Position = this.getRandomPosition();
    this.correct = this.physics.add
      .image(Position.x, Position.y, "8B6_Heads")
      .setFrame(this.wantedNum);
    this.correct.setScale(0.5);
    this.correct.body.setCircle(120);
  }
  borders() {
    if (this.finger.x <= 40) this.finger.x = 50;
    if (this.finger.x >= 1035) this.finger.x = 1025;
    if (this.finger.y <= 80) this.finger.y = 90;
    if (this.finger.y >= 480) this.finger.y = 470;
  }
  spawnSuspects() {
    for (let l = 0; l < 3; l++) {
      for (let i = 0; i < this.suspects; i++) {
        if (i === this.wantedNum) i++;
        const Position = this.getSuspectPos();
        this.suspectHead = this.add
          .sprite(Position.x, Position.y, "8B6_Heads")
          .setScale(0.5);
        this.suspectHead.setFrame(i);
      }
    }
  }

  gameStart() {
    this.started = true;
    this.wantedNum = this.getRandomInt(6);
    this.wanted = this.add
      .image(550, 620, "8B6_Posters")
      .setFrame(this.wantedNum * 2);
    this.wanted.setScale(0.25);
    this.spawnCorrect();
    this.suspectArray.length = this.suspects;
    this.spawnSuspects();
  }
}
