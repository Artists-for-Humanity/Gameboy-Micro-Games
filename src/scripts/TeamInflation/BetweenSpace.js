import eventsCenter from '../EventsCenter'

export default class BetweenSpace extends Phaser.Scene {


  constructor() {
    super({
      active: false,
      visible: false,
      key: 'BetweenSpace',
    });
    this.lose = false;
    this.gameOver = false;
    this.victory = false;
    this.randomNum = Math.floor(Math.random() * 71);


  }


  preload() {
    this.load.spritesheet(this.load.image('TIBSbackground', new URL("./assets/spaceBKG.png",
      import.meta.url).href));

    this.load.spritesheet("TIBSasteroid", new URL("./assets/asteroidspritesheet.png",
      import.meta.url).href, {
      frameWidth: 68,
      frameHeight: 64
    });
    this.load.spritesheet("TIBSrocket", new URL("./assets/rocket sheet fire.png",
      import.meta.url).href, {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("TIBSstar", new URL("./assets/wormhole sprite sheet.png",
      import.meta.url).href, {
      frameWidth: 38,
      frameHeight: 38
    });

    this.load.image('TIBSwin', new URL("./assets/you win_.png",
      import.meta.url).href);
    this.load.image('TIBSlose', new URL("./assets/losetext.png",
      import.meta.url).href);


  }

  create() {
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, "TIBSbackground");
    this.player = this.physics.add.sprite(100, 360, "TIBSrocket")
    this.player.setCollideWorldBounds();
    this.goal = this.physics.add.sprite(1000, 360, 'TIBSstar');


    this.asteroidg1 = this.createAsteroids(200, 32, 30 + (this.randomNum), 300)
    this.asteroidg2 = this.createAsteroids(300, 688, -30 + (this.randomNum), -300)


    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.asteroidg1, this.loseState, null, this);
    this.physics.add.collider(this.player, this.asteroidg2, this.loseState, null, this);
    this.physics.add.overlap(this.player, this.goal, this.destroyStar, null, this);

    this.createAnimations();

    this.loseText = this.add.image(168, 224, 'TIBSlose')
    this.loseText.setScrollFactor(0);
    this.loseText.setOrigin(0, 0);
    this.loseText.setVisible(false);

    this.winText = this.add.image(220, 224, 'TIBSwin');
    this.winText.setOrigin(0, 0);
    this.winText.setScrollFactor(0);
    this.winText.setVisible(false);
  }

  update() {
    if (this.lose === false) {
      if (this.cursors.up.isDown) {
        this.player.y -= 5;
      }
      if (this.cursors.down.isDown) {
        this.player.y += 5;
      }
      if (this.cursors.left.isDown) {
        this.player.x -= 5;
      }
      if (this.cursors.right.isDown) {
        this.player.x += 5;

      }

      this.asteroidMovements(this.asteroidg1);
      this.asteroidMovements(this.asteroidg2);


      this.player.anims.play('TIBSrun', true);
      this.goal.anims.play('TIBSspin', true)

    }
    if (this.gameOver && !this.sent) {
      eventsCenter.emit('game-end', this.victory)
      console.log('emission sent')
      this.sent = true
    }

  }

  loseState() {
    // this.physics.pause();
    this.lose = true;
    this.loseText.setVisible(true);
    this.gameOver = true;
  }

  createAsteroids(xPos, yPos, step, veloc) {
    const ret = this.physics.add.group({
      key: 'TIBSasteroid',
      repeat: 3,
      setXY: {
        x: xPos,
        y: yPos,
        stepX: 200,
        stepY: step
      }
    })

    Phaser.Actions.Call(ret.getChildren(), child => {
      child.setVelocityY(veloc);

    });
    Phaser.Actions.Call(ret.getChildren(), child => {
      child.rotation = Math.PI / 2;
      child.setSize(40, 40)

    });
    return ret;
  }

  destroyStar() {
    this.goal.destroy();
    // this.physics.pause();
    this.lose = true;
    this.winText.setVisible(true)
    this.gameOver = true;
    this.victory = true;
  }

  asteroidMovements(groupRet) {
    Phaser.Actions.Call(groupRet.getChildren(), child => {
      if (child.y >= 688) {
        child.flipX = true;
        child.body.setVelocityY(-300);
      } else if (child.y <= 32) {
        child.flipX = false
        child.body.setVelocityY(300);
      }
    });
    Phaser.Actions.Call(groupRet.getChildren(), child => {
      child.anims.play('TIBSwalk', true);

    });
  }
  createAnimations() {
    this.anims.create({
      key: 'TIBSwalk',
      frames: [{
        key: 'TIBSasteroid',
        frame: 0
      },
      {
        key: 'TIBSasteroid',
        frame: 1
      },
      {
        key: 'TIBSasteroid',
        frame: 2
      },
      {
        key: 'TIBSasteroid',
        frame: 4
      },
      {
        key: 'TIBSasteroid',
        frame: 5
      },
      {
        key: 'TIBSasteroid',
        frame: 6
      },
      {
        key: 'TIBSasteroid',
        frame: 8
      },
      {
        key: 'TIBSasteroid',
        frame: 9
      },
      {
        key: 'TIBSasteroid',
        frame: 10
      },
      {
        key: 'TIBSasteroid',
        frame: 12
      },
      {
        key: 'TIBSasteroid',
        frame: 13
      },

      ],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'TIBSrun',
      frames: [{
        key: 'TIBSrocket',
        frame: 0
      },
      {
        key: 'TIBSrocket',
        frame: 1
      },
      {
        key: 'TIBSrocket',
        frame: 2
      },
      {
        key: 'TIBSrocket',
        frame: 3
      },


      ],
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: 'TIBSspin',
      frames: [{
        key: 'TIBSstar',
        frame: 0
      },
      {
        key: 'TIBSstar',
        frame: 1
      },
      {
        key: 'TIBSstar',
        frame: 2
      },
      {
        key: 'TIBSstar',
        frame: 3
      },


      ],
      frameRate: 7,
      repeat: -1
    });
  }

}