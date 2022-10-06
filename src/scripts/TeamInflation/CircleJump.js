import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';

export default class CircleJump extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: 'CircleJump',
    });

    this.player;
    this.ball;
    this.started = false;
    this.victory = false;
    this.gameOver = false;
    this.sent = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;

    this.bandaid = false;

  }

  preload() {
    this.load.image('TI_4background', new URL("./assets/CircleJump/circlebackground.png", import.meta.url).href);
    this.load.image('TI_4player', new URL("./assets/CircleJump/player.png", import.meta.url).href);
    this.load.image('TI_4lose', new URL("./assets/CircleJump/loser.png", import.meta.url).href);
    this.load.image('TI_4win', new URL("./assets/CircleJump/winner.png", import.meta.url).href);
    this.load.spritesheet("TI_4ball", new URL("./assets/CircleJump/ballSpriteSheet.png", import.meta.url).href,
      { frameWidth: 19, frameHeight: 19 });
    this.load.spritesheet("TI_4diamonds", new URL("./assets/CircleJump/diamond.png", import.meta.url).href,
      { frameWidth: 16, frameHeight: 16 });

  }

  create() {
    this.graphics = this.add.graphics({
      lineStyle: {
        width: 4,
        color: 0x00000
      },
      fillStyle: {
        color: 0x1110ba
      }
    });

    this.background = this.add.sprite(540, 360, "TI_4background");

    this.player = this.physics.add.sprite(550, 50, 'TI_4player').setScale(.10);
    this.player.setGravityY(500);
    this.player.body.setCircle(128, 400, 225);


    this.points = {
      x: 540,
      y: 500
    };

    this.cursors = this.input.keyboard.createCursorKeys();

    const circle = new Phaser.Geom.Circle(540, 500, 220);
    const circle2 = new Phaser.Geom.Circle(540, 500, 220);

    this.groupS = this.physics.add.group();
    this.groupB = this.physics.add.group();
    for (var i = 0; i < 11; i++) {
      this.groupS.create(0, 0, 'TI_4ball').setScale(2);
    }
    for (var i = 0; i < 5; i++) {
      this.groupB.create(0, 0, 'TI_4ball').setScale(2);
    }

    this.loseText = this.add.sprite(540, 360, 'TI_4lose').setVisible(false);
    this.winText = this.add.sprite(540, 360, 'TI_4win').setVisible(false);
    this.hole = this.physics.add.sprite(540, 500, 'TI_4diamonds').setVisible(true).setScale(2);
    this.physics.add.collider(this.player, this.hole, this.winState, null, this);
    this.physics.add.collider(this.player, this.groupS, this.loseState, null, this);
    this.physics.add.collider(this.player, this.groupB, this.loseState, null, this);

    Phaser.Actions.PlaceOnCircle(this.groupS.getChildren(), circle);
    Phaser.Actions.PlaceOnCircle(this.groupB.getChildren(), circle2);

    this.physics.pause();
    // this.JumpImg = this.add.image(505, 360, 'jump').setScale(1.3);
    //this.startGameDelay = this.time.delayedCall(2000, this.startGame, null, this);

    this.createAnimation();

    eventsCenter.on('start_game', () => { this.started = true; eventsCenter.emit('start_timer'); this.startGame(); });
    eventsCenter.on('end_circle', () => { this.bandaid = true; });

  }

  update() {
    if (this.started) {
      this.hole.anims.play('TI_4spin', true);

      this.groupB.getChildren().forEach((child) => {
        child.body.setCircle(6, 5, 5);
        child.anims.play('TI_4pulse', true);
      });

      this.groupS.getChildren().forEach((child) => {
        child.body.setCircle(6, 5, 5);
        child.anims.play('TI_4pulse', true);
      });

      Phaser.Actions.RotateAroundDistance(this.groupS.getChildren(), this.points, 0.02, 200);
      Phaser.Actions.RotateAroundDistance(this.groupB.getChildren(), this.points, 0.035, 70);

      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-200);
      }

      this.buttonHandlers.update();
      if (!this.gamePad) {
        this.startGamePad();
      }

      Phaser.Actions.Call(this.groupB.getChildren(), child => {
      });
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
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.updatePlayer(); });
  }

  updatePlayer() {
    this.player.setVelocityY(-200);
  }

  makeCircle(texture, radius, points, pointGroup) {
    let deg = 360 / points;
    let sum = 0;
    for (var i = 0; i < points; i++) {
      if (sum / 360 > 1) break;
      else {
        let radianDeg = this.degrees_to_radians(sum);
        let xPos = radius * Math.sin(radianDeg);
        let yPos = radius * Math.cos(radianDeg);
        pointGroup.create(xPos, yPos, texture).setScale(1).refreshBody();
      }
      sum += deg;
    }
  }

  winState() {
    // this.physics.pause();
    this.victory = true;
    this.gameOver = true;
    this.winText.setVisible(true);
    // this.hole.destroy();
  }

  createAnimation() {

    this.anims.create({
      key: 'TI_4pulse',
      frames: [{
        key: 'TI_4ball',
        frame: 0
      },
      {
        key: 'TI_4ball',
        frame: 1
      },
      {
        key: 'TI_4ball',
        frame: 2
      }
      ],
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'TI_4spin',
      frames: [{
        key: 'TI_4diamonds',
        frame: 0
      },
      {
        key: 'TI_4diamonds',
        frame: 1
      },
      {
        key: 'TI_4diamonds',
        frame: 2
      },
      {
        key: 'TI_4diamonds',
        frame: 3
      }
      ],
      frameRate: 8,
      repeat: -1
    });

  }

  degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
  loseState() {
    // this.physics.pause();
    this.gameOver = true;
    this.loseText.setVisible(true);
  }

  startGame() {
    if (!this.bandaid)
      this.physics.resume();
  }

}

