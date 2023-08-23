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
    this.displayedAnimals = false;

    // number of penguins and seals to display, respectively
    this.penguinCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 penguins
    this.sealCount = Math.floor(Math.random() * 4); // 0 to 3 seals

    // this is an array of the potential animals (seal or penguin) and the order is randomized
    this.animals = (() => {
      let totalAnimals = [...(new Array(this.penguinCount).fill('penguin')), ...(new Array(this.sealCount).fill('seal'))];
      for (let i = totalAnimals.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [totalAnimals[i], totalAnimals[j]] = [totalAnimals[j], totalAnimals[i]];
      }
      return totalAnimals;
    })();
    this.animalTween = 0;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {
    this.load.spritesheet("arrow", new URL("assets/penguinSlide/arrow_sheet.png", import.meta.url).href, {
      frameWidth: 87,
      frameHeight: 77,
    });
    this.load.spritesheet("penguin", new URL("assets/penguinSlide/penguins.png", import.meta.url).href, {
      frameWidth: 147,
      frameHeight: 125,
    });
    this.load.spritesheet("scorebox", new URL("assets/penguinSlide/scorebox.png", import.meta.url).href, {
      frameWidth: 558 / 2,
      frameHeight: 172,
    });
    this.load.spritesheet("seal", new URL("assets/penguinSlide/seal.png", import.meta.url).href, {
      frameWidth: 244,
      frameHeight: 142,
    });
    this.load.spritesheet("zzz", new URL("assets/penguinSlide/zzz.png", import.meta.url).href, {
      frameWidth: 90,
      frameHeight: 94,
    });
    this.load.image("background", new URL("assets/penguinSlide/background.png", import.meta.url).href);
    this.load.image("igloo", new URL("assets/penguinSlide/igloo.png", import.meta.url).href);
    this.load.audio(
      'Peng_slip',
    new URL('assets/penguinSlide/slip.wav', import.meta.url).href
    );
  }

  create() {
    this.setPengSlide()
    this.makeNoise();
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, "background").setOrigin(0.5);
    this.igloo = this.add.image(0, 209, 'igloo').setOrigin(0).setDepth(1);
    // this.cursors = this.input.keyboard.createCursorKeys();

    this.createAnimations();
    this.currentGuess = 0;

    this.graphics = this.add.graphics();

    this.animalPath = { t: 0, vec: new Phaser.Math.Vector2() };
    this.victorySealPath = { t: 0, vec: new Phaser.Math.Vector2() }

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

    this.animalCurve = new Phaser.Curves.CubicBezier(...penguinCurvePoints);
    this.victorySealCurve = new Phaser.Curves.CubicBezier(...sealCurvePoints);
    // this.loseText = this.add.image(168, 224, 'TI_3lose');
    // this.loseText.setScrollFactor(0);
    // this.loseText.setOrigin(0, 0);
    // this.loseText.setVisible(false);

    // this.winText = this.add.image(220, 224, 'TI_3win');
    // this.winText.setOrigin(0, 0);
    // this.winText.setScrollFactor(0);
    // this.winText.setVisible(false);

    eventsCenter.on('start_game', () => { this.started = true; });
    this.tweens.add({
      targets: this.animalPath,
      delay: 5000,
      t: 1,
      ease: 'Sine.easeIn',
      duration: 1500,
      yoyo: false,
      repeat: this.animals.length - 1,
      onStart: () => {
        this.instructiveText.watch.setVisible(true);
        this.slipNoise.play({
          volume:1
        })
      },
      onRepeat: () => {
        this.slipNoise.play({
          volume:1
        })
        this.activeAnimal.setTexture(this.animals[this.animalTween]);
        if (this.activeAnimal.texture.key === 'seal') {
          this.activeAnimal.flipX = true;
        } else {
          this.activeAnimal.flipX = false;
        }
        this.animalTween++;
      },
      onUpdate: () => {
        if (this.activeAnimal.texture.key === 'seal') {
          if (this.activeAnimal.anims.isPlaying) {
            this.activeAnimal.anims.stop();
          }
          if (this.animalPath.t > 0.45) {
            this.activeAnimal.setAngle(0);
          } else if (this.animalPath.t > 0.65) {
            this.activeAnimal.setAngle(45)
          }
        } else if (this.activeAnimal.texture.key === 'penguin') {
          this.activeAnimal.setAngle(0);
          if (this.animalPath.t < 0.4) {
            this.activeAnimal.anims.play('penguin-walk')
          } else if (this.animalPath.t > 0.45 && this.animalPath.t < 0.48) {
            this.activeAnimal.anims.stopAfterRepeat();
            this.activeAnimal.setFrame(2);
          } else if (this.animalPath.t > 0.48) {
            this.activeAnimal.anims.stopAfterRepeat();
            this.activeAnimal.setFrame(3);
          }
        }
      },
      onComplete: () => {
        this.displayedAnimals = true;
      }
    });
    this.activeAnimal = this.add.sprite(this.animalPath.vec.x, this.animalPath.vec.y, "penguin", 0).setDepth(0);

    this.scorebox = this.add.sprite(734, 318, 'scorebox', 0);
    this.scoreboxText = this.add.text(this.scorebox.getCenter().x, this.scorebox.getCenter().y, '0', {
      color: "#000",
      fontSize: "64px",
    }).setOrigin(0.5);

    this.victorySeal = this.add.sprite(100, 1500, 'seal', 0).setAngle(-25);
    this.victorySeal.flipX = true;

    this.zzz = this.add.sprite(this.igloo.getRightCenter().x, this.igloo.getTopRight().y + (this.igloo.height / 4), 'zzz', 0).setOrigin(0, 1).setVisible(false);

    this.setupText();
  }

  update() {
    if (this.started) {
      if (!this.gamePad) this.startGamePad();
      this.animalCurve.getPoint(this.animalPath.t, this.animalPath.vec);
      this.activeAnimal.setPosition(this.animalPath.vec.x, this.animalPath.vec.y);

      if (this.displayedAnimals && !this.startTimer) {
        this.instructiveText.go.setVisible(true);
        this.instructiveText.watch.setVisible(false);
        this.scorebox.anims.play('scorebox-shift');
        this.startTimer = true;
        this.started = true;
        eventsCenter.emit('start_timer');
      } else if (!this.displayedAnimals) {
        eventsCenter.emit('reset_timer');
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
    if (this.displayedAnimals === true) {
      if (this.currentGuess === 0 && num < 0) {
        return; // if the current guess is 0 and the input is down do nothing
      }
      this.currentGuess += num;
      this.scoreboxText.setText(this.currentGuess.toString()); // otherwise, update the current guess
    }
  }

  confirmGuess() {
    if (this.currentGuess === this.penguinCount) {
      eventsCenter.emit('stop_timer');
      this.tweens.add({
        targets: this.victorySealPath,
        t: 1,
        duration: 1500,
        ease: 'Sine.easeOut',
        yoyo: false,
        repeat: 1,
        onComplete: () => {
          this.victory = true;
          this.gameOver = true;
          eventsCenter.emit('game_end');
        },
        onUpdate: () => {
          this.victorySealCurve.getPoint(this.victorySealPath.t, this.victorySealPath.vec);
          this.victorySeal.setPosition(this.victorySealPath.vec.x, this.victorySealPath.vec.y);

          // this can be optimized a bit
          if (this.victorySealPath.t < 0.25) {
            this.victorySeal.setAngle(-45);
          } else if (this.victorySealPath.t < 0.5) {
            this.victorySeal.setAngle(-25);
          } else if (this.victorySealPath.t > 0.4 && this.victorySealPath.t < 0.6) {
            this.victorySeal.setAngle(0);
          } else if (this.victorySealPath.t > 0.5) {
            this.victorySeal.setAngle(25);
          } else if (this.victorySealPath.t > 0.75) {
            this.victorySeal.setAngle(45)
          }
        }
      });
    } else {
      eventsCenter.emit('stop_timer');
      this.activeAnimal.setVisible(false);
      this.zzz.setVisible(true);
      this.zzz.anims.play('sleeping_igloo').once('animationcomplete', () => {
        this.gameOver = true;
        eventsCenter.emit('game_end');
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
    this.anims.create({
      key: 'penguin-walk',
      frames: [
        { key: 'penguin', frame: 0 },
        { key: 'penguin', frame: 1 },
      ],
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: 'penguin-slide',
      frames: [
        { key: 'penguin', frame: 2 },
        { key: 'penguin', frame: 3 },
      ],
      repeat: 0,
      frameRate: 2,
    })
    this.anims.create({
      key: 'sleeping_igloo',
      frames: [
        { key: 'zzz', frame: 0 },
        { key: 'zzz', frame: 1 },
        { key: 'zzz', frame: 2 },
        { key: 'zzz', frame: 3 },
      ],
      frameRate: 4,
      repeat: 3,
    });
  }

  setupText() {
    const watchText = this.add.text(540, 120, 'COUNT THE PENGUINS!', {
      fontSize: '48px',
      color: '#FFFFFF',
      align: 'center',
      // stroke: '#808080',
      // strokeThickness: 8,
    }).setVisible(false).setOrigin(0.5);
    const goText = this.add.text(540, 120, 'how many penguins were there?', {
      fontSize: '48px',
      color: '#FFFFFF',
      align: 'center',
    }).setVisible(false).setOrigin(0.5);

    const winText = this.add.text(540, 360, 'YOU WIN!', {
      fontSize: '160px',
      color: '#00FF00',
      align: 'center',
    }).setVisible(false).setOrigin(0.5);

    const loseText = this.add.text(540, 360, 'YOU LOSE!', {
      fontSize: '160px',
      color: '#FF0000',
      align: 'center'
    }).setVisible(false).setOrigin(0.5);

    this.instructiveText = {
      watch: watchText,
      go: goText,
      win: winText,
      lose: loseText,
    };
  }
  setPengSlide(){
    this.lose = false;
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.startTimer = false;
    this.displayedAnimals = false;

    // number of penguins and seals to display, respectively
    this.penguinCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 penguins
    this.sealCount = Math.floor(Math.random() * 4); // 0 to 3 seals

    // this is an array of the potential animals (seal or penguin) and the order is randomized
    this.animals = (() => {
      let totalAnimals = [...(new Array(this.penguinCount).fill('penguin')), ...(new Array(this.sealCount).fill('seal'))];
      for (let i = totalAnimals.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [totalAnimals[i], totalAnimals[j]] = [totalAnimals[j], totalAnimals[i]];
      }
      return totalAnimals;
    })();
    this.animalTween = 0;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  makeNoise(){
    this.slipNoise = this.sound.add('Peng_slip')
  }
}
