export default class BetweenSpace extends Phaser.Scene {
    

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'BetweenSpace',
        });
        this.lose = false;
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
    Phaser.Actions.Call(this.asteroid.getChildren(), child => {
      child.rotation = Math.PI/2;
      child.setSize(40,40)

  });
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
    }

    update() {
     
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
          // this.asteroid.anims.play('walk',true);
    }

        }

    loseState() {
      this.physics.pause();
      this.lose = true;
    }

    createAsteroids() {
    this.asteroid = this.physics.add.group()
    this.asteroid.create(200,32,'asteroid');
    this.asteroid.create(300,688,'asteroid');
    this.asteroid.create(400,32,'asteroid');
    this.asteroid.create(500,688,'asteroid');
    this.asteroid.create(600,32,'asteroid');
    this.asteroid.create(700,688,'asteroid');
    this.asteroid.create(800,32,'asteroid');
    this.asteroid.create(900,688,'asteroid');

    }

    destroyStar() {
      this.goal.destroy();
      this.physics.pause();
      this.lose = true;
    }

    }

    


