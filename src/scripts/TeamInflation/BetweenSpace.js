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
    this.load.spritesheet(this.load.image('background', new URL("./assets/spaceBKG.png",
      import.meta.url).href));

    this.load.spritesheet("asteroid", new URL("./assets/asteroidspritesheet.png",
      import.meta.url).href, {
      frameWidth: 68,
      frameHeight: 64
    });
    this.load.spritesheet("rocket", new URL("./assets/rocket sheet fire.png",
      import.meta.url).href, {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("star", new URL("./assets/wormhole sprite sheet.png",
      import.meta.url).href, {
      frameWidth: 38,
      frameHeight: 38
    });

    this.load.image('win', new URL("./assets/you win_.png",
      import.meta.url).href);
    this.load.image('lose', new URL("./assets/losetext.png",
      import.meta.url).href);


  }

  create() {
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, "background");
    this.player = this.physics.add.sprite(100, 360, "rocket")
    this.player.setCollideWorldBounds();
    this.goal = this.physics.add.sprite(1000, 360, 'star');


    this.asteroidg1 = this.createAsteroids(200, 32, 30 + (this.randomNum), 300)
    this.asteroidg2 = this.createAsteroids(300, 688, -30 + (this.randomNum), -300)


    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.asteroidg1, this.loseState, null, this);
    this.physics.add.collider(this.player, this.asteroidg2, this.loseState, null, this);
    this.physics.add.overlap(this.player, this.goal, this.destroyStar, null, this);

    this.createAnimations();

    this.loseText = this.add.image(168, 224, 'lose')
    this.loseText.setScrollFactor(0);
    this.loseText.setOrigin(0, 0);
    this.loseText.setVisible(false);

    this.winText = this.add.image(220, 224, 'win');
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


      this.player.anims.play('run', true);
      this.goal.anims.play('spin',true)

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
      key: 'asteroid',
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
    this.physics.pause();
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
      child.anims.play('walk', true);

    });
  }
  createAnimations() {
    this.anims.create({
      key: 'walk',
      frames: [{
          key: 'asteroid',
          frame: 0
        },
        {
          key: 'asteroid',
          frame: 1
        },
        {
          key: 'asteroid',
          frame: 2
        },
        {
          key: 'asteroid',
          frame: 4
        },
        {
          key: 'asteroid',
          frame: 5
        },
        {
          key: 'asteroid',
          frame: 6
        },
        {
          key: 'asteroid',
          frame: 8
        },
        {
          key: 'asteroid',
          frame: 9
        },
        {
          key: 'asteroid',
          frame: 10
        },
        {
          key: 'asteroid',
          frame: 12
        },
        {
          key: 'asteroid',
          frame: 13
        },

      ],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'run',
      frames: [{
          key: 'rocket',
          frame: 0
        },
        {
          key: 'rocket',
          frame: 1
        },
        {
          key: 'rocket',
          frame: 2
        },
        {
          key: 'rocket',
          frame: 3
        },


      ],
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: 'spin',
      frames: [{
          key: 'star',
          frame: 0
        },
        {
          key: 'star',
          frame: 1
        },
        {
          key: 'star',
          frame: 2
        },
        {
          key: 'star',
          frame: 3
        },


      ],
      frameRate: 7,
      repeat: -1
    });
  }

}