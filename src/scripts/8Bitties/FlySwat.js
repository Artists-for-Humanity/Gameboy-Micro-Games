import Phaser from "phaser";
export default class FlySwat extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "FlySwat",
    });
    this.fly;
    this.swatter;
    this.swatdown = false;
    this.points = [
      new Phaser.Math.Vector2(540, 360),
      new Phaser.Math.Vector2(300, 290),
      new Phaser.Math.Vector2(270, 318),
      new Phaser.Math.Vector2(300, 345),
      new Phaser.Math.Vector2(360, 380),
      new Phaser.Math.Vector2(690, 250),
      new Phaser.Math.Vector2(750, 290),
      new Phaser.Math.Vector2(780, 317),
      new Phaser.Math.Vector2(540, 360),
    ];
    this.path;
    this.swatTextTimer = 0;
    this.swatTextScale = 0;
  }
  preload() {
    this.load.image(
      "holder",
      new URL("../8Bitties/assets/flySwat/imageholder.png", import.meta.url)
        .href
    );
    this.load.image(
      "swat",
      new URL("../8Bitties/assets/flySwat/swatText.png", import.meta.url).href
    );
    this.load.image(
      "kitchen",
      new URL("../8Bitties/assets/flySwat/swatText.png", import.meta.url).href
    );
  }
  create() {
    this.swat = this.add.image(540, 360, "swat");
    this.kitchen = this.add.image(540, 360, "kitchen");
  }
  update() {
    this.playSwatText();
  }
  makepath() {
    this.path = new Phaser.Curves.Path(540, 360);
    this.path.splineTo(this.points);
    this.fly = this.add.follower(this.path, 540, 360, "holder");
    this.fly.startFollow({
      duration: 2500,
      repeat: -1,
      rotateToPath: true,
    });
  }
  gameStart() {
    this.swatter = this.physics.add.sprite(540, 360, "holder");
    this.makepath();
    this.physics.add.overlap(this.fly, this.swatter, () => {
      if (this.swatdown === true) {
        this.killFly();
      }
    });
  }
  playSwatText() {
    if (this.swatTextScale < 1) {
      this.swatTextTimer++;
      this.swatTextScale += 0.238 / this.swatTextTimer;
      this.swat.setScale(this.swatTextScale);
    }
    if (this.swatTextTimer === 38) {
      this.swatTextTimer = 0;
      this.swat.destroy();
      this.gameStart();
    }
  }
}
