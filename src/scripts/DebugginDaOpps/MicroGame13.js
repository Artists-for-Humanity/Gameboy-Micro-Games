export default class MicroGame13 extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "MicroGame13",
    });

    // Game Object Declarations
    this.cannon;
    this.barrels;
    this.totalBarrels;
  }

  preload() {
    this.load.image(
      "startScreen",
      new URL("./assets2/startScreen.png", import.meta.url).href
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
      "waves",
      new URL("./assets2/wave-pixel.png", import.meta.url).href
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
      { frameWidth: 980, frameHeight: 720 }
    );
  }

  create() {
    this.cannonBallGrp = this.physics.add.group();
    this.totalBarrels = Phaser.Math.Between(3, 9);
    this.totalCannonBalls = 4;
    this.answer = [];
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
      key: "cannon-shoot",
      frames: [
        { key: "cannon", frame: 0 },
        { key: "cannon", frame: 1 },
        { key: "cannon", frame: 2 },
        { key: "cannon", frame: 3 },
        { key: "cannon", frame: 4 },
        { key: "cannon", frame: 5 },
        { key: "cannon", frame: 6 },
        { key: "cannon", frame: 7 },
        { key: "cannon", frame: 8 },
        { key: "cannon", frame: 9 },
      ],
      frameRate: 24,
    });
  }

  update() {
    if (this.cursors.down.isDown) {
      this.cannon.anims.play("cannon-shoot", true);
    }
  }

  onEvent() {
    this.tempScreen.visible = false;
  }

  createCannonBalls(cannonBallGrp, texture) {
    let rand = Phaser.Math.Between(2, this.totalBarrels - 1);
    this.answer = [rand, this.totalBarrels - rand];

    delete this.cannonBallMap[this.answer[0] + "-ball"];
    delete this.cannonBallMap[this.answer[1] + "-ball"];

    for (let i = 0; i < this.totalCannonBalls; i++) {
      let randIdx = Phaser.Math.Between(0, this.cannonBallPos.length - 1);
      let randPos = this.cannonBallPos.splice(randIdx, 1)[0];

      if (i <= 1) {
        cannonBallGrp
          .create(randPos[0], randPos[1], texture[this.answer[i] - 1])
          .setScale(1.7, 1.7);
      } else {
        let keys = Object.keys(this.cannonBallMap);
        cannonBallGrp
          .create(
            randPos[0],
            randPos[1],
            keys[Phaser.Math.Between(0, keys.length - 1)]
          )
          .setScale(1.7, 1.7);
      }
    }
  }

  createBarrels(num, xposition, yposition) {
    for (let i = 0; i < num; i++) {
      if (this.barrelRowMap[i] === 1) {
        this.add.image(
          xposition + this.barrel.displayWidth * i + i * 10,
          yposition,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 2) {
        this.add.image(
          xposition +
            this.barrel.displayWidth * (i - 4) +
            this.barrel.displayWidth / 2 +
            (i - 4) * 10,
          yposition - this.barrel.displayHeight,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 3) {
        this.add.image(
          xposition + this.barrel.displayWidth * (i - 6) + (i - 6) * 10,
          yposition - this.barrel.displayHeight * 2,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 4) {
        this.add.image(
          xposition +
            this.barrel.displayWidth * (i - 8) +
            this.barrel.displayWidth / 2 +
            10,
          yposition - this.barrel.displayHeight * 3,
          "barrel"
        );
      }
    }
  }
}
