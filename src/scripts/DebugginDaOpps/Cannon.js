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
    this.tries = 0;
  }

  preload() {
    this.load.image(
      "startScreen",
      new URL("./assets2/add-screen.png", import.meta.url).href
    );
    this.load.image(
      "gameOverScreen",
      new URL("./assets2/game-over.png", import.meta.url).href
    );
    this.load.image(
      "boats",
      new URL("./assets2/boats.png", import.meta.url).href
    );
    this.load.image(
      "barrel",
      new URL("./assets2/barrel.png", import.meta.url).href
    );
    this.load.image(
      "1-ball",
      new URL("./assets2/1-ball.png", import.meta.url).href
    );
    this.load.image(
      "2-ball",
      new URL("./assets2/2-ball.png", import.meta.url).href
    );
    this.load.image(
      "3-ball",
      new URL("./assets2/3-ball.png", import.meta.url).href
    );
    this.load.image(
      "4-ball",
      new URL("./assets2/4-ball.png", import.meta.url).href
    );
    this.load.image(
      "5-ball",
      new URL("./assets2/5-ball.png", import.meta.url).href
    );
    this.load.image(
      "6-ball",
      new URL("./assets2/6-ball.png", import.meta.url).href
    );
    this.load.image(
      "7-ball",
      new URL("./assets2/7-ball.png", import.meta.url).href
    );
    this.load.image(
      "8-ball",
      new URL("./assets2/8-ball.png", import.meta.url).href
    );
    this.load.image(
      "9-ball",
      new URL("./assets2/9-ball.png", import.meta.url).href
    );
    this.load.image(
      "ocean-bg",
      new URL("./assets2/ocean-pixel.png", import.meta.url).href
    );
    this.load.spritesheet(
      "cannon",
      new URL("./assets2/cannon-spritesheet.png", import.meta.url).href,
      {
        frameWidth: 980,
        frameHeight: 720,
      }
    );
    this.load.spritesheet(
      "fire",
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
      "ocean-bg"
    );
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "boats"
    );
    this.barrelRowMap = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    this.cannonBallMap = {
      "1-ball": 1,
      "2-ball": 2,
      "3-ball": 3,
      "4-ball": 4,
      "5-ball": 5,
      "6-ball": 6,
      "7-ball": 7,
      "8-ball": 8,
      "9-ball": 9,
    };
    this.barrel = this.add
      .image(650, 350, "barrel")
      .setScale(0.9, 0.9)
      .setVisible(false);
    this.createBarrels(this.totalBarrels, 600, 400);
    this.cannon = this.add.sprite(420, 350, "cannon").setScale(0.8, 0.8);
    this.fire = this.add.sprite(710, 320, "fire").setVisible(false);

    // spawn cannonballs
    this.cannonBall = this.add
      .image(0, 0, "1-ball")
      .setScale(1.7, 1.7)
      .setVisible(false);

    this.createCannonBalls(this.cannonBallGrp, Object.keys(this.cannonBallMap));

    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "gameOverScreen"
    );
    this.tempScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "startScreen"
    );

    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);

    this.anims.create({
      key: "fire",
      frames: [
        { key: "fire", frame: 0 },
        { key: "fire", frame: 1 },
        { key: "fire", frame: 2 },
        { key: "fire", frame: 3 },
        { key: "fire", frame: 4 },
        { key: "fire", frame: 5 },
        { key: "fire", frame: 6 },
        { key: "fire", frame: 7 },
        { key: "fire", frame: 8 },
        { key: "fire", frame: 9 },
        { key: "fire", frame: 10 },
        { key: "fire", frame: 11 },
        { key: "fire", frame: 12 },
        { key: "fire", frame: 13 },
        { key: "fire", frame: 14 },
        { key: "fire", frame: 15 },
        { key: "fire", frame: 16 },
        { key: "fire", frame: 17 },
        { key: "fire", frame: 18 },
        { key: "fire", frame: 19 },
        { key: "fire", frame: 20 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "cannon-shoot",
      frames: [
        {
          key: "cannon",
          frame: 0,
        },
        {
          key: "cannon",
          frame: 1,
        },
        {
          key: "cannon",
          frame: 2,
        },
        {
          key: "cannon",
          frame: 3,
        },
        {
          key: "cannon",
          frame: 4,
        },
        {
          key: "cannon",
          frame: 5,
        },
        {
          key: "cannon",
          frame: 6,
        },
        {
          key: "cannon",
          frame: 7,
        },
        {
          key: "cannon",
          frame: 8,
        },
        {
          key: "cannon",
          frame: 9,
        },
      ],
      frameRate: 24,
    });
  }

  update(time, delta) {
    if (!this.gameOver) {
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
      if (
        Phaser.Input.Keyboard.JustDown(this.SPACE) &&
        this.selectedValue != 0
      ) {
        this.cannon.anims.play("cannon-shoot", true);
        this.fire.anims.play("fire", true).setVisible(true);
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
      if (
        (this.cannonSelect === 0 &&
          Phaser.Input.Keyboard.JustDown(this.RIGHT)) ||
        (this.cannonSelect > 0 &&
          this.cannonSelect < 3 &&
          Phaser.Input.Keyboard.JustDown(this.RIGHT))
      ) {
        this.cannonSelect += 1;
        this.time.delayedCall(100, this.animateCannonBall, [], this);
      }
      if (
        this.cannonSelect === 0 &&
        Phaser.Input.Keyboard.JustDown(this.LEFT)
      ) {
        this.cannonSelect = 3;
        this.time.delayedCall(100, this.animateCannonBall, [], this);
      }

      if (
        this.cannonSelect === 3 &&
        Phaser.Input.Keyboard.JustDown(this.RIGHT)
      ) {
        this.cannonSelect = 0;
        this.time.delayedCall(100, this.animateCannonBall, [], this);
      }
      if (
        (this.cannonSelect === 3 &&
          Phaser.Input.Keyboard.JustDown(this.LEFT)) ||
        (this.cannonSelect > 0 &&
          this.cannonSelect < 3 &&
          Phaser.Input.Keyboard.JustDown(this.LEFT))
      ) {
        this.cannonSelect -= 1;
        this.time.delayedCall(100, this.animateCannonBall, [], this);
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

  gameWon() {
    if (this.gameOver === true) {
      this.victory = true;
      console.log(this.victory);
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
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 2) {
        this.barrelGrp.create(
          xposition +
          this.barrel.displayWidth * (i - 4) +
          this.barrel.displayWidth / 2 +
          (i - 4) * 10,
          yposition - this.barrel.displayHeight,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 3) {
        this.barrelGrp.create(
          xposition + this.barrel.displayWidth * (i - 6) + (i - 6) * 10,
          yposition - this.barrel.displayHeight * 2,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 4) {
        this.barrelGrp.create(
          xposition +
          this.barrel.displayWidth * (i - 8) +
          this.barrel.displayWidth / 2 +
          10,
          yposition - this.barrel.displayHeight * 3,
          "barrel"
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
