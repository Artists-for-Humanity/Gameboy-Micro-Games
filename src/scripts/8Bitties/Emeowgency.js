import Phaser from "phaser";

export default class Emeowgency extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Emeowgency",
    });
    this.gamestart = false;
    // Game Object Decla
    this.timer;
    this.catchScale = 0;
    this.catch;
    this.grass;
    this.catfalling = true;
    this.catFail = false;
    this.catFall = true;
    this.catSafe = false;
    this.shadowScale = 0;
    this.shadowTimer = 0;
    this.cat;
    this.shadow;
  }
  preload() {
    this.load.image(
      "catch",
      new URL("../8Bitties/assets/Catch_Text.png", import.meta.url).href
    );
    this.load.image(
      "fail",
      new URL("../8Bitties/assets/fail_text.png", import.meta.url).href
    );
    this.load.image(
      "safe",
      new URL("../8Bitties/assets/safe_text.png", import.meta.url).href
    );
    this.load.image(
      "Blanket",
      new URL("../8Bitties/assets/blanket.png", import.meta.url).href
    );
    this.load.image(
      "grass",
      new URL("../8Bitties/assets/grass_bg.png", import.meta.url).href
    );
    this.load.spritesheet(
      "yang",
      new URL(
        "../8Bitties/assets/animations/yangSpriteSheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 86.8,
        frameHeight: 58,
      }
    );
  }

  create() {
    // this.setText();
    this.catch = this.add.image(490, 360, "catch");
    this.timer = 1;
    this.catch.setScale(0);
    this.createAnimations();
  }

  update() {
    this.scaleCatch();
    console.log("timer", this.timer);
    if (this.shadow) {
      this.scaleShadow();
    }
    if (this.cat) {
      console.log("hieght", this.cat.y);

      this.playanimations();

      if (this.cat.y !== this.shadow.y) {
        this.cat.y += 4;
      }
    }
  }
  gameStart() {
    this.grass = this.add.image(490, 360, "grass").setDepth(-10);
    this.spawnShadow();
    this.spawnCat();
    this.spawnBlanket();
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  getRandomPosition() {
    const position = {
      x: Math.floor(Phaser.Math.Between(100, 900)),
      y: Math.floor(Phaser.Math.Between(100, 700)),
    };
    return position;
  }
  spawnShadow() {
    const position = this.getRandomPosition();
    // this.cat = new Cat(this, position.x, position.y);
    this.shadow = this.physics.add
      .sprite(position.x, position.y, "yang")
      .setDepth(-8);
  }

  scaleCatch() {
    if (this.catchScale <= 1) {
      this.timer++;
      this.catchScale += 0.3 / this.timer;
      this.catch.setScale(this.catchScale);
    } else if (this.timer === 43) {
      this.catch.destroy();
      this.gameStart();
      this.timer = 0;
      this.catfalling = true;
    }
  }
  createAnimations() {
    this.anims.create({
      key: "shadow",
      frames: [
        {
          key: "yang",
          frame: 0,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "safe",
      frames: [
        {
          key: "yang",
          frame: 3,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "fail",
      frames: [
        {
          key: "yang",
          frame: 2,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "fall",
      frames: [
        {
          key: "yang",
          frame: 1,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
  }

  spawnBlanket() {
    this.blanket = this.physics.add.image(480, 360, "Blanket").setScale(0.4);
  }

  scaleShadow() {
    if (this.shadowScale <= 1) {
      this.shadowTimer++;
      this.shadowScale += 0.2 / this.shadowTimer;
      this.shadow.setScale(this.shadowScale);
    } else if (this.shadowTimer === 83) {
      this.shadowTimer = 0;
    }
  }
  spawnCat() {
    this.cat = this.physics.add
      .sprite(this.shadow.x, this.shadow.y - 83 * 4, "yang")
      .setDepth(-7);
  }
  playanimations() {
    if (this.catSafe === true) {
      this.cat.anims.play("safe", true);
      return;
    }
    if (this.catFall === true) {
      this.cat.anims.play("fall", true);
      return;
    }
    if (this.catFail === true) {
      this.cat.anims.play("fail", true);
      return;
    }
  }
}
