import Phaser from "phaser";
import Cat from "./sprites/cat";
import Blanket from "./sprites/Blanket";

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
    this.catfalling = false;
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
      "shadow",
      new URL("../8Bitties/assets/animations/shadow.png", import.meta.url).href
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
        "../8Bitties/assets/animations/SpriteSheetYang.png",
        import.meta.url
      ).href,
      {
        frameWidth: 19,
        frameHeight: 87,
      }
    );
  }

  create() {
    // this.setText();
    this.catch = this.add.image(490, 360, "catch");
    this.timer = 1;
    this.catch.setScale(0);
    this.loadAnimations();
  }

  update() {
    this.scaleCatch();
    if (this.catfalling === true) {
      this.cat.update();
    }
  }
  gameStart() {
    this.grass = this.add.image(490, 360, "grass");
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
  spawnCat() {
    const position = this.getRandomPosition();
    this.cat = new Cat(this, position.x, position.y);
  }

  scaleCatch() {
    if (this.catchScale <= 0.9) {
      this.timer++;
      this.catchScale += 0.22 / this.timer;
      this.catch.setScale(this.catchScale);
    } else if (this.timer === 91) {
      this.catch.destroy();
      this.gameStart();
      this.timer = 0;
      this.catfalling = true;
    }
  }
  loadAnimations() {
    this.anims.create({
      key: "safe",
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
      key: "fail",
      frames: [
        {
          key: "yang",
          frame: 1,
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
          frame: 0,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
  }

  spawnBlanket() {
    console.log("blanket");
  }
}
