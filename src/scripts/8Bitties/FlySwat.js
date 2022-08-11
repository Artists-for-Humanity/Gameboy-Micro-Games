import Phaser from "phaser";
export default class FlySwat extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "FlySwat",
    });
    this.swatter;
    this.fly;
    this.swatdown = false;
    this.deadFly;
    this.swatTimer = 2;
    this.swatTextTimer = 0;
    this.swatTextScale = 0;
    this.gamestart = false;
    this.flightPattern;
    this.swingCD = 100;
    this.swung = false;
    this.timer = 0;
    this.gameOver = false;
    this.dead = false;
    this.victory = false;
  }
  preload() {
    this.load.image(
      "dead",
      new URL("../8Bitties/assets/FlySwat/deadfly.png", import.meta.url).href
    );
    this.load.image(
      "holder",
      new URL("../8Bitties/assets/FlySwat/imageholder.png", import.meta.url)
        .href
    );
    this.load.image(
      "swat",
      new URL("../8Bitties/assets/FlySwat/swatText.png", import.meta.url).href
    );
    this.load.image(
      "kitchen",
      new URL("../8Bitties/assets/FlySwat/kitchenbg.png", import.meta.url).href
    );
    this.load.spritesheet(
      "fly",
      new URL("../8Bitties/assets/FlySwat/fly_sheet.png", import.meta.url).href,
      {
        frameWidth: 190,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "swatter",
      new URL(
        "../8Bitties/assets/FlySwat/flyswatter_sheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 322,
        frameHeight: 430,
      }
    );
    this.load.spritesheet(
      "explosion",
      new URL("../8Bitties/assets/FlySwat/boomSheet.png", import.meta.url).href,
      {
        frameWidth: 140,
        frameHeight: 130,
      }
    );
  }
  create() {
    this.makeAnimations();
    this.kitchen = this.add.image(540, 360, "kitchen").setDepth(-4);
    this.swat = this.add.image(540, 360, "swat");
    this.createKeys();
  }
  update() {
    this.playSwatText();
    if (!this.dead) this.moveFly();
    this.moveSwatter();
    this.swing();
    //this.animateDeadFly();
  }
  gameStart() {
    this.flightPattern = Math.floor(Math.random() * 2);
    this.fly = this.physics.add.sprite(540, 360, "fly");
    this.fly.anims.play("flying", true);
    this.fly.body.setCircle(32).setOffset(32, 32);
    this.swatter = this.physics.add.sprite(500, 450, "swatter");
    this.swatter.body.setSize(128, 160).setOffset(128, 32);
    this.gamestart = true;
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
  killFly() {
    this.fly.anims.play("crash");
    this.dead = true;
  }

  moveFly() {
    if (this.fly) {
      this.timer += 0.1;
      if (this.flightPattern === 1) {
        this.fly.x = Math.sin(this.timer / 2) * 320 + 540;
        this.fly.y = Math.sin(this.timer) * 128 + 360;
      }
      if (this.flightPattern === 0) {
        this.fly.x = Math.cos(this.timer) * 160 + 540;
        this.fly.y = Math.sin(this.timer) * 160 + 320;
      }
    }
  }
  makeAnimations() {
    this.anims.create({
      key: "flying",
      frames: [
        { key: "fly", frame: 0 },
        { key: "fly", frame: 1 },
        { key: "fly", frame: 2 },
        { key: "fly", frame: 3 },
        { key: "fly", frame: 4 },
        { key: "fly", frame: 5 },
        { key: "fly", frame: 6 },
      ],
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: [{ key: "swatter", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "down",
      frames: [{ key: "swatter", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "crash",
      frames: [
        { key: "explosion", frame: 0 },
        { key: "explosion", frame: 1 },
        { key: "explosion", frame: 2 },
        { key: "explosion", frame: 3 },
        { key: "explosion", frame: 4 },
        { key: "explosion", frame: 5 },
        { key: "explosion", frame: 6 },
        { key: "explosion", frame: 7 },
        { key: "explosion", frame: 8 },
        { key: "explosion", frame: 9 },
        { key: "explosion", frame: 12 },
        { key: "explosion", frame: 13 },
        { key: "explosion", frame: 14 },
        { key: "explosion", frame: 15 },
        { key: "explosion", frame: 16 },
        { key: "explosion", frame: 17 },
        { key: "explosion", frame: 18 },
        { key: "explosion", frame: 19 },
        { key: "explosion", frame: 20 },
      ],
      frameRate: 10,
      repeat: 0,
    });
  }
  swing() {
    if (this.swatter && this.gameOver === false) {
      if (this.swung === true) {
        this.swingCD -= 10;
      }
      if (this.swingCD <= 0) {
        this.swatter.anims.play("up", true);
        this.swung = false;
        this.swingCD = 100;
      }
      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        this.swatter.anims.play("down", true);
        this.swung = true;
        if (
          Phaser.Geom.Intersects.CircleToRectangle(
            this.fly.body,
            this.swatter.body
          )
        ) {
          this.killFly();
          this.victory = true;
          this.gameOver = true;
        }
      }
    }
  }
  createKeys() {
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }
  moveSwatter() {
    if (this.swung === false && this.swatter) {
      if (this.up.isDown) {
        this.swatter.y -= 7;
      }
      if (this.down.isDown) {
        this.swatter.y += 7;
      }
      if (this.left.isDown) {
        this.swatter.x -= 7;
      }
      if (this.right.isDown) {
        this.swatter.x += 7;
      }
    }
  }
}
