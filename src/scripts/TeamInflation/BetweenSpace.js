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
        

        preload(){
    this.load.spritesheet(this.load.image('background', new URL("./assets/spaceBKG.png",
        import.meta.url).href));
        
        this.load.spritesheet("asteroid", new URL("./assets/asteroidspritesheet.png",
            import.meta.url).href, {
            frameWidth: 68,
            frameHeight: 64
        });
        this.load.spritesheet("rocket", new URL("./assets/rocketPH.png",
            import.meta.url).href, {
            frameWidth: 416,
            frameHeight: 416 
        });
        this.load.image(this.load.image('star', new URL("./assets/frogJump/starPH.png",
            import.meta.url).href));

        this.load.image('win', new URL("./assets/frogJump/win.png",
            import.meta.url).href);
        this.load.image('lose', new URL("./assets/frogJump/youlosefrog.png",
            import.meta.url).href);
        
        
    }

    create(){
      this.gameWidth = this.game.config.width;
      this.gameHeight = this.game.config.height;
    this.add.image(this.gameWidth/2, this.gameHeight/2, "background");
    this.player = this.physics.add.sprite(100,360, "rocket")
    this.player.setSize(50, 50)
    this.player.setCollideWorldBounds();
    this.goal = this.physics.add.sprite(1000,360,'star');
    this.createAsteroids();
    this.createAsteroids2();
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.asteroid, this.loseState, null, this);
    this.physics.add.overlap(this.player, this.goal, this.destroyStar, null, this);



    

    this.anims.create({
        key: 'walk',
        frames: [
            {key: 'asteroid', frame: 0},
            {key: 'asteroid', frame: 1},
            {key: 'asteroid', frame: 2},
            {key: 'asteroid', frame: 4},
            {key: 'asteroid', frame: 5},
            {key: 'asteroid', frame: 6},
            {key: 'asteroid', frame: 8},
            {key: 'asteroid', frame: 9},
            {key: 'asteroid', frame: 10},
            {key: 'asteroid', frame: 12},
            {key: 'asteroid', frame: 13},
          
        ],
        frameRate: 30,
        repeat: -1
    });

    
    this.loseText = this.add.image(240, 290,'lose')
    this.loseText.setScrollFactor(0);
    this.loseText.setOrigin(0,0);
    this.loseText.setVisible(false);

    this.winText = this.add.image(240, 220,'win');
    this.winText.setOrigin(0,0);
    this.winText.setScrollFactor(0);
    this.winText.setVisible(false);
    }

    update() {
     console.log(this.victory, this.gameOver)
      if(this.lose === false){
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
      
          // if(this.asteroid.y >= 688) {
          //   this.asteroid.flipX = true;
          //   this.asteroid.body.setVelocityY(-300);
          // }
          // else if(this.asteroid.y <= 32) {
          //   this.asteroid.flipX = false
          //   this.asteroid.body.setVelocityY(300);
          // }

          
          // this.asteroid.anims.play('walk',true);
          this.asteroidMovements();
    }

        }

    loseState() {
      this.physics.pause();
      this.lose = true;
      this.loseText.setVisible(true);
      this.gameOver = true;
    }

    createAsteroids() {
      this.asteroid = this.physics.add.group({
        key: 'asteroid',
        repeat: 3,
        setXY: { x: 200, y: 32, stepX: 200, stepY: 30 + (this.randomNum) }
    })
    // this.asteroid.create(200,32,'asteroid');
    // this.asteroid.create(400,32,'asteroid');
    // this.asteroid.create(600,32,'asteroid');
    // this.asteroid.create(800,32,'asteroid');
    Phaser.Actions.Call(this.asteroid.getChildren(), child => {
      child.setVelocityY(300);

    });
    Phaser.Actions.Call(this.asteroid.getChildren(), child => {
      child.rotation = Math.PI/2;
      child.setSize(40,40)

  });
    }
    createAsteroids2() {
      this.asteroid2 = this.physics.add.group({
        key: 'asteroid',
        repeat: 3,
        setXY: { x: 300, y: 688, stepX: 200, stepY: -30 - (this.randomNum)}
    })
      // this.asteroid2.create(300,688,'asteroid');
      // this.asteroid2.create(500,688,'asteroid');
      // this.asteroid2.create(700,688,'asteroid');
      // this.asteroid2.create(900,688,'asteroid');
      Phaser.Actions.Call(this.asteroid2.getChildren(), child => {
        child.setVelocityY(-300);
  
      });
      Phaser.Actions.Call(this.asteroid2.getChildren(), child => {
        child.rotation = Math.PI/2;
        child.setSize(40,40)
  
    });
    }

    destroyStar() {
      this.goal.destroy();
      this.physics.pause();
      this.lose = true;
      this.winText.setVisible(true)
      this.gameOver = true;
      this.victory = true;
    }

    asteroidMovements() {
      Phaser.Actions.Call(this.asteroid.getChildren(), child => {
        if(child.y >= 688) {
          child.flipX = true;
          child.body.setVelocityY(-300);
        }
        else if(child.y <= 32) {
          child.flipX = false
          child.body.setVelocityY(300);
        }
    });
    Phaser.Actions.Call(this.asteroid.getChildren(), child => {
      child.anims.play('walk',true);

  });
  Phaser.Actions.Call(this.asteroid2.getChildren(), child => {
    if(child.y >= 688) {
      child.flipX = true;
      child.body.setVelocityY(-300);
    }
    else if(child.y <= 32) {
      child.flipX = false
      child.body.setVelocityY(300);
    }
});
Phaser.Actions.Call(this.asteroid2.getChildren(), child => {
  child.anims.play('walk',true);

});
    }

    }

    


