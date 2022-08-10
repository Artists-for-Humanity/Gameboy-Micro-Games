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

    // Game Object Declaration
    this.timer;
    this.catchScale = 0;
    this.catch;
    this.catfalling = true;
    this.catFail = false;
    this.catFall = true;
    this.catSafe = false;
    this.shadowScale = 0;
    this.shadowTimer = 0;
    this.safeScale = 0;
    this.safeTimer = 0;
    this.failScale = 0;
    this.failTimer = 0;
    this.createImage = false;
    this.failScaleToggle = false;
    this.safeScaleToggle = false;
    this.cat;
    this.blanket;
    this.shadow;
    this.victory = false;
    this.lose = false;
    this.gameOver = false;
  }

  preload() {
    this.load.image(
      "catch",
      new URL("../8Bitties/assets/Emeowgency/Catch_Text.png", import.meta.url)
        .href
    );
    this.load.image(
      "fail",
      new URL("../8Bitties/assets/Emeowgency/fail_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "safe",
      new URL("../8Bitties/assets/Emeowgency/safe_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "Blanket",
      new URL("../8Bitties/assets/Emeowgency/blanket.png", import.meta.url).href
    );
    this.load.image(
      "grass",
      new URL("../8Bitties/assets/Emeowgency/grass_bg.png", import.meta.url)
        .href
    );
    this.load.spritesheet(
      "yang",
      new URL(
        "../8Bitties/assets/Emeowgency/yangSpriteSheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 86.8,
        frameHeight: 58,
      }
    );
    this.load.spritesheet(
      "blanketSheet",
      new URL(
        "../8Bitties/assets/Emeowgency/blanketSpriteSheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 617,
        frameHeight: 465,
      }
    );
    this.load.spritesheet(
      "yangSafe",
      new URL("../8Bitties/assets/Emeowgency/yangSafe.png", import.meta.url)
        .href,
      {
        frameWidth: 354,
        frameHeight: 185,
      }
    );
  }

  create() {
    this.grass = this.add.image(540, 360, "grass").setDepth(-10);
    this.catch = this.add.image(540, 360, "catch");
    this.timer = 1;
    this.createAnimations();
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
  }

  update() {
    this.playSafe();
    this.playFail();
    this.scaleCatch();
    this.scaleShadow();
    if (this.cat) {
      this.playanimations();
      if (this.cat.y !== this.shadow.y) {
        this.cat.y += 4;
      }
    }
    this.moveBlanket();
  }

  //Catch!, the image in the beggining
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

  //starts the game after Catch! finnishes popping up
  gameStart() {
    this.spawnShadow();
    this.spawnBlanket();
    this.spawnCat();
  }

  //makes a random x and y coordiante
  getRandomPosition() {
    const position = {
      x: Math.floor(Phaser.Math.Between(100, 900)),
      y: Math.floor(Phaser.Math.Between(100, 700)),
    };
    return position;
  }

  //spawns the shadow at a random location on the screen
  spawnShadow() {
    const position = this.getRandomPosition();
    this.shadow = this.physics.add.sprite(position.x, position.y, "yang");
    this.shadow.alpha = 0.5;
    this.shadow.body.setSize(24, 24);
  }

  spawnBlanket() {
    this.blanket = this.physics.add
      .sprite(480, 360, "blanketSheet")
      .setScale(0.65)
      .setDepth(-10);
    this.blanket.body.setSize(350, 250);
  }

  //spawns the cat above the Shadow based on how long shadow takes to get big
  spawnCat() {
    this.cat = this.add
      .sprite(this.shadow.x, this.shadow.y - 83 * 4, "yangSafe")
      .setScale(1.9);
  }

  //scales the shadow up to 1 , also determines the end of the game
  scaleShadow() {
    if (this.shadow) {
      if (this.shadowScale <= 2) {
        this.shadowTimer++;
        this.shadowScale += 0.4 / this.shadowTimer;
        this.shadow.setScale(this.shadowScale);
      }
      if (this.shadowTimer === 83) {
        if (
          Phaser.Geom.Rectangle.Overlaps(this.shadow.body, this.blanket.body)
        ) {
          this.victory === true;
          this.blanket.anims.play("cushion", true);
          this.youWin();
          this.cat.setScale(0.5);
          this.cat.anims.play("safe");
          this.shadowTimer = 0;
          return;
        }

        if (this.victory === false) {
          this.youLose();
          this.shadowTimer = 0;
        }
        this.shadowTimer = 0;
      }
    }
  }

  playanimations() {
    if (this.catFall === true) this.cat.anims.play("fall", true);
    if (this.catFail === true) this.cat.anims.play("fail", true);
  }

  //moves the blanket with arrow keys
  moveBlanket() {
    if (this.blanket && this.gameOver === false) {
      if (this.up.isDown) {
        this.blanket.y -= 5;
      }
      if (this.down.isDown) {
        this.blanket.y += 5;
      }
      if (this.left.isDown) {
        this.blanket.x -= 5;
      }
      if (this.right.isDown) {
        this.blanket.x += 5;
      }
    }
  }

  //creates the image for safe! on cene and scales it up gradually
  playSafe() {
    if (this.safeScaleToggle === true) {
      if (this.createImage === false) {
        this.safe = this.add.image(540, 360, "safe").setDepth(100);
        this.createImage = true;
      }
      if (this.safeScale <= 1) {
        this.safeTimer++;
        this.safeScale += 0.2 / this.safeTimer;
        this.safe.setScale(this.safeScale);
      }
    }
  }

  //creates the image for fail on cene and scales it up gradually
  playFail() {
    if (this.failScaleToggle === true) {
      if (this.createImage === false) {
        this.fail = this.add.image(540, 360, "fail").setDepth(100);
        this.createImage = true;
      }
      if (this.failScale <= 1) {
        this.failTimer++;
        this.failScale += 0.2 / this.failTimer;
        this.fail.setScale(this.failScale);
      }
    }
  }

  createAnimations() {
    this.anims.create({
      key: "shadow",
      frames: [{ key: "yang", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "safe",
      frames: [
        { key: "yangSafe", frame: 1 },
        { key: "yangSafe", frame: 2 },
        { key: "yangSafe", frame: 3 },
        { key: "yangSafe", frame: 4 },
        { key: "yangSafe", frame: 5 },
        { key: "yangSafe", frame: 6 },
        { key: "yangSafe", frame: 7 },
        { key: "yangSafe", frame: 8 },
        { key: "yangSafe", frame: 9 },
        { key: "yangSafe", frame: 10 },
      ],
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: "fail",
      frames: [{ key: "yang", frame: 2 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "fall",
      frames: [{ key: "yang", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "cushion",
      frames: [
        { key: "blanketSheet", frame: 0 },
        { key: "blanketSheet", frame: 1 },
        { key: "blanketSheet", frame: 2 },
        { key: "blanketSheet", frame: 3 },
        { key: "blanketSheet", frame: 4 },
        { key: "blanketSheet", frame: 5 },
      ],
      frameRate: 15,
      repeat: 0,
    });
  }
  youWin() {
    this.safeScaleToggle = true;
    this.catFall = false;
    this.gameOver = true;
    this.catSafe = true;
  }
  youLose() {
    this.catFail = true;
    this.catFall = false;
    this.failScaleToggle = true;
    this.gameOver = true;
  }
}
