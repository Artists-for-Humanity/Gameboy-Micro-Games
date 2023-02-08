import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from '../ButtonPressHandlers';

export default class PenguinSlide extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "PenguinSlide",
    });

    // minigame globals
    this.lose = false;
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.startTimer = false;
    this.displayedPenguins = false;
    // custom properties
    this.penguinCount = Math.floor(Math.random() * 5) + 1;

    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {
    this.load.spritesheet("arrow", new URL("assets/arrow_sheet.png", import.meta.url).href, {
      frameWidth: 87,
      frameHeight: 77,
    });
    this.load.spritesheet("penguin", new URL("assets/penguins.png", import.meta.url).href, {
      frameWidth: 147,
      frameHeight: 125,
    });
    this.load.spritesheet("scorebox", new URL("assets/scorebox.png", import.meta.url).href, {
      frameWidth: 558 / 2,
      frameHeight: 172,
    });
    this.load.spritesheet("seal", new URL("assets/seal.png", import.meta.url).href, {
      frameWidth: 244,
      frameHeight: 142,
    });
    this.load.spritesheet("zzz", new URL("assets/zzz.png", import.meta.url).href, {
      frameWidth: 90,
      frameHeight: 94,
    });
    this.load.image("background", new URL("assets/background.png", import.meta.url).href);
    this.load.image("igloo", new URL("assets/igloo.png", import.meta.url).href);
  }

  create() {
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, "background").setOrigin(0.5);
    this.add.image(0, 209, 'igloo').setOrigin(0).setDepth(1);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createAnimations();
    this.currentGuess = 0;

    this.graphics = this.add.graphics();

    this.path = { t: 0, vec: new Phaser.Math.Vector2() };
    this.sealPath = { t: 0, vec: new Phaser.Math.Vector2() }

    const penguinCurvePoints = [
      new Phaser.Math.Vector2(168, 363),
      new Phaser.Math.Vector2(309, 342),
      new Phaser.Math.Vector2(618, 400),
      new Phaser.Math.Vector2(726, 787),
    ]

    const sealCurvePoints = [
      new Phaser.Math.Vector2(-130, 822),
      new Phaser.Math.Vector2(334, 232),
      new Phaser.Math.Vector2(800, 300),
      new Phaser.Math.Vector2(1035, 800),
    ]

    this.curve = new Phaser.Curves.CubicBezier(...penguinCurvePoints);
    this.sealCurve = new Phaser.Curves.CubicBezier(...sealCurvePoints);
    // this.loseText = this.add.image(168, 224, 'TI_3lose');
    // this.loseText.setScrollFactor(0);
    // this.loseText.setOrigin(0, 0);
    // this.loseText.setVisible(false);

    // this.winText = this.add.image(220, 224, 'TI_3win');
    // this.winText.setOrigin(0, 0);
    // this.winText.setScrollFactor(0);
    // this.winText.setVisible(false);

    eventsCenter.on('start_game', () => { this.started = true;});

    this.tweens.add({
      targets: this.path,
      delay: 5000,
      t: 1,
      ease: 'Quart.easeIn',
      duration: 1500,
      yoyo: false,
      repeat: this.penguinCount - 1,
      onComplete: () => {
        this.displayedPenguins = true;
      }
    });
    this.penguin = this.add.sprite(this.path.vec.x, this.path.vec.y, "penguin", 0).setDepth(0);

    this.scorebox = this.add.sprite(734, 318, 'scorebox', 0);
    this.scoreboxText = this.add.text(this.scorebox.getCenter().x, this.scorebox.getCenter().y, '0', {
      color: "#000",
      fontSize: "64px",
    }).setOrigin(0.5);

    this.seal = this.add.sprite(100, 1500, 'seal', 0).setAngle(-25);
    this.seal.flipX = true;
  }

  update() {
    if (this.started) {
      if (!this.gamePad) this.startGamePad();
      this.curve.getPoint(this.path.t, this.path.vec);
      this.penguin.setPosition(this.path.vec.x, this.path.vec.y);

      if (this.displayedPenguins && !this.startTimer) {
        this.scorebox.anims.play('scorebox-shift');
        this.startTimer = true;
        eventsCenter.emit('start_timer');
      }
      
      // this.displayPenguins(this.penguinCount);
      
      if (this.lose === false) {
        this.buttonHandlers.update();
        // if (!this.gamePad) this.startGamePad();
      }
    }
    if (this.gameOver && !this.sent) {
      eventsCenter.emit('stop_timer');
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    }
  }


  loseState() {
    this.physics.pause();
    this.lose = true;
    this.loseText.setVisible(true);
    this.gameOver = true;
  }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamepad();
    }
  }

  initGamepad() {
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 1, () => this.updateGuess(-1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === -1, () => this.updateGuess(1));
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => this.confirmGuess());
  }

  updateGuess(num) {
    this.currentGuess += num;
    this.scoreboxText.setText(this.currentGuess.toString());
  }

  confirmGuess() {
    if (this.currentGuess === this.penguinCount) {
      eventsCenter.emit('stop_timer');
      this.tweens.add({
        targets: this.sealPath,
        t: 1,
        duration: 1500,
        ease: 'Sine.easeInOut',
        yoyo: false,
        repeat: 1,
        onComplete: () => {
          this.victory = true;
          this.gameOver = true;
          eventsCenter.emit('game_end');
        },
        onUpdate: () => {
          this.sealCurve.getPoint(this.sealPath.t, this.sealPath.vec);
          this.seal.setPosition(this.sealPath.vec.x, this.sealPath.vec.y);
        }
      });
    }
  }

  createAnimations() {
    this.anims.create({
      key: 'scorebox-shift',
      frames: [
        { key: 'scorebox', frame: 0 },
        { key: 'scorebox', frame: 1 },
      ],
      frameRate: 2,
      repeat: -1,
    });
  }
}
