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
      "waves",
      new URL("./assets2/wave-pixel.png", import.meta.url).href
    );
    this.load.image(
      "barrel",
      new URL("./assets2/pixel-barrel.png", import.meta.url).href
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
      { frameWidth: 700, frameHeight: 500 }
    );
  }

  create() {
    // this.add.image(
    //   this.game.config.width / 2,
    //   this.game.config.height / 2,
    //   "ocean-bg"
    // );
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
    this.createBarrels(10);
    this.cannon = this.add.sprite(350, 350, "cannon").setScale(0.8, 0.8);
    this.add.image(200, 620, "1-ball").setScale(1.7, 1.7);

    // create barrels

    // spawn cannonballs

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

  createCannonBalls() {}

  createBarrels(num) {
    for (let i = 0; i < num; i++) {
      if (this.barrelRowMap[i] === 1) {
        this.add.image(
          550 + this.barrel.displayWidth * i + i * 10,
          400,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 2) {
        this.add.image(
          550 +
            this.barrel.displayWidth * (i - 4) +
            this.barrel.displayWidth / 2 +
            (i - 4) * 10,
          400 - this.barrel.displayHeight,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 3) {
        this.add.image(
          550 + this.barrel.displayWidth * (i - 6) + (i - 6) * 10,
          400 - this.barrel.displayHeight * 2,
          "barrel"
        );
      }
      if (this.barrelRowMap[i] === 4) {
        this.add.image(
          550 +
            this.barrel.displayWidth * (i - 8) +
            this.displayWidth / 2 +
            (i - 8),
          400 - this.barrel.displayHeight * 3,
          "barrel"
        );
      }
    }
  }
}
