import WebFontFile from "../../scripts/WebFontFile";
import eventsCenter from '../EventsCenter';


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

    this.space;
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
      "8B2_empty beaker",
      new URL("../8Bitties/assets/colorlab/beakerempty.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B2_background",

      new URL("../8Bitties/assets/colorlab/sciencelabbg.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B2_arrow",

      new URL("../8Bitties/assets/colorlab/arrow.png", import.meta.url).href
    );
    this.load.image(
      "8B2_prompt box",
      new URL("../8Bitties/assets/colorlab/textbox.png", import.meta.url).href
    );
    this.load.image(
      "8B2_safe",
      new URL("../8Bitties/assets/colorlab/safe_text.png", import.meta.url).href
    );
    this.load.image(
      "8B2_fail",
      new URL("../8Bitties/assets/colorlab/fail_text.png", import.meta.url).href
    );

    this.loadSpriteSheets();
  }

  create() {
    this.background = this.add.image(540, 360, "8B2_background");

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

    this.spacePressed = false;
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
    if (this.gameOver && !this.sent) {
      eventsCenter.emit('stop_timer')
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    };

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

  }

  vialSelection(liftHeight, dropHeight) {
    switch (this.arrow_placement) {
      case 0:
        this.arrow.x = this.redVial.x;
        this.redVialHovered = true;
        this.blueVialHovered = false;
        this.yellowVialHovered = false;
        this.spacePressed = Phaser.Input.Keyboard.JustDown(this.space);
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
        this.spacePressed = false;
        return;
      case 1:
        this.arrow.x = this.blueVial.x;
        this.redVialHovered = false;
        this.blueVialHovered = true;
        this.yellowVialHovered = false;
        this.spacePressed = Phaser.Input.Keyboard.JustDown(this.space);
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
        this.spacePressed = false;
        return;
      case 2:
        this.arrow.x = this.yellowVial.x;
        this.redVialHovered = false;
        this.blueVialHovered = false;
        this.yellowVialHovered = true;
        this.spacePressed = Phaser.Input.Keyboard.JustDown(this.space);
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
        this.spacePressed = false;
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
    this.space = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  createSprites() {
    this.mix = this.physics.add
      .sprite(490, 100, "8B2_prompt box")
      .setScale(0.75)
      .setOrigin(0.5);
    this.redVial = this.physics.add
      .sprite(653, 680, "8B2_red vial")
      .setScale(0.45)
      .setOrigin(1);
    this.blueVial = this.physics.add
      .sprite(790, 680, "8B2_blue vial")
      .setScale(0.45)
      .setOrigin(1);
    this.yellowVial = this.physics.add
      .sprite(927, 680, "8B2_yellow vial")
      .setScale(0.45)
      .setOrigin(1);
    this.beaker = this.physics.add
      .sprite(400, 680, "8B2_empty beaker")
      .setScale(0.8)
      .setOrigin(1);
    this.arrow = this.physics.add
      .sprite(653, 430, "8B2_arrow")

      .setScale(0.5)
      .setOrigin(1);
  }

  loadSpriteSheets() {
    this.load.spritesheet(
      "8B2_red vial",
      new URL("../8Bitties/assets/colorlab/redvialsprites.png", import.meta.url)
        .href,
      { frameWidth: 270, frameHeight: 367 }
    );

    this.load.spritesheet(
      "8B2_blue vial",
      new URL(
        "../8Bitties/assets/colorlab/bluevialsprites.png",
        import.meta.url
      ).href,
      { frameWidth: 270, frameHeight: 367 }
    );

    this.load.spritesheet(
      "8B2_yellow vial",
      new URL(
        "../8Bitties/assets/colorlab/yellowvialsprites.png",
        import.meta.url
      ).href,
      { frameWidth: 270, frameHeight: 367 }
    );

    //beaker sprites
    this.load.spritesheet(
      "8B2_red beaker",
      new URL("../8Bitties/assets/colorlab/beakerred.png", import.meta.url)
        .href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "8B2_blue beaker",
      new URL("../8Bitties/assets/colorlab/beakerblue.png", import.meta.url)
        .href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "8B2_yellow beaker",
      new URL("../8Bitties/assets/colorlab/beakeryellow.png", import.meta.url)
        .href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "8B2_purple beaker",
      new URL(
        "../8Bitties/assets/colorlab/purplebeakersprites.png",
        import.meta.url
      ).href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "8B2_green beaker",
      new URL(
        "../8Bitties/assets/colorlab/greenbeakersprites.png",
        import.meta.url
      ).href,
      { frameWidth: 463, frameHeight: 558 }
    );

    this.load.spritesheet(
      "8B2_orange beaker",
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
      "8B2_empty vial",
      new URL("../8Bitties/assets/colorlab/emptyvial.png", import.meta.url)
        .href,
      {
        frameWidth: 270,
        frameHeight: 368,
      }
    );

    //explosion sprite
    this.load.spritesheet(
      "8B2_explosion",
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
      key: "8B2_redvial anim",
      frames: [
        { key: "8B2_red vial", frame: 0 },
        { key: "8B2_red vial", frame: 1 },
        { key: "8B2_red vial", frame: 2 },
        { key: "8B2_red vial", frame: 3 },
        { key: "8B2_red vial", frame: 4 },
        { key: "8B2_red vial", frame: 5 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    //blue vial
    this.anims.create({
      key: "8B2_bluevial anim",
      frames: [
        { key: "8B2_blue vial", frame: 0 },
        { key: "8B2_blue vial", frame: 1 },
        { key: "8B2_blue vial", frame: 2 },
        { key: "8B2_blue vial", frame: 3 },
        { key: "8B2_blue vial", frame: 4 },
        { key: "8B2_blue vial", frame: 5 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    //yellow vial
    this.anims.create({
      key: "8B2_yellowvial anim",
      frames: [
        { key: "8B2_yellow vial", frame: 0 },
        { key: "8B2_yellow vial", frame: 1 },
        { key: "8B2_yellow vial", frame: 2 },
        { key: "8B2_yellow vial", frame: 3 },
        { key: "8B2_yellow vial", frame: 4 },
        { key: "8B2_yellow vial", frame: 5 },
      ],
      frameRate: 8,
      repeat: -1,
    });

    //empty vial
    this.anims.create({
      key: "8B2_emptyvial anim",
      frames: [{ key: "8B2_empty vial", frame: 0 }],
      frameRate: 10,
      repeat: -1,
    });

    //red beaker
    this.anims.create({
      key: "8B2_redbeaker anim",
      frames: [
        { key: "8B2_red beaker", frame: 0 },
        { key: "8B2_red beaker", frame: 1 },
        { key: "8B2_red beaker", frame: 2 },
        { key: "8B2_red beaker", frame: 3 },
        { key: "8B2_red beaker", frame: 4 },
        { key: "8B2_red beaker", frame: 5 },
        { key: "8B2_red beaker", frame: 6 },
        { key: "8B2_red beaker", frame: 7 },
        { key: "8B2_red beaker", frame: 8 },
        { key: "8B2_red beaker", frame: 9 },
        { key: "8B2_red beaker", frame: 10 },
        { key: "8B2_red beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //blue beaker
    this.anims.create({
      key: "8B2_bluebeaker anim",
      frames: [
        { key: "8B2_blue beaker", frame: 0 },
        { key: "8B2_blue beaker", frame: 1 },
        { key: "8B2_blue beaker", frame: 2 },
        { key: "8B2_blue beaker", frame: 3 },
        { key: "8B2_blue beaker", frame: 4 },
        { key: "8B2_blue beaker", frame: 5 },
        { key: "8B2_blue beaker", frame: 6 },
        { key: "8B2_blue beaker", frame: 7 },
        { key: "8B2_blue beaker", frame: 8 },
        { key: "8B2_blue beaker", frame: 9 },
        { key: "8B2_blue beaker", frame: 10 },
        { key: "8B2_blue beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //yellow beaker
    this.anims.create({
      key: "8B2_yellowbeaker anim",
      frames: [
        { key: "8B2_yellow beaker", frame: 0 },
        { key: "8B2_yellow beaker", frame: 1 },
        { key: "8B2_yellow beaker", frame: 2 },
        { key: "8B2_yellow beaker", frame: 3 },
        { key: "8B2_yellow beaker", frame: 4 },
        { key: "8B2_yellow beaker", frame: 5 },
        { key: "8B2_yellow beaker", frame: 6 },
        { key: "8B2_yellow beaker", frame: 7 },
        { key: "8B2_yellow beaker", frame: 8 },
        { key: "8B2_yellow beaker", frame: 9 },
        { key: "8B2_yellow beaker", frame: 10 },
        { key: "8B2_yellow beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //purple beaker
    this.anims.create({
      key: "8B2_purplebeaker anim",
      frames: [
        { key: "8B2_purple beaker", frame: 0 },
        { key: "8B2_purple beaker", frame: 1 },
        { key: "8B2_purple beaker", frame: 2 },
        { key: "8B2_purple beaker", frame: 3 },
        { key: "8B2_purple beaker", frame: 4 },
        { key: "8B2_purple beaker", frame: 5 },
        { key: "8B2_purple beaker", frame: 6 },
        { key: "8B2_purple beaker", frame: 7 },
        { key: "8B2_purple beaker", frame: 8 },
        { key: "8B2_purple beaker", frame: 9 },
        { key: "8B2_purple beaker", frame: 10 },
        { key: "8B2_purple beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //green beaker
    this.anims.create({
      key: "8B2_greenbeaker anim",
      frames: [
        { key: "8B2_green beaker", frame: 0 },
        { key: "8B2_green beaker", frame: 1 },
        { key: "8B2_green beaker", frame: 2 },
        { key: "8B2_green beaker", frame: 3 },
        { key: "8B2_green beaker", frame: 4 },
        { key: "8B2_green beaker", frame: 5 },
        { key: "8B2_green beaker", frame: 6 },
        { key: "8B2_green beaker", frame: 7 },
        { key: "8B2_green beaker", frame: 8 },
        { key: "8B2_green beaker", frame: 9 },
        { key: "8B2_green beaker", frame: 10 },
        { key: "8B2_green beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //orange beaker
    this.anims.create({
      key: "8B2_orangebeaker anim",
      frames: [
        { key: "8B2_orange beaker", frame: 0 },
        { key: "8B2_orange beaker", frame: 1 },
        { key: "8B2_orange beaker", frame: 2 },
        { key: "8B2_orange beaker", frame: 3 },
        { key: "8B2_orange beaker", frame: 4 },
        { key: "8B2_orange beaker", frame: 5 },
        { key: "8B2_orange beaker", frame: 6 },
        { key: "8B2_orange beaker", frame: 7 },
        { key: "8B2_orange beaker", frame: 8 },
        { key: "8B2_orange beaker", frame: 9 },
        { key: "8B2_orange beaker", frame: 10 },
        { key: "8B2_orange beaker", frame: 11 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    //explosion
    this.anims.create({
      key: "8B2_explosion anim",
      frames: [
        { key: "8B2_explosion", frame: 0 },
        { key: "8B2_explosion", frame: 1 },
        { key: "8B2_explosion", frame: 2 },
        { key: "8B2_explosion", frame: 3 },
        { key: "8B2_explosion", frame: 4 },
        { key: "8B2_explosion", frame: 5 },
        { key: "8B2_explosion", frame: 6 },
        { key: "8B2_explosion", frame: 7 },
        { key: "8B2_explosion", frame: 8 },
        { key: "8B2_explosion", frame: 9 },
        { key: "8B2_explosion", frame: 10 },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }

  playAnims() {
    if (this.redVialNotEmpty) this.redVial.anims.play("8B2_redvial anim", true);
    if (this.blueVialNotEmpty) this.blueVial.anims.play("8B2_bluevial anim", true);
    if (this.yellowVialNotEmpty)
      this.yellowVial.anims.play("8B2_yellowvial anim", true);
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
    myVial.anims.play("8B2_emptyvial anim", true);
    this.tryOne = false;
    this.tryTwo = true;
  }

  vialPouring() {
    if (this.tryOne) {
      if (this.redVialHovered && this.spacePressed && this.redVialNotEmpty) {
        this.beaker.anims.play("8B2_redbeaker anim");
        this.beakerColor = "8B2_red";
        this.redVialNotEmpty = false;
        this.checkTries(this.redVial);
      }
      if (this.blueVialHovered && this.spacePressed && this.blueVialNotEmpty) {
        this.beaker.anims.play("8B2_bluebeaker anim");
        this.beakerColor = "8B2_blue";
        this.blueVialNotEmpty = false;
        this.checkTries(this.blueVial);
      }
      if (
        this.yellowVialHovered &&
        this.spacePressed &&
        this.yellowVialNotEmpty
      ) {
        this.beaker.anims.play("8B2_yellowbeaker anim");
        this.beakerColor = "8B2_yellow";
        this.yellowVialNotEmpty = false;
        this.checkTries(this.yellowVial);
      }
    }
    if (this.tryTwo) {
      if (this.redVialHovered && this.spacePressed && this.redVialNotEmpty) {
        this.beakerColor === "8B2_yellow"
          ? this.beaker.anims.play("8B2_orangebeaker anim")
          : this.beaker.anims.play("8B2_purplebeaker anim");
        this.beakerColor === "8B2_yellow"
          ? (this.beakerColor = "Mix Orange")
          : (this.beakerColor = "Mix Purple");
        this.redVialNotEmpty = false;
        this.redVial.anims.play("8B2_emptyvial anim");
        this.checkWin();
      }
      if (this.blueVialHovered && this.spacePressed && this.blueVialNotEmpty) {
        this.beakerColor === "8B2_red"
          ? this.beaker.anims.play("8B2_purplebeaker anim")
          : this.beaker.anims.play("8B2_greenbeaker anim");
        this.beakerColor === "8B2_red"
          ? (this.beakerColor = "Mix Purple")
          : (this.beakerColor = "Mix Green");
        this.blueVialNotEmpty = false;
        this.blueVial.anims.play("8B2_emptyvial anim");
        this.checkWin();
      }
      if (
        this.yellowVialHovered &&
        this.spacePressed &&
        this.yellowVialNotEmpty
      ) {
        this.beakerColor === "8B2_blue"
          ? this.beaker.anims.play("8B2_greenbeaker anim")
          : this.beaker.anims.play("8B2_orangebeaker anim");
        this.beakerColor === "8B2_blue"
          ? (this.beakerColor = "Mix Green")
          : (this.beakerColor = "Mix Orange");
        this.yellowVialNotEmpty = false;
        this.yellowVial.anims.play("8B2_emptyvial anim");
        this.checkWin();
      }
    }
  }

  checkWin() {
    if (this.tryOne) {
      if (this.beakerColor === "8B2_red" && this.finalColor === "Mix Green") {
        this.youLose();
        this.playFail();
      }
      if (this.beakerColor === "8B2_blue" && this.finalColor === "Mix Orange") {
        this.youLose();
        this.playFail();
      }
      if (this.beakerColor === "8B2_yellow" && this.finalColor === "Mix Purple") {
        this.youLose();
        this.playFail();
      }
    }
    if (this.tryTwo && this.beakerColor !== this.finalColor) {
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
    this.beaker.anims.play("8B2_explosion anim", true).setScale(2);
    this.space = false;
    this.left = false;
    this.right = false;
    this.lose = true;
    this.destroySprites();
  }

  youWin() {
    this.arrow.setVisible(false);
    this.space = false;
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
      this.safe = this.add.image(540, 360, "8B2_safe").setDepth(100);
      this.createImage = true;
    }
  }

  playFail() {
    if (this.createImage === false) {
      this.fail = this.add.image(540, 360, "8B2_fail").setDepth(100);
      this.createImage = true;
    }
  }
}
