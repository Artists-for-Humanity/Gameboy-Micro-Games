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
    this.deadFlytimer = 0;
    this.deadFlyScale = 0;
    this.deadFly;
    this.swatTimer = 2;
    this.swatTextTimer = 0;
    this.swatTextScale = 0;
    this.fly;
    this.gamestart = false;
    this.swatter;
    this.timer = 0;
    this.flightPattern;
    this.swingCD = 100;
    this.swung = false;
    this.overLaptoggle = 0;
  }
  preload() {
    this.load.image(
      "dead",
      new URL("../8Bitties/assets/flySwat/deadfly.png", import.meta.url).href
    );
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
      new URL("../8Bitties/assets/flySwat/kitchenbg.png", import.meta.url).href
    );
    this.load.spritesheet(
      "fly",
      new URL("../8Bitties/assets/flySwat/fly_sheet.png", import.meta.url).href,
      {
        frameWidth: 190,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "swatter",
      new URL(
        "../8Bitties/assets/flySwat/flyswatter_sheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 322,
        frameHeight: 430,
      }
    );
  }

  create() {
    this.makeAnimations();
    this.kitchen = this.add.image(540, 360, "kitchen").setDepth(-4);
    this.swat = this.add.image(540, 360, "swat");
    this.createKeys();
    // this.createAnimations();
  }

  update() {
    // if (this.overLaptoggle === 1) {
    //   this.physics.add.overlap(this.fly, this.swatter, () => {
    //     this.overLaptoggle = 0;
    //     console.log("overlap check");
    //     if (this.swung === true) {
    //       this.killFly();
    //     }
    //     return;
    //   });
    // }
    this.moveSwatter();
    this.swing();
    this.moveFly();
    this.playSwatText();

    if (this.deadFly) {
      this.animateDeadFly();
    }
  }

  gameStart() {
    this.swatter = this.physics.add.sprite(500, 450, "swatter").setDepth(1);
    this.swatter.body.setSize(128, 160).setOffset(128, 32);
    this.flightPattern = Math.floor(Math.random() * 2);
    this.fly = this.physics.add
      .sprite(540, 360, "fly")
      .anims.play("flying", true)
      .body.setCircle(32)
      .setOffset(32, 32);
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
      this.physics.add.overlap(this.fly, this.swatter, () => {
        if (this.swung === false) {
          console.log("yo");
          this.killFly();
        }
      });
    }
  }

  killFly() {
    console.log("dead");
    this.deadFly = this.add.image(this.fly.x, this.fly.y, "dead");
    this.fly.destroy();
  }

  animateDeadFly() {
    if (this.deadFlyScale > 0.25) {
      this.deadFlyTimer++;
      this.deadFlyScale += this.deadFlytimer / 1;
      this.deadFly.setScale(this.deadFlyScale);
    }
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
  }
  swing() {
    if (this.swatter) {
      if (this.swung === true) {
        this.swingCD -= 2;
      }
      if (this.swingCD <= 0) {
        this.swatter.anims.play("up", true);
        this.swung = false;
        this.swingCD = 100;
      }
      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        this.swatter.anims.play("down", true);
        this.swung = true;
        this.overlapToggle = 1;
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
    if (this.swung === false) {
      if (this.up.isDown) {
        this.swatter.y -= 5;
      }
      if (this.down.isDown) {
        this.swatter.y += 5;
      }
      if (this.left.isDown) {
        this.swatter.x -= 5;
      }
      if (this.right.isDown) {
        this.swatter.x += 5;
      }
    }
  }
}
