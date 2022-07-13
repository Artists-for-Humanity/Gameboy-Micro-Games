export default class ColorLab extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "ColorLab",
    });
    this.gamestart = false;
    // Game Object Decla
    this.timer;
    this.catchScale = 0;
    this.catch;
    this.grass;
  }
  preload() {
    this.load.image(
      "catch",
      new URL("../8Bitties/assets/Catch_Text.png",
        import.meta.url).href
    );
    this.load.image(
      "fail",
      new URL("../8Bitties/assets/fail_text.png",
        import.meta.url).href
    );
    this.load.image(
      "safe",
      new URL("../8Bitties/assets/safe_text.png",
        import.meta.url).href
    );
    this.load.image(
      "shadow",
      new URL("../8Bitties/assets/animations/shadow.png",
        import.meta.url).href
    );
    this.load.image(
      "yang_fall",
      new URL("../8Bitties/assets/animations/yang_fall.png",
        import.meta.url)
        .href
    );
    this.load.image(
      "yang_safe",
      new URL("../8Bitties/assets/animations/yang_safe.png",
        import.meta.url)
        .href
    );
    this.load.image(
      "yang_falling",
      new URL("../8Bitties/assets/animations/Yang_Falling.png",
        import.meta.url)
        .href
    );
    this.load.image(
      "Blanket",
      new URL("../8Bitties/assets/blanket.png",
        import.meta.url).href
    );
    this.load.image(
      "grass",
      new URL("../8Bitties/assets/grass_bg.png",
        import.meta.url).href
    );
  }

  create() {
    // this.setText();
    this.catch = this.add.image(490, 360, "catch");
    this.timer = 1;
    this.catch.setScale(0);
  }

  update() {
    this.scaleCatch();
  }
  gameStart() {
    this.grass = this.add.image(490, 360, "grass");
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  getPosition() {
    const Position = {
      x: Math.floor(Phaser.Math.Between(100, 900)),
      y: Math.floor(Phaser.Math.Between(100, 700)),
    };
  }
  spawnCat() {
    console.log("here");
  }

  scaleCatch() {
    console.log(this.catchScale);
    if (this.catchScale <= 0.9) {
      this.timer++;
      console.log(this.timer)
      this.catch.setScale(this.catchScale);
      this.catchScale += 0.2 / this.timer;
    } else if (this.timer === 137) {
      this.catch.destroy();
      this.gameStart();
      this.timer = 0;
      console.log('hi');
    }
  }
}