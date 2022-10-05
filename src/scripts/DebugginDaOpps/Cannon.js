import eventsCenter from '../EventsCenter'
import ButtonPressHandlers from '../ButtonPressHandlers';


export default class Cannon extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Cannon",
    });

    // Game Object Declarations
    this.cannon;
    this.fire;
    this.barrels;
    this.totalBarrels;
    this.inputNum = 1;
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.tries = 0;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null
  }

  preload() {
    this.load.image(
      "DO1_startScreen",
      new URL("./assets2/add-screen.png", import.meta.url).href
    );
    this.load.image(
      "DO1_gameOverScreen",

      new URL("./assets2/game-over.png", import.meta.url).href
    );
    this.load.image(
      "DO1_boats",
      new URL("./assets2/boats.png", import.meta.url).href
    );
    this.load.image(
      "DO1_barrel",
      new URL("./assets2/barrel.png", import.meta.url).href
    );
    this.load.image(
      "DO1_1ball",
      new URL("./assets2/1-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_2ball",
      new URL("./assets2/2-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_3ball",
      new URL("./assets2/3-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_4ball",
      new URL("./assets2/4-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_5ball",
      new URL("./assets2/5-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_6ball",
      new URL("./assets2/6-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_7ball",
      new URL("./assets2/7-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_8ball",
      new URL("./assets2/8-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_9ball",
      new URL("./assets2/9-ball.png", import.meta.url).href
    );
    this.load.image(
      "DO1_left_arrow",
      new URL("./assets2/left-arrow.png", import.meta.url).href
    );
    this.load.image(
      "DO1_right_arrow",
      new URL("./assets2/right-arrow.png", import.meta.url).href
    );
    this.load.image(
      "DO1_ocean_bg",
      new URL("./assets2/ocean-pixel.png", import.meta.url).href
    );
    this.load.spritesheet(
      "DO1_cannon",
      new URL("./assets2/cannon-spritesheet.png", import.meta.url).href,
      {
        frameWidth: 980,
        frameHeight: 720,
      }
    );
    this.load.spritesheet(
      "DO1_fire",
      new URL("./assets2/fire-spritesheet.png", import.meta.url).href,
      {
        frameWidth: 700,
        frameHeight: 400,
      }
    );
  }

  create() {
    this.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.RIGHT = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.SPACE = this.Up = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.gameOver = false;
    this.right = false;
    this.START_Y = 620;
    this.cannonSelect = 0;
    this.selectedValue = 0;
    this.cannonBallGrp = this.physics.add.group();
    this.barrelGrp = this.physics.add.group();
    this.totalBarrels = Phaser.Math.Between(3, 9);
    this.totalCannonBalls = 4;
    this.answer = [];
    this.animated = false;
    this.cannonBallPos = [
      [200, 620],
      [417, 620],
      [634, 620],
      [851, 620],
    ];
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO1_ocean_bg"
    );
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO1_boats"
    );

    this.barrelRowMap = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    this.cannonBallMap = {
      DO1_1ball: 1,
      DO1_2ball: 2,
      DO1_3ball: 3,
      DO1_4ball: 4,
      DO1_5ball: 5,
      DO1_6ball: 6,
      DO1_7ball: 7,
      DO1_8ball: 8,
      DO1_9ball: 9,
    };
    this.barrel = this.add
      .image(650, 350, "DO1_barrel")
      .setScale(0.9, 0.9)
      .setVisible(false);
    this.createBarrels(this.totalBarrels, 600, 400);
    this.cannon = this.add.sprite(420, 350, "DO1_cannon").setScale(0.8, 0.8);
    this.fire = this.add.sprite(710, 320, "DO1_fire").setVisible(false);
    this.add.image(980, 620, "DO1_right_arrow").setScale(0.8, 0.8);
    this.add.image(80, 620, "DO1_left_arrow").setScale(0.8, 0.8);

    // spawn cannonballs
    this.cannonBall = this.add
      .image(0, 0, "DO1_1ball")
      .setScale(1.7, 1.7)
      .setVisible(false);

    this.createCannonBalls(this.cannonBallGrp, Object.keys(this.cannonBallMap));

    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO1_gameOverScreen"

    );
    this.tempScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO1_startScreen"

    );

    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);



    this.createAnims();
    this.animateCannonBall();

    eventsCenter.on('start_game', () => { this.started = true; this.globalState.timerMessage('start_timer') })

  }

  createAnims() {

    this.anims.create({
      key: "DO1_fire",
      frames: [
        { key: "DO1_fire", frame: 0 },
        { key: "DO1_fire", frame: 1 },
        { key: "DO1_fire", frame: 2 },
        { key: "DO1_fire", frame: 3 },
        { key: "DO1_fire", frame: 4 },
        { key: "DO1_fire", frame: 5 },
        { key: "DO1_fire", frame: 6 },
        { key: "DO1_fire", frame: 7 },
        { key: "DO1_fire", frame: 8 },
        { key: "DO1_fire", frame: 9 },
        { key: "DO1_fire", frame: 10 },
        { key: "DO1_fire", frame: 11 },
        { key: "DO1_fire", frame: 12 },
        { key: "DO1_fire", frame: 13 },
        { key: "DO1_fire", frame: 14 },
        { key: "DO1_fire", frame: 15 },
        { key: "DO1_fire", frame: 16 },
        { key: "DO1_fire", frame: 17 },
        { key: "DO1_fire", frame: 18 },
        { key: "DO1_fire", frame: 19 },
        { key: "DO1_fire", frame: 20 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO1_cannon_shoot",
      frames: [
        {
          key: "DO1_cannon",
          frame: 0,
        },
        {
          key: "DO1_cannon",
          frame: 1,
        },
        {
          key: "DO1_cannon",
          frame: 2,
        },
        {
          key: "DO1_cannon",
          frame: 3,
        },
        {
          key: "DO1_cannon",
          frame: 4,
        },
        {
          key: "DO1_cannon",
          frame: 5,
        },
        {
          key: "DO1_cannon",
          frame: 6,
        },
        {
          key: "DO1_cannon",
          frame: 7,
        },
        {
          key: "DO1_cannon",
          frame: 8,
        },
        {
          key: "DO1_cannon",
          frame: 9,
        },
      ],
      frameRate: 24,
    });

  }

  update(time, delta) {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();

      // if (!this.gameOver) {
      if (this.totalBarrels === 0 && this.tries <= 2) {
        this.gameOver = true;
        this.gameWon();
      }
      if (this.tries >= 2 && this.totalBarrels != 0) {
        this.gameOver = true;
        this.time.delayedCall(
          2000,
          () => {
            this.gameOverScreen.setVisible(true);
          },
          [],
          this
        );
      }
      
      if (this.gameOver && !this.sent) {
        eventsCenter.emit('stop_timer');
        eventsCenter.emit("game-end", this.victory);
        this.sent = true
      }
    }
  }

  removeBarrels() {
    if (this.inputNum === 1) {
      for (let i = 0; i < this.selectedValue; i++) {
        this.barrelGrp.getChildren()[i].setVisible(false);
      }
    } else {
      for (
        let i = this.barrelGrp.getChildren().length - 1;
        i > this.barrelGrp.getChildren().length - this.selectedValue - 1;
        i--
      ) {
        this.barrelGrp.getChildren()[i].setVisible(false);
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
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === -1, () => this.userInput(-1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 1, () => this.userInput(1));
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.userInput(0)});
  }

  userInput(x) {

    //left and right
    if ((this.cannonSelect > 0 && this.cannonSelect < 3 && x === 1)) {
      this.cannonSelect += 1;
      this.time.delayedCall(100, this.animateCannonBall, [], this);
    }
    else if ((this.cannonSelect > 0 && this.cannonSelect < 3 && x === -1)) {
      this.cannonSelect -= 1;
      this.time.delayedCall(100, this.animateCannonBall, [], this);
    }
    else if (this.cannonSelect === 0 && x === -1) {
      this.cannonSelect = 3;
      this.time.delayedCall(100, this.animateCannonBall, [], this);
    }
    else if (this.cannonSelect === 0 && x === 1) {
      this.cannonSelect = 1;
      this.time.delayedCall(100, this.animateCannonBall, [], this);
    }
    else if ( this.cannonSelect === 3 && x === 1) {
      this.cannonSelect = 0;
      this.time.delayedCall(100, this.animateCannonBall, [], this);
    }
    else if ( this.cannonSelect === 3 && x === -1) {
      this.cannonSelect = 2;
      this.time.delayedCall(100, this.animateCannonBall, [], this);
    }

    //shoot
    else if (x === 0 && this.selectedValue != 0) {
      this.cannon.anims.play("DO1_cannon_shoot", true);
      this.fire.anims.play("DO1_fire", true).setVisible(true);
      this.totalBarrels -= this.selectedValue;
      if (this.selectedValue > this.barrelGrp.getChildren().length) {
        this.gameOver = true;
        this.time.delayedCall(
          2000,
          () => {
            this.gameOverScreen.setVisible(true);
          },
          [],
          this
        );
      } else {
        this.removeBarrels();
        this.inputNum += 1;
        this.tries += 1;
      }
    }

  }

  gameWon() {
    if (this.gameOver === true) {
      this.victory = true;
      this.endText = this.add.text(300, 250, "You Won!");
      this.endText.setStyle({
        fontSize: "100px",
        fill: "000000",
        align: "center",
      });
    }
  }

  resetCannonBallPosition() {
    for (let i = 0; i < this.cannonBallGrp.getChildren().length; i++) {
      this.cannonBallGrp.getChildren()[i].y = this.START_Y;
    }
  }

  animateCannonBall() {
    this.resetCannonBallPosition();
    this.cannonBallGrp.getChildren()[this.cannonSelect].y -= 20;
    this.selectedValue =
      this.cannonBallMap[
      this.cannonBallGrp.getChildren()[this.cannonSelect].texture.key
      ];
  }

  onEvent() {
    this.tempScreen.visible = false;
  }

  createCannonBalls(cannonBallGrp, texture) {
    let rand = Phaser.Math.Between(2, this.totalBarrels - 1);
    this.answer = [rand, this.totalBarrels - rand];
    let backUpMap = JSON.parse(JSON.stringify(this.cannonBallMap));
    delete backUpMap[this.answer[0] + "-ball"];
    delete backUpMap[this.answer[1] + "-ball"];

    for (let i = 0; i < this.totalCannonBalls; i++) {
      let randIdx = Phaser.Math.Between(0, this.cannonBallPos.length - 1);
      let randPos = this.cannonBallPos.splice(randIdx, 1)[0];

      if (i <= 1) {
        cannonBallGrp
          .create(randPos[0], randPos[1], texture[this.answer[i] - 1])
          .setScale(1.7, 1.7);
      } else {
        let keys = Object.keys(backUpMap);
        let barrelStr = this.barrelNumCheck(this.totalBarrels, keys);
        cannonBallGrp
          .create(randPos[0], randPos[1], barrelStr)
          .setScale(1.7, 1.7);
      }
    }

    const sortedCannonBalls = cannonBallGrp
      .getChildren()
      .sort((a, b) => a.x - b.x);

    Phaser.Utils.Array.Replace(
      cannonBallGrp.getChildren(),
      {},
      sortedCannonBalls
    );
  }

  // recursively generating the barrel num as long as it is not equal to total barrel value.
  barrelNumCheck(notThisNum, keys) {
    let barrelStr = keys[Phaser.Math.Between(0, keys.length - 1)];
    let barrelNum = parseInt(barrelStr[0]);
    if (notThisNum === barrelNum) {
      return this.barrelNumCheck(notThisNum, keys);
    }
    return barrelStr;
  }
  createBarrels(num, xposition, yposition) {
    for (let i = 0; i < num; i++) {
      if (this.barrelRowMap[i] === 1) {
        this.barrelGrp.create(
          xposition + this.barrel.displayWidth * i + i * 10,
          yposition,
          "DO1_barrel"
        );
      }
      if (this.barrelRowMap[i] === 2) {
        this.barrelGrp.create(
          xposition +
          this.barrel.displayWidth * (i - 4) +
          this.barrel.displayWidth / 2 +
          (i - 4) * 10,
          yposition - this.barrel.displayHeight,
          "DO1_barrel"
        );
      }
      if (this.barrelRowMap[i] === 3) {
        this.barrelGrp.create(
          xposition + this.barrel.displayWidth * (i - 6) + (i - 6) * 10,
          yposition - this.barrel.displayHeight * 2,
          "DO1_barrel"
        );
      }
      if (this.barrelRowMap[i] === 4) {
        this.barrelGrp.create(
          xposition +
          this.barrel.displayWidth * (i - 8) +
          this.barrel.displayWidth / 2 +
          10,
          yposition - this.barrel.displayHeight * 3,
          "DO1_barrel"
        );
      }
    }

    const sortedBarrelByLevel = this.barrelGrp
      .getChildren()
      .sort((a, b) => a.y - b.y);

    Phaser.Utils.Array.Replace(
      this.barrelGrp.getChildren(),
      {},
      sortedBarrelByLevel
    );
  }
}
