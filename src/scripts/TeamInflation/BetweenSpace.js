import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from '../ButtonPressHandlers';

export default class BetweenSpace extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "BetweenSpace",
    });
    this.lose = false;
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.randomNum = Math.floor(Math.random() * 71);

    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {

    this.load.image('TI_3background', new URL("./assets/spaceBKG.png",
      import.meta.url).href);
    this.load.image('TI_3win', new URL("./assets/youwin.png",
      import.meta.url).href);
    this.load.image('TI_3lose', new URL("./assets/losetext.png",
      import.meta.url).href);

    this.load.spritesheet("TI_3asteroid", new URL("./assets/asteroidspritesheet.png",
      import.meta.url).href, {
      frameWidth: 68,
      frameHeight: 64
    });
    this.load.spritesheet("TI_3rocket", new URL("./assets/rocketsheetfire.png",
      import.meta.url).href, {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("TI_3star", new URL("./assets/wormholespritesheet.png",
      import.meta.url).href, {
      frameWidth: 38,
      frameHeight: 38
    });
    
    this.add.audio(
      'TI_3explosionSound',
      new URL('./assets/Explode16bit.wav', import.meta.url).href
    );
    this.add.audio(
      'TI_3rocketSound',
      new URL('./assets/ship engine.wav', import.meta.url).href
    );





  }

  create() {
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, "TI_3background");
    this.player = this.physics.add.sprite(100, 360, "TI_3rocket");
    this.player.setCollideWorldBounds();
    this.goal = this.physics.add.sprite(1000, 360, 'TI_3star');


    this.asteroidg1 = this.createAsteroids(200, 32, 30 + (this.randomNum), 300);
    this.asteroidg2 = this.createAsteroids(300, 688, -30 + (this.randomNum), -300);

    this.asteroidg1 = this.createAsteroids(200, 32, 30 + this.randomNum, 300);
    this.asteroidg2 = this.createAsteroids(
      300,
      688,
      -30 + this.randomNum,
      -300
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(
      this.player,
      this.asteroidg1,
      this.loseState,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.asteroidg2,
      this.loseState,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.goal,
      this.destroyStar,
      null,
      this
    );

    this.createAnimations();

    this.loseText = this.add.image(168, 224, 'TI_3lose');
    this.loseText.setScrollFactor(0);
    this.loseText.setOrigin(0, 0);
    this.loseText.setVisible(false);

    this.winText = this.add.image(220, 224, 'TI_3win');
    this.winText.setOrigin(0, 0);
    this.winText.setScrollFactor(0);
    this.winText.setVisible(false);

    eventsCenter.on('start_game', () => { this.started = true; eventsCenter.emit('start_timer'); });

  }

  update() {
    if (this.started) {

      if (this.lose === false) {

        this.buttonHandlers.update();
        if (!this.gamePad) this.startGamePad();

        this.asteroidMovements(this.asteroidg1);
        this.asteroidMovements(this.asteroidg2);
        console.log('reachme 00');


        this.player.anims.play('TI_3run', true);
        console.log('reachme 01');

        this.goal.anims.play('TI_3spin', true);
        console.log('reachme 02');

      }


    }
    if (this.gameOver && !this.sent) {
      eventsCenter.emit('stop_timer');
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    }
  }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.userInput(1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === -1, () => this.userInput(11));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.userInput(-1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 1, () => this.userInput(-11));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.5, () => this.userInput(-2));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 1, () => this.userInput(-22));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.5, () => this.userInput(2));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === -1, () => this.userInput(22));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.userInput(3));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 0, () => this.userInput(4));

  }

  userInput(x) {
    if (x === 2) {
      this.player.setVelocityY(-350);
    }
    if (x === 22) {
      this.player.setVelocityY(-500);
    }
    if (x === -2) {
      this.player.setVelocityY(350);
    }
    if (x === -22) {
      this.player.setVelocityY(500);
    }
    if (x === 1) {
      this.player.setVelocityX(-350);
    }
    if (x === 11) {
      this.player.setVelocityX(-500);
    }
    if (x === -1) {
      this.player.setVelocityX(350);
    }
    if (x === -11) {
      this.player.setVelocityX(500);
    }
    if (x === 3) {
      this.player.setVelocityX(0);
    }
    if (x === 4) {
      this.player.setVelocityY(0);
    }
  }

  loseState() {
    this.physics.pause();
    this.lose = true;
    this.loseText.setVisible(true);
    this.gameOver = true;
  }

  createAsteroids(xPos, yPos, step, veloc) {
    const ret = this.physics.add.group({

      key: 'TI_3asteroid',
      repeat: 3,
      setXY: {
        x: xPos,
        y: yPos,
        stepX: 200,
        stepY: step,
      },
    });

    Phaser.Actions.Call(ret.getChildren(), (child) => {
      child.setVelocityY(veloc);
    });
    Phaser.Actions.Call(ret.getChildren(), (child) => {
      child.rotation = Math.PI / 2;
      child.setSize(40, 40);
    });
    return ret;
  }

  destroyStar() {
    this.goal.destroy();
    // this.physics.pause();
    this.lose = true;
    this.winText.setVisible(true);
    this.gameOver = true;
    this.victory = true;
  }

  asteroidMovements(groupRet) {
    Phaser.Actions.Call(groupRet.getChildren(), (child) => {
      if (child.y >= 688) {
        child.flipX = true;
        child.body.setVelocityY(-300);
      } else if (child.y <= 32) {
        child.flipX = false;
        child.body.setVelocityY(300);
      }
    });
    Phaser.Actions.Call(groupRet.getChildren(), child => {
      child.anims.play('TI_3walk', true);

    });
  }
  createAnimations() {
    this.anims.create({
      key: "TI_3walk",
      frames: [
        { key: "TI_3asteroid", frame: 0 },
        { key: "TI_3asteroid", frame: 1 },
        { key: "TI_3asteroid", frame: 2 },
        { key: "TI_3asteroid", frame: 4 },
        { key: "TI_3asteroid", frame: 5 },
        { key: "TI_3asteroid", frame: 6 },
        { key: "TI_3asteroid", frame: 8 },
        { key: "TI_3asteroid", frame: 9 },
        { key: "TI_3asteroid", frame: 10 },
        { key: "TI_3asteroid", frame: 12 },
        { key: "TI_3asteroid", frame: 13 },
      ],
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "TIBSrun",
      frames: [
        { key: "TI_3rocket", frame: 0 },
        { key: "TI_3rocket", frame: 1 },
        { key: "TI_3rocket", frame: 2 },
        { key: "TI_3rocket", frame: 3 },
      ],
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "TIBSspin",
      frames: [
        { key: "TI_3star", frame: 0 },
        { key: "TI_3star", frame: 1 },
        { key: "TI_3star", frame: 2 },
        { key: "TI_3star", frame: 3 },

      ],
      frameRate: 7,
      repeat: -1,
    });
  }
}
