import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from '../ButtonPressHandlers';


export default class Emeowgency extends Phaser.Scene {
  // Game Class Constructor
  //note: try making the cat and shadow exist at the begining of the gmae and just toggle visibility, also use set frames whne you lose/win or something
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Emeowgency",
    });
    this.gamestart = false;

    // Game Object Declaration
    this.timer = 43;
    this.catchScale = 0;
    this.catch;
    this.grass;
    this.catFail = false;
    this.catFall = true;
    this.catSafe = false;
    this.shadowScale = 0;
    this.shadowTimer = 0;
    this.safeScale = 0;
    this.safeTimer = 0;
    this.failScale = 0;
    this.failTimer = 0;
    this.createImage = false;
    this.failScaleToggle = false;
    this.safeScaleToggle = false;
    this.cat;
    this.blanket;
    this.shadow;
    this.victory = false;
    this.gameOver = false;
    this.gOtimerToggle = false;
    this.sent = false;
    this.gOtimer = 0;
    this.fallen = false;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {
    this.load.image(
      "8B4_catch",

      new URL("../8Bitties/assets/Emeowgency/fail_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B4_fail",

      new URL("../8Bitties/assets/Emeowgency/fail_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B4_safe",

      new URL("../8Bitties/assets/Emeowgency/safe_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B4_Blanket",
      new URL("../8Bitties/assets/Emeowgency/blanket.png", import.meta.url).href
    );
    this.load.image(
      "8B4_grass",

      new URL("../8Bitties/assets/Emeowgency/grass_bg.png", import.meta.url)
        .href
    );
    this.load.spritesheet(
      "8B4_yang",

      new URL(
        "../8Bitties/assets/Emeowgency/yangSpriteSheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 86.8,
        frameHeight: 58,
      }
    );
    this.load.spritesheet(
      "8B4_blanketSheet",
      new URL(
        "../8Bitties/assets/Emeowgency/blanketSpriteSheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 617,
        frameHeight: 465,
      }
    );
    this.load.spritesheet(
      "8B4_yangSafe",
      new URL("../8Bitties/assets/Emeowgency/yangSafe.png", import.meta.url)
        .href,
      {
        frameWidth: 354,
        frameHeight: 185,
      }
    );
    this.load.spritesheet(
      "8B4_yangFail",
      new URL("../8Bitties/assets/Emeowgency/yangfail.png", import.meta.url)
        .href,
      {
        frameWidth: 102,
        frameHeight: 58,
      }
    );
  }

  create() {
    this.resetEmeowgency();
    this.grass = this.add.image(540, 360, "8B4_grass").setDepth(-10);
    this.catch = this.add.image(540, 360, "8B4_catch");
    this.catch.setScale(0);
    this.createAnimations();
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.spawnBlanket();

    eventsCenter.on('start_game', () => {
      this.started = true; 
      this.globalState.timerMessage('start_timer'); 
      this.gameStart();
    });

  }

  update() {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      this.catch.setVisible(false);
      this.gameOverTimer();
      this.playSafe();
      this.playFail();
      this.scaleCatch();

      if (this.shadow) {
        this.scaleShadow();
      }
      if (this.cat) {
        this.playanimations();
        if (this.cat.y !== this.shadow.y) {
          this.cat.y += 4;
        }
        if (this.catFall)
          this.moveBlanket();
      }

      if (this.gameOver && !this.sent) {
        eventsCenter.emit('stop_timer');
        eventsCenter.emit("game-end", this.victory);
        this.sent = true;
        this.cat.destroy();
        this.shadow.destroy();

      }

    }
  }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.moveBlanket(-1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.moveBlanket(1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.5, () => this.moveBlanket(-2));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.5, () => this.moveBlanket(2));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.moveBlanket(0));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 0, () => this.moveBlanket(3));
  }

  resetEmeowgency(){
    this.timer = 43;
    this.catchScale = 0;
    this.catFail = false;
    this.catFall = true;
    this.catSafe = false;
    this.shadowScale = 0;
    this.shadowTimer = 0;
    this.safeScale = 0;
    this.safeTimer = 0;
    this.failScale = 0;
    this.failTimer = 0;
    this.createImage = false;
    this.failScaleToggle = false;
    this.safeScaleToggle = false;
    this.victory = false;
    this.gameOver = false;
    this.gOtimerToggle = false;
    this.sent = false;
    this.gOtimer = 0;
    this.fallen = false;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  //Catch!, the image in the beggining
  scaleCatch() {
    if (this.catchScale <= 1) {

      this.catchScale += 0.3 / this.timer;
      this.catch.setScale(this.catchScale);
    } else if (this.timer === 43) {
      this.catch.destroy();

      this.timer = 0;
    }
  }

  //starts the game after Catch! finnishes popping up
  gameStart() {
    if (!this.gameOver) {
      this.spawnShadow();
      this.spawnCat();
    }

  }

  //makes a random x and y coordiante
  getRandomPosition() {
    const position = {
      x: Math.floor(Phaser.Math.Between(200, 800)),
      y: Math.floor(Phaser.Math.Between(200, 600)),
    };
    return position;
  }

  //spawns the shadow at a random location on the screen
  spawnShadow() {
    const position = this.getRandomPosition();
    this.shadow = this.physics.add.sprite(position.x, position.y, "8B4_yang");
    this.shadow.alpha = 0.5;
  }

  spawnBlanket() {
    this.blanket = this.physics.add
      .sprite(480, 360, "8B4_blanketSheet")
      .setScale(0.65)

      .setDepth(-10);

  }

  //spawns the cat above the Shadow based on how long shadow takes to get big
  spawnCat() {
    this.cat = this.add
      .sprite(this.shadow.x, this.shadow.y - 83 * 4, "8B4_yangSafe")
      .setScale(1.9);

  }

  //scales the shadow up to 1 , also determines the end of the game
  scaleShadow() {
    if (this.shadow) {
      if (this.shadowScale <= 2) {
        this.shadowTimer++;
        this.shadowScale += 0.4 / this.shadowTimer;
        this.shadow.setScale(this.shadowScale);
      }
      if (this.shadowTimer === 83) {
        if (
          Phaser.Geom.Rectangle.Overlaps(this.shadow.body, this.blanket.body)
        ) {
          this.blanket.anims.play("8B4_cushion", true);
          this.youWin();
          this.cat.setScale(0.5);
          this.cat.anims.play("8B4_safe");
          this.shadowTimer = 0;
        }


        if (this.catSafe === true) {
          this.safeScaleToggle = true;
        }
        if (this.catSafe === false) {
          this.catFail = true;
          this.failScaleToggle = true;
        }
        this.catFall = false;
      }
    }
  }

  playanimations() {
    if (this.catFall) this.cat.anims.play("8B4_fall", true);
    if (this.catFail && !this.fallen) {
      this.cat.anims.play("8B4_fail_1", true).once("animationcomplete", () => {
        this.cat.anims.play("8B4_fail_2");
      });
      this.fallen = true;

    }
  }

  //moves the blanket with arrow keys
  moveBlanket(x) {
    if (x === 2) {
      this.blanket.setVelocityY(-350);
    }
    if (x === -2) {
      this.blanket.setVelocityY(350);
    }
    if (x === -1) {
      this.blanket.setVelocityX(-350);
    }
    if (x === 1) {
      this.blanket.setVelocityX(350);
    }
    if (x === 0) this.blanket.setVelocityX(0);
    if (x === 3) this.blanket.setVelocityY(0);
  }

  //creates the image for safe! on cene and scales it up gradually
  playSafe() {
    if (this.safeScaleToggle === true) {
      if (this.createImage === false) {
        this.safe = this.add.image(540, 360, "8B4_safe").setDepth(100);
        this.createImage = true;
      }
      if (this.safeScale <= 1) {
        this.safeTimer++;
        this.safeScale += 0.2 / this.safeTimer;
        this.safe.setScale(this.safeScale);
      }
      else
        this.gameOver = true;

      this.victory = true;

    }
  }

  //creates the image for fail on scene and scales it up gradually
  playFail() {
    if (this.failScaleToggle === true) {
      if (this.createImage === false) {
        this.fail = this.add.image(540, 360, "8B4_fail").setDepth(100);
        this.createImage = true;
      }
      if (this.failScale <= 1) {
        this.failTimer++;
        this.failScale += 0.2 / this.failTimer;
        this.fail.setScale(this.failScale);
      }
      else
        this.gameOver = true;
    }
  }

  createAnimations() {
    this.anims.create({
      key: "8B4_shadow",
      frames: [{ key: "8B4_yang", frame: 0 }],

      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "8B4_safe",
      frames: [
        { key: "8B4_yangSafe", frame: 1 },
        { key: "8B4_yangSafe", frame: 2 },
        { key: "8B4_yangSafe", frame: 3 },
        { key: "8B4_yangSafe", frame: 4 },
        { key: "8B4_yangSafe", frame: 5 },
        { key: "8B4_yangSafe", frame: 6 },
        { key: "8B4_yangSafe", frame: 7 },
        { key: "8B4_yangSafe", frame: 8 },
        { key: "8B4_yangSafe", frame: 9 },
        { key: "8B4_yangSafe", frame: 10 },
      ],
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: "8B4_fail_1",
      frames: [
        { key: "8B4_yangFail", frame: 0 },
        { key: "8B4_yangFail", frame: 2 },
        { key: "8B4_yangFail", frame: 3 },
      ],
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: "8B4_fail_2",
      frames: [
        { key: "8B4_yangFail", frame: 3 },
        { key: "8B4_yangFail", frame: 4 },
        { key: "8B4_yangFail", frame: 5 },
      ],
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: "8B4_fall",
      frames: [{ key: "8B4_yang", frame: 1 }],

      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "8B4_cushion",
      frames: [
        { key: "8B4_blanketSheet", frame: 0 },
        { key: "8B4_blanketSheet", frame: 1 },
        { key: "8B4_blanketSheet", frame: 2 },
        { key: "8B4_blanketSheet", frame: 3 },
        { key: "8B4_blanketSheet", frame: 4 },
        { key: "8B4_blanketSheet", frame: 5 },

      ],
      frameRate: 12,
      repeat: 0,
    });
  }
  youWin() {
    this.safeScaleToggle = true;
    this.catFall = false;
    this.catSafe = true;
    this.victory = true;
    this.gOtimerToggle = true;
    this.physics.pause();
  }
  youLose() {
    this.catFail = true;
    this.catFall = false;
    this.failScaleToggle = true;
    this.gOtimerToggle = true;
  }
  gameOverTimer() {
    if (this.gOtimerToggle === true) this.gOtimer++;
    if (this.gOtimer === 80) this.gameOver = true;
  }

}

