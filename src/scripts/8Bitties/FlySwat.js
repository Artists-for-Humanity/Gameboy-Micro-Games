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
    this.points1 = [
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
    this.deadFlytimer = 0;
    this.deadFlyScale = 0;
    this.deadFly;
    this.swatTimer = 2;
    this.swingTimer = 0;
    this.path;
    this.swatTextTimer = 0;
    this.swatTextScale = 0;
    this.fly;
    this.swatter;
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
        frameWidth: 131,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "swatter",
      new URL(
        "../8Bitties/assets/flySwat/flyswatter_sheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 327,
        frameHeight: 430,
      }
    );
  }

  create() {
    this.kitchen = this.add.image(540, 360, "kitchen").setDepth(-4);
    this.swat = this.add.image(540, 360, "swat");
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    // this.createAnimations();
  }

  update() {
    this.playSwatText();
    this.swing();
    if (this.deadFly) {
      this.animateDeadFly();
    }
  }
  makepath() {
    this.path = new Phaser.Curves.Path(540, 360);
    this.path.splineTo(this.points1);
    this.fly = this.add.follower(this.path, 540, 360, "fly").setDepth(-3);
    this.fly.startFollow({
      duration: 2500,
      repeat: -1,
      rotateToPath: true,
    });
  }

  gameStart() {
    this.swatter = this.physics.add.sprite(500, 450, "swatter").setDepth(1);
    this.makepath();
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

  swing() {
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.swatdown = true;
      // this.swatter.anims.play("down");
      console.log("down");
      if (
        (this.swatdown === true) &
        (this.fly.x > 359) &
        (this.fly.x < 749) &
        (this.fly.y > 185) &
        (this.fly.y < 400)
      ) {
        console.log("dead");
        this.killFly();
      }
    }
  }

  killFly() {
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
}
