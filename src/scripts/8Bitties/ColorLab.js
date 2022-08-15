import WebFontFile from "../../scripts/WebFontFile";
import eventsCenter from '../EventsCenter'


export default class ColorLab extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "ColorLab",
    });
    this.victory = false;
    this.gameOver = false;
    this.sent = false;

    this.timer;
    this.catchScale = 0;
    this.mix;
    this.background;
    this.redVial;
    this.yellowVial;
    this.beaker;
    this.arrow;
    this.redVialHovered;
    this.yellowVialHovered;
    this.blueVialHovered;
    this.blueVial;

    this.prompts = ["Mix Purple", "Mix Orange", "Mix Green"];
    this.promptText;

    this.cursors;
    this.arrow_placement;
    this.vial_placement;

    this.decreasing;

    this.left;
    this.right;

    this.enter;
    this.vialNotEmpty;
    this.tryOne;
    this.tryTwo;
    this.beakerColor;

    this.safeScale = 0;
    this.safeTimer = 0;
    this.failScale = 0;
    this.failTimer = 0;
    this.createImage = false;
  }
  preload() {
    this.load.addFile(new WebFontFile(this.load, "Russo One"));

    this.load.image(
      "empty beaker",
      new URL("../8Bitties/assets/colorlab/beakerempty.png", import.meta.url)
        .href
    );
    this.load.image(
      "G8background",
      new URL("../8Bitties/assets/colorlab/sciencelabbg.png", import.meta.url)
        .href
    );
    this.load.image(
      "arrow",
      new URL("../8Bitties/assets/colorlab/arrow.png", import.meta.url).href
    );
    this.load.image(
      "prompt box",
      new URL("../8Bitties/assets/colorlab/textbox.png", import.meta.url).href
    );
    this.load.image(
      "safe",
      new URL("../8Bitties/assets/colorlab/safe_text.png", import.meta.url).href
    );
    this.load.image(
      "fail",
      new URL("../8Bitties/assets/colorlab/fail_text.png", import.meta.url).href
    );

    this.loadSpriteSheets();
  }

  create() {
    this.background = this.add.image(540, 360, "G8background");
    this.createSprites();

    // this.redVial.body.setAllowGravity(false);
    // this.blueVial.body.setAllowGravity(false);
    // this.yellowVial.body.setAllowGravity(false);
    // this.beaker.body.setAllowGravity(false);
    // this.arrow.body.setAllowGravity(false);
    // this.mix.body.setAllowGravity(false);

    this.finalColor = this.prompts[Phaser.Math.Between(0, 2)];
    this.promptText = this.add
      .text(490, 100, this.finalColor, {
        fontFamily: "Russo One",
        fontSize: "58px",
      })
      .setOrigin(0.5);

    this.animate();

    this.redVialHovered = false;
    this.yellowVialHovered = false;
    this.blueVialHovered = false;

    this.arrow_placement = 0;
    this.vial_placement = 0;
    this.timer = 1;

    this.userInput();

    this.enterPressed = false;
    this.vialNotEmpty = true;

    this.decreasing = false;
    this.hovered = false;

    this.tryOne = true;
    this.tryTwo = false;

    this.beakerColor = "";

    this.redVialNotEmpty = true;
    this.blueVialNotEmpty = true;
    this.yellowVialNotEmpty = true;
  }

  update() {
    this.playAnims();
    if (this.lose === true) {
      if (this.fail) {
        if (this.failScale <= 1) {
          this.failTimer++;
          this.failScale += 0.2 / this.failTimer;
          this.fail.setScale(this.failScale);
          this.gameOver = true;
        }
      }
    }
    if (this.victory === true) {
      if (this.safe) {
        if (this.safeScale <= 1) {
          this.safeTimer++;
          this.safeScale += 0.2 / this.safeTimer;
          this.safe.setScale(this.safeScale);
          this.gameOver = true;
          this.victory = true;
        }
      }
    }
    if (this.timer > 50) {
      this.decreasing = true;
    }
    if (this.timer < 1) {
      this.decreasing = false;
    }

    if (this.decreasing) {
      this.timer--;
      this.arrow.y++;
    } else {
      this.timer++;
      this.arrow.y--;
    }

    if (Phaser.Input.Keyboard.JustDown(this.left) && this.arrow_placement > 0) {
      this.arrow_placement--;
    } else if (
      Phaser.Input.Keyboard.JustDown(this.right) &&
      this.arrow_placement < 2
    ) {
      this.arrow_placement++;
    }

    var liftHeight = 613;
    var dropHeight = 680;
    this.vialSelection(liftHeight, dropHeight);

    if (this.gameOver && !this.sent) {
      eventsCenter.emit('game-end', this.victory)
      console.log('emission sent')
      this.sent = true
    }
  }

  vialSelection(liftHeight, dropHeight) {
    switch (this.arrow_placement) {
      case 0:
        this.arrow.x = this.redVial.x;
        this.redVialHovered = true;
        this.blueVialHovered = false;
        this.yellowVialHovered = false;
        this.enterPressed = Phaser.Input.Keyboard.JustDown(this.enter);
        this.vialPouring();
        this.time.delayedCall(
          0,
          this.setVialHeight,
          [
            liftHeight,
            dropHeight,
            this.redVialHovered,
            this.yellowVialHovered,
            this.blueVialHovered,
            this.redVial,
            this.yellowVial,
            this.blueVial,
          ],
          this
        );
        this.playAnims;
        this.enterPressed = false;
        return;
      case 1:
        this.arrow.x = this.blueVial.x;
        this.redVialHovered = false;
        this.blueVialHovered = true;
        this.yellowVialHovered = false;
        this.enterPressed = Phaser.Input.Keyboard.JustDown(this.enter);
        this.vialPouring();
        this.time.delayedCall(
          0,
          this.setVialHeight,
          [
            liftHeight,
            dropHeight,
            this.blueVialHovered,
            this.redVialHovered,
            this.yellowVialHovered,
            this.blueVial,
            this.redVial,
            this.yellowVial,
          ],
          this
        );
        this.playAnims;
        this.enterPressed = false;
        return;
      case 2:
        this.arrow.x = this.yellowVial.x;
        this.redVialHovered = false;
        this.blueVialHovered = false;
        this.yellowVialHovered = true;
        this.enterPressed = Phaser.Input.Keyboard.JustDown(this.enter);
        this.vialPouring();
        this.time.delayedCall(
          0,
          this.setVialHeight,
          [
            liftHeight,
            dropHeight,
            this.yellowVialHovered,
            this.redVialHovered,
            this.blueVialHovered,
            this.yellowVial,
            this.redVial,
            this.blueVial,
          ],
          this
        );
        this.playAnims;
        this.enterPressed = false;
        return;

      default:
        0;
    }
  }

  userInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  createSprites() {
    this.mix = this.physics.add
      .sprite(490, 100, "prompt box")
      .setScale(0.75)
      .setOrigin(0.5);
    this.redVial = this.physics.add
      .sprite(653, 680, "red vial")
      .setScale(0.45)
      .setOrigin(1);
    this.blueVial = this.physics.add
      .sprite(790, 680, "blue vial")
      .setScale(0.45)
      .setOrigin(1);
    this.yellowVial = this.physics.add
      .sprite(927, 680, "yellow vial")
      .setScale(0.45)
      .setOrigin(1);
    this.beaker = this.physics.add
      .sprite(400, 680, "empty beaker")
      .setScale(0.8)
      .setOrigin(1);
    this.arrow = this.physics.add
      .sprite(653, 430, "arrow")
      .setScale(0.5)
      .setOrigin(1);
  }

  loadSpriteSheets() {
    this.load.spritesheet(
      "red vial",
      new URL("../8Bitties/assets/colorlab/redvialsprites.png", import.meta.url)
        .href,
      { frameWidth: 270, frameHeight: 367 }
    );

    this.load.spritesheet(
      "blue vial",
      new URL(
        "../8Bitties/assets/colorlab/bluevialsprites.png",
        import.meta.url
      ).href,
      { frameWidth: 270, frameHeight: 367 }
    );

    this.load.spritesheet(
      "yellow vial",
      new URL(
        "../8Bitties/assets/colorlab/yellowvialsprites.png",
        import.meta.url
      ).href,
      { frameWidth: 270, frameHeight: 367 }
    );

    //beaker sprites
    this.load.spritesheet(
      "red beaker",
      new URL("../8Bitties/assets/colorlab/beakerred.png", import.meta.url)
        .href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "blue beaker",
      new URL("../8Bitties/assets/colorlab/beakerblue.png", import.meta.url)
        .href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "yellow beaker",
      new URL("../8Bitties/assets/colorlab/beakeryellow.png", import.meta.url)
        .href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "purple beaker",
      new URL(
        "../8Bitties/assets/colorlab/purplebeakersprites.png",
        import.meta.url
      ).href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "green beaker",
      new URL(
        "../8Bitties/assets/colorlab/greenbeakersprites.png",
        import.meta.url
      ).href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "orange beaker",
      new URL(
        "../8Bitties/assets/colorlab/orangebeakersprites.png",
        import.meta.url
      ).href,
      {
        frameWidth: 463,
        frameHeight: 558,
      }
    );

    this.load.spritesheet(
      "empty vial",
      new URL("../8Bitties/assets/colorlab/emptyvial.png", import.meta.url)
        .href,
      {
        frameWidth: 270,
        frameHeight: 368,
      }
    );

    //explosion sprite
    this.load.spritesheet(
      "explosion",
      new URL(
        "../8Bitties/assets/colorlab/explosionsprites.png",
        import.meta.url
      ).href,
      {
        frameWidth: 420,
        frameHeight: 420,
      }
    );
  }

  animate() {
    //red vial
    this.anims.create({
      key: "red vial anim",
      frames: [
        { key: "red vial", frame: 0 },
        { key: "red vial", frame: 1 },
        { key: "red vial", frame: 2 },
        { key: "red vial", frame: 3 },
        { key: "red vial", frame: 4 },
        { key: "red vial", frame: 5 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    //blue vial
    this.anims.create({
      key: "blue vial anim",
      frames: [
        { key: "blue vial", frame: 0 },
        { key: "blue vial", frame: 1 },
        { key: "blue vial", frame: 2 },
        { key: "blue vial", frame: 3 },
        { key: "blue vial", frame: 4 },
        { key: "blue vial", frame: 5 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    //yellow vial
    this.anims.create({
      key: "yellow vial anim",
      frames: [
        { key: "yellow vial", frame: 0 },
        { key: "yellow vial", frame: 1 },
        { key: "yellow vial", frame: 2 },
        { key: "yellow vial", frame: 3 },
        { key: "yellow vial", frame: 4 },
        { key: "yellow vial", frame: 5 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    //empty vial
    this.anims.create({
      key: "emptyvial anim",
      frames: [{ key: "empty vial", frame: 0 }],
      frameRate: 10,
      repeat: -1,
    });

    //red beaker
    this.anims.create({
      key: "redbeaker anim",
      frames: [
        { key: "red beaker", frame: 0 },
        { key: "red beaker", frame: 1 },
        { key: "red beaker", frame: 2 },
        { key: "red beaker", frame: 3 },
        { key: "red beaker", frame: 4 },
        { key: "red beaker", frame: 5 },
        { key: "red beaker", frame: 6 },
        { key: "red beaker", frame: 7 },
        { key: "red beaker", frame: 8 },
        { key: "red beaker", frame: 9 },
        { key: "red beaker", frame: 10 },
        { key: "red beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //blue beaker
    this.anims.create({
      key: "bluebeaker anim",
      frames: [
        { key: "blue beaker", frame: 0 },
        { key: "blue beaker", frame: 1 },
        { key: "blue beaker", frame: 2 },
        { key: "blue beaker", frame: 3 },
        { key: "blue beaker", frame: 4 },
        { key: "blue beaker", frame: 5 },
        { key: "blue beaker", frame: 6 },
        { key: "blue beaker", frame: 7 },
        { key: "blue beaker", frame: 8 },
        { key: "blue beaker", frame: 9 },
        { key: "blue beaker", frame: 10 },
        { key: "blue beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //yellow beaker
    this.anims.create({
      key: "yellowbeaker anim",
      frames: [
        { key: "yellow beaker", frame: 0 },
        { key: "yellow beaker", frame: 1 },
        { key: "yellow beaker", frame: 2 },
        { key: "yellow beaker", frame: 3 },
        { key: "yellow beaker", frame: 4 },
        { key: "yellow beaker", frame: 5 },
        { key: "yellow beaker", frame: 6 },
        { key: "yellow beaker", frame: 7 },
        { key: "yellow beaker", frame: 8 },
        { key: "yellow beaker", frame: 9 },
        { key: "yellow beaker", frame: 10 },
        { key: "yellow beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //purple beaker
    this.anims.create({
      key: "purplebeaker anim",
      frames: [
        { key: "purple beaker", frame: 0 },
        { key: "purple beaker", frame: 1 },
        { key: "purple beaker", frame: 2 },
        { key: "purple beaker", frame: 3 },
        { key: "purple beaker", frame: 4 },
        { key: "purple beaker", frame: 5 },
        { key: "purple beaker", frame: 6 },
        { key: "purple beaker", frame: 7 },
        { key: "purple beaker", frame: 8 },
        { key: "purple beaker", frame: 9 },
        { key: "purple beaker", frame: 10 },
        { key: "purple beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //green beaker
    this.anims.create({
      key: "greenbeaker anim",
      frames: [
        { key: "green beaker", frame: 0 },
        { key: "green beaker", frame: 1 },
        { key: "green beaker", frame: 2 },
        { key: "green beaker", frame: 3 },
        { key: "green beaker", frame: 4 },
        { key: "green beaker", frame: 5 },
        { key: "green beaker", frame: 6 },
        { key: "green beaker", frame: 7 },
        { key: "green beaker", frame: 8 },
        { key: "green beaker", frame: 9 },
        { key: "green beaker", frame: 10 },
        { key: "green beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //orange beaker
    this.anims.create({
      key: "orangebeaker anim",
      frames: [
        { key: "orange beaker", frame: 0 },
        { key: "orange beaker", frame: 1 },
        { key: "orange beaker", frame: 2 },
        { key: "orange beaker", frame: 3 },
        { key: "orange beaker", frame: 4 },
        { key: "orange beaker", frame: 5 },
        { key: "orange beaker", frame: 6 },
        { key: "orange beaker", frame: 7 },
        { key: "orange beaker", frame: 8 },
        { key: "orange beaker", frame: 9 },
        { key: "orange beaker", frame: 10 },
        { key: "orange beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //explosion
    this.anims.create({
      key: "explosion anim",
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
        { key: "explosion", frame: 10 },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }

  playAnims() {
    if (this.redVialNotEmpty) this.redVial.anims.play("red vial anim", true);
    if (this.blueVialNotEmpty) this.blueVial.anims.play("blue vial anim", true);
    if (this.yellowVialNotEmpty)
      this.yellowVial.anims.play("yellow vial anim", true);
  }

  setVialHeight(
    liftHeight,
    dropHeight,
    vialHovered,
    vialNotHovered1,
    vialNotHovered2,
    vial1,
    vial2,
    vial3
  ) {
    if (vialHovered) {
      vial1.setY(liftHeight);
      if (vialNotHovered1 === false) {
        vial2.setY(dropHeight);
      }
      if (vialNotHovered2 === false) {
        vial3.setY(dropHeight);
      }
    }
  }

  checkTries(myVial) {
    this.checkWin();
    myVial.anims.play("emptyvial anim", true);
    this.tryOne = false;
    this.tryTwo = true;
  }

  vialPouring() {
    if (this.tryOne) {
      if (this.redVialHovered && this.enterPressed && this.redVialNotEmpty) {
        this.beaker.anims.play("redbeaker anim");
        this.beakerColor = "red";
        this.redVialNotEmpty = false;
        this.checkTries(this.redVial);
      }
      if (this.blueVialHovered && this.enterPressed && this.blueVialNotEmpty) {
        this.beaker.anims.play("bluebeaker anim");
        this.beakerColor = "blue";
        this.blueVialNotEmpty = false;
        this.checkTries(this.blueVial);
      }
      if (
        this.yellowVialHovered &&
        this.enterPressed &&
        this.yellowVialNotEmpty
      ) {
        this.beaker.anims.play("yellowbeaker anim");
        this.beakerColor = "yellow";
        this.yellowVialNotEmpty = false;
        this.checkTries(this.yellowVial);
      }
    }
    if (this.tryTwo) {
      if (this.redVialHovered && this.enterPressed && this.redVialNotEmpty) {
        this.beakerColor === "yellow"
          ? this.beaker.anims.play("orangebeaker anim")
          : this.beaker.anims.play("purplebeaker anim");
        this.beakerColor === "yellow"
          ? (this.beakerColor = "Mix Orange")
          : (this.beakerColor = "Mix Purple");
        this.redVialNotEmpty = false;
        this.redVial.anims.play("emptyvial anim");
        this.checkWin();
      }
      if (this.blueVialHovered && this.enterPressed && this.blueVialNotEmpty) {
        this.beakerColor === "red"
          ? this.beaker.anims.play("purplebeaker anim")
          : this.beaker.anims.play("greenbeaker anim");
        this.beakerColor === "red"
          ? (this.beakerColor = "Mix Purple")
          : (this.beakerColor = "Mix Green");
        this.blueVialNotEmpty = false;
        this.blueVial.anims.play("emptyvial anim");
        this.checkWin();
      }
      if (
        this.yellowVialHovered &&
        this.enterPressed &&
        this.yellowVialNotEmpty
      ) {
        this.beakerColor === "blue"
          ? this.beaker.anims.play("greenbeaker anim")
          : this.beaker.anims.play("orangebeaker anim");
        this.beakerColor === "blue"
          ? (this.beakerColor = "Mix Green")
          : (this.beakerColor = "Mix Orange");
        this.yellowVialNotEmpty = false;
        this.yellowVial.anims.play("emptyvial anim");
        this.checkWin();
      }
    }
  }

  checkWin() {
    if (this.tryOne) {
      if (this.beakerColor === "red" && this.finalColor === "Mix Green") {
        // console.log('You lost!');
        this.youLose();
        this.playFail();
      }
      if (this.beakerColor === "blue" && this.finalColor === "Mix Orange") {
        // console.log('You lost!');
        this.youLose();
        this.playFail();
      }
      if (this.beakerColor === "yellow" && this.finalColor === "Mix Purple") {
        // console.log('You lost!');
        this.youLose();
        this.playFail();
      }
    }
    if (this.tryTwo && this.beakerColor !== this.finalColor) {
      // console.log('You lost!');
      this.youLose();
      this.playFail();
    }
    if (this.tryTwo && this.beakerColor == this.finalColor) {
      this.youWin();
      this.playSafe();
    }
    return false;
  }

  youLose() {
    this.beaker.setPosition(540, 360).setOrigin(0.5);
    this.beaker.anims.play("explosion anim", true).setScale(2);
    this.enter = false;
    this.left = false;
    this.right = false;
    this.lose = true;
    this.destroySprites();
  }

  youWin() {
    // console.log("you win")
    this.arrow.setVisible(false);
    this.enter = false;
    this.left = false;
    this.right = false;
    this.victory = true;
  }

  destroySprites() {
    this.redVial.setVisible(false);
    this.blueVial.setVisible(false);
    this.yellowVial.setVisible(false);
    this.arrow.setVisible(false);
    this.mix.setVisible(false);
    this.promptText.setVisible(false);
  }

  playSafe() {
    if (this.createImage === false) {
      this.safe = this.add.image(540, 360, "safe").setDepth(100);
      this.createImage = true;
      // console.log('created')
    }
  }

  playFail() {
    if (this.createImage === false) {
      this.fail = this.add.image(540, 360, "fail").setDepth(100);
      this.createImage = true;
    }
  }
}
