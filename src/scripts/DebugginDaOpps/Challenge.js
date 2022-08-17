export default class Challenge extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Challenge",
    });
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
    this.createBarrel(10);
  }

  update() {}

  createBarrel(amount) {
    if (amount <= 5) {
      const ret = this.physics.add.group({
        key: "DO1_barrel",
        repeat: amount - 1,
        setXY: {
          x: 200,
          y: 240,
          stepX: 90,
        },
      });
      return ret;
    } else if (amount <= 9) {
      var amountNew = amount - 5;
      const ret = this.physics.add.group({
        key: "DO1_barrel",
        repeat: 4,
        setXY: {
          x: 200,
          y: 240,
          stepX: 90,
        },
      });
      for (var i = 1; i <= amountNew; i++) {
        ret.create(150 + 90 * i, 140, "DO1_barrel");
      }
      return ret;
    } else if (amount <= 12) {
      var amountNew = amount - 9;
      const ret = this.physics.add.group({
        key: "DO1_barrel",
        repeat: 4,
        setXY: {
          x: 200,
          y: 240,
          stepX: 90,
        },
      });
      for (var i = 1; i <= 4; i++) {
        ret.create(150 + 90 * i, 150, "DO1_barrel");
      }
      for (var i = 1; i <= amountNew; i++) {
        ret.create(195 + 90 * i, 60, "DO1_barrel");
      }
      return ret;
    }
  }
}
