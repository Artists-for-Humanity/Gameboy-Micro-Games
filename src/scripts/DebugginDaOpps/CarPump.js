export default class CarPump extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "CarPump",
    });

    // Game Object Declarations
    this.gameState = true;
    this.gameOver = false;
    this.victory = false;
    this.startScreen;
    this.timedEvent;
    this.lever;
    this.car25;
    this.car50;
    this.car75;
    this.car100;
    this.pumpToWin = 20;
    this.playerPumps = 0;
    this.clickAvailable = true;
    this.clickTimer = 0;
    this.downWasPressed = false;
    this.upWasPressed = true;
  }

  preload() {
    this.load.image(
      "DO2_startScreen",
      new URL("./assets/startScreen.png", import.meta.url).href
    );
    this.load.image(
      "DO2_pumpgame_bg",
      new URL("./assets/pumpgame_background.png", import.meta.url).href
    );
    this.load.image(
      "DO2_gameOverScreen",
      new URL("./assets/game-over.png", import.meta.url).href
    );
    this.load.spritesheet(
      "DO2_lever",
      new URL("./assets/lever.png", import.meta.url).href,
      { frameWidth: 88, frameHeight: 162 }
    );
    this.load.spritesheet(
      "DO2_car25",
      new URL("./assets/25car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );
    this.load.spritesheet(
      "DO2_car50",
      new URL("./assets/50car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );

    this.load.spritesheet(
      "DO2_car75",
      new URL("./assets/75car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );

    this.load.spritesheet(
      "DO2_car100",
      new URL("./assets/100car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );
  }

  create() {
    this.add.image(1080 / 2, 720 / 2, "DO2_pumpgame_bg");
    this.lever = this.physics.add.sprite(955, 480, "DO2_lever");
    this.car25 = this.physics.add.sprite(540, 350, "DO2_car25");
    this.car50 = this.physics.add.sprite(540, 350, "DO2_car50");
    this.car75 = this.physics.add.sprite(540, 350, "DO2_car75");
    this.car100 = this.physics.add.sprite(540, 350, "DO2_car100");
    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO2_gameOverScreen"
    );
    this.tempBg = this.add.image(1080 / 2, 720 / 2, "DO2_startScreen");

    this.car50.visible = false;
    this.car75.visible = false;
    this.car100.visible = false;
    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);

    this.createAnimations();
    // console.log(this.load);

    this.globalState.initCountDown(this);
    // this.globalState.test();
  }

  createAnimations() {
    this.anims.create({
      key: "DO2_lever_up",
      frames: [
        { key: "DO2_lever", frame: 1 },
        { key: "DO2_lever", frame: 2 },
        { key: "DO2_lever", frame: 3 },
        { key: "DO2_lever", frame: 4 },
        { key: "DO2_lever", frame: 5 },
        { key: "DO2_lever", frame: 6 },
        { key: "DO2_lever", frame: 7 },
      ],
      frameRate: 30,
    });

    this.anims.create({
      key: "DO2_lever_down",
      frames: [
        { key: "DO2_lever", frame: 7 },
        { key: "DO2_lever", frame: 6 },
        { key: "DO2_lever", frame: 5 },
        { key: "DO2_lever", frame: 4 },
        { key: "DO2_lever", frame: 3 },
        { key: "DO2_lever", frame: 2 },
        { key: "DO2_lever", frame: 1 },
      ],
      frameRate: 30,
    });

    // Car animations
    this.anims.create({
      key: "DO2_car_inflate25%",
      frames: [
        { key: "DO2_car25", frame: 0 },
        { key: "DO2_car25", frame: 1 },
        { key: "DO2_car25", frame: 2 },
        { key: "DO2_car25", frame: 3 },
        { key: "DO2_car25", frame: 4 },
        { key: "DO2_car25", frame: 5 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO2_car_inflate50%",
      frames: [
        { key: "DO2_car50", frame: 0 },
        { key: "DO2_car50", frame: 1 },
        { key: "DO2_car50", frame: 2 },
        { key: "DO2_car50", frame: 3 },
        { key: "DO2_car50", frame: 4 },
        { key: "DO2_car50", frame: 5 },
        { key: "DO2_car50", frame: 6 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO2_car_inflate75%",
      frames: [
        { key: "DO2_car75", frame: 0 },
        { key: "DO2_car75", frame: 1 },
        { key: "DO2_car75", frame: 2 },
        { key: "DO2_car75", frame: 3 },
        { key: "DO2_car75", frame: 4 },
        { key: "DO2_car75", frame: 5 },
        { key: "DO2_car75", frame: 6 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO2_car_inflate100%",
      frames: [
        { key: "DO2_car100", frame: 0 },
        { key: "DO2_car100", frame: 1 },
        { key: "DO2_car100", frame: 2 },
        { key: "DO2_car100", frame: 3 },
        { key: "DO2_car100", frame: 4 },
        { key: "DO2_car100", frame: 5 },
        { key: "DO2_car100", frame: 6 },
      ],
      frameRate: 24,
    });
  }

  update(time, delta) {
    if (this.gameState) {
      this.clickTimer += delta;
      this.timerCountdown(time);
      if (this.clickTimer > 100) this.clickAvailable = true;
      if (this.cursors.up.isDown && this.downWasPressed) {
        this.downWasPressed = false;
        this.upWasPressed = true;
        this.lever.anims.play("DO2_lever_up", true);
      } else if (
        this.cursors.down.isDown &&
        this.upWasPressed &&
        this.clickAvailable
      ) {
        this.downWasPressed = true;
        this.upWasPressed = false;
        this.time.delayedCall(100, this.updatePump, [], this);
        this.clickAvailable = false;
        this.clickTimer = 0;
      }
    }
  }

  timerCountdown(time) {
    if (time / 1000 > 10 && this.playerPumps < this.pumpToWin) {
      this.gameState = false;
      this.gameOver = true;
      this.gameOverScreen.visible = true;
    }

    if (time / 1000 > 10 && this.playerPumps >= this.pumpToWin) {
      this.gameState = false;
      this.gameOver = true;
      this.victory = true;
      this.endText = this.add.text(300, 360, "You Won!");
      this.endText.setStyle({
        fontSize: "100px",
        fill: "#000000",
        align: "center",
      });
    }
  }

  updatePump() {
    this.playerPumps += 1;

    this.lever.anims.play("DO2_lever_down", true);
    if (this.playerPumps === 5) {
      this.car25.visible = true;
      this.car25.anims.play("DO2_car_inflate25%", true);
    }
    if (this.playerPumps === 10) {
      this.car50.visible = true;
      this.car50.anims.play("DO2_car_inflate50%", true);
      this.car25.visible = false;
    }
    if (this.playerPumps === 15) {
      this.car75.visible = true;
      this.car75.anims.play("DO2_car_inflate75%", true);
      this.car50.visible = false;
    }
    if (this.playerPumps === 20) {
      this.car100.visible = true;
      this.car100.anims.play("DO2_car_inflate100%", true);
      this.car75.visible = false;
    }
  }

  onEvent() {
    this.tempBg.visible = false;
  }
}
