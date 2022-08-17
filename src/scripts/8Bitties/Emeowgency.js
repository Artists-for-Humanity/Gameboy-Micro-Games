import Phaser from "phaser";
import eventsCenter from '../EventsCenter'


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
    this.grass;
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
    this.up;
    this.down;
    this.left;
    this.right;

    this.gameOver = false;
    this.victory = false;
    this.sent = false;
  }

  preload() {
    this.load.image(
      "8BEcatch",
      new URL("../8Bitties/assets/Emeowgency/Catch_Text.png", import.meta.url)
        .href
    );
    this.load.image(
      "8BEfail",
      new URL("../8Bitties/assets/Emeowgency/fail_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "8BEsafe",
      new URL("../8Bitties/assets/Emeowgency/safe_text.png", import.meta.url)
        .href
    );
    this.load.image(
      "8BEBlanket",
      new URL("../8Bitties/assets/Emeowgency/blanket.png", import.meta.url).href
    );
    this.load.image(
      "8BEgrass",
      new URL("../8Bitties/assets/Emeowgency/grass_bg.png", import.meta.url)
        .href
    );
    this.load.spritesheet(
      "8BEyang",
      new URL(
        "../8Bitties/assets/Emeowgency/yangSpriteSheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 86.8,
        frameHeight: 58,
      }
    );
  }

  create() {
    this.grass = this.add.image(540, 360, "8BEgrass").setDepth(-10);
    this.catch = this.add.image(540, 360, "8BEcatch");
    this.timer = 1;
    this.catch.setScale(0);
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

    if (this.shadow) {
      this.scaleShadow();
    }
    if (this.cat) {
      this.playanimations();
      if (this.cat.y !== this.shadow.y) {
        this.cat.y += 4;
      }
    }
    if (this.blanket) {
      this.moveBlanket();
    }

    if (this.gameOver && !this.sent) {
      eventsCenter.emit('game-end', this.victory)
      console.log('emission sent')
      this.sent = true
    }
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
    this.spawnCat();
    this.spawnBlanket();
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
    this.shadow = this.physics.add
      .sprite(position.x, position.y, "8BEyang")
      .setDepth(-8);
    this.shadow.alpha = 0.5;
  }

  spawnBlanket() {
    this.blanket = this.physics.add
      .image(480, 360, "8BEBlanket")
      .setScale(0.4)
      .setDepth(-10);
    this.physics.add.overlap(this.blanket, this.shadow, () => {
      this.catSafe = true;
    });
  }

  //spawns the cat above the Shadow based on how long shadow takes to get big
  spawnCat() {
    this.cat = this.physics.add
      .sprite(this.shadow.x, this.shadow.y - 83 * 4, "8BEyang")
      .setDepth(-7);
  }

  //scales the shadow up to 1 , also determines the end of the game
  scaleShadow() {
    if (this.shadowScale <= 1) {
      this.shadowTimer++;
      this.shadowScale += 0.2 / this.shadowTimer;
      this.shadow.setScale(this.shadowScale);
    }
    if (this.shadowTimer === 83) {
      this.shadowTimer = 0;

      if (this.catSafe === true) {
        this.safeScaleToggle = true;
        this.catFall = false;
      }
      if (this.catSafe === false) {
        this.catFail = true;
        this.catFall = false;
        this.failScaleToggle = true;
      }
    }
  }

  playanimations() {
    if (this.catSafe === true) {
      this.cat.anims.play("8BEsafe", true);
      return;
    }
    if (this.catFall === true) {
      this.cat.anims.play("8BEfall", true);
      return;
    }
    if (this.catFail === true) {
      this.cat.anims.play("8BEfail", true);
      return;
    }
  }

  //moves the blanket with arrow keys
  moveBlanket() {
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

  //creates the image for safe! on cene and scales it up gradually
  playSafe() {
    if (this.safeScaleToggle === true) {
      if (this.createImage === false) {
        this.safe = this.add.image(540, 360, "8BEsafe").setDepth(100);
        this.createImage = true;
      }
      if (this.safeScale <= 1) {
        this.safeTimer++;
        this.safeScale += 0.2 / this.safeTimer;
        this.safe.setScale(this.safeScale);
      }
      if (this.safeTimer === 83) {
        this.safeTimer = 0;
      }
      this.gameOver = true
      this.victory = true;

    }
  }

  //creates the image for fail on scene and scales it up gradually
  playFail() {
    if (this.failScaleToggle === true) {
      if (this.createImage === false) {
        this.fail = this.add.image(540, 360, "8BEfail").setDepth(100);
        this.createImage = true;
      }
      if (this.failScale <= 1) {
        this.failTimer++;
        this.failScale += 0.2 / this.failTimer;
        this.fail.setScale(this.failScale);
      }
      if (this.failTimer === 83) {
        this.failTimer = 0;
      }
      this.gameOver = true
    }
  }

  createAnimations() {
    this.anims.create({
      key: "8BEshadow",
      frames: [
        {
          key: "8BEyang",
          frame: 0,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "8BEsafe",
      frames: [
        {
          key: "8BEyang",
          frame: 3,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "8BEfail",
      frames: [
        {
          key: "8BEyang",
          frame: 2,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "8BEfall",
      frames: [
        {
          key: "8BEyang",
          frame: 1,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
  }
}
