export default class FrogJump extends Phaser.Scene {
    

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'FrogJump',
        });

        this.myText;
        this.keySpace;
        this.delayed = false;
        this.winState = false;
        this.offGround = false;
        this.background;
        this.loseText;
        this.winText;
        this.cursors;
        this.grounds;
        this.playerSprite;
        this.cam;
        this.delayedEvent;
        this.JumpImg;
        this.startGameDelay;
        this.platforms;
        this.stars;
        this.delayTime;
        this.randomNum = Math.floor(Math.random() * 3);

    }
    preload() {
        this.load.spritesheet("frogs", new URL("./assets/frogs.png",
            import.meta.url).href, {
            frameWidth: 46,
            frameHeight: 38
        });
        this.load.image('sky', new URL("./assets/bkg2.png",
            import.meta.url).href);
        this.load.image('jump1', new URL("./assets/frog_jump_1.png",
            import.meta.url).href);
        this.load.image('jump2', new URL("./assets/frog_jump_2.png",
            import.meta.url).href);
        this.load.image('ground', new URL("./assets/FillerAssets/platform.png",
            import.meta.url).href);
        this.load.image('star', new URL("./assets/FillerAssets/star.png",
            import.meta.url).href);
        this.load.image('Jump', new URL("./assets/Jump.png",
            import.meta.url).href);
            this.load.image('win', new URL("./assets/win!.png",
            import.meta.url).href);
            this.load.image('lose', new URL("./assets/lose.png",
            import.meta.url).href);
        
    }
    create() {

        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "sky");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);

        this.generatePlatform(this.randomNum);

        this.playerSprite = this.physics.add.sprite(500, 620, 'frogs');

       
        this.playerSprite.setCollideWorldBounds(false);
        this.playerSprite.body.setGravityY(700);



        this.loseText = this.add.image(240, 290,'lose')
        this.loseText.setScrollFactor(0);
        this.loseText.setOrigin(0,0);
        this.loseText.setVisible(false);

        this.winText = this.add.image(240, 220,'win');
        this.winText.setOrigin(0,0);
        this.winText.setScrollFactor(0);
        this.winText.setVisible(false);
       
        this.cursors = this.input.keyboard.createCursorKeys();
        this.grounds = this.physics.add.staticGroup();
        this.grounds.create(1080, 820, 'ground').setScale(11).refreshBody();


        

        this.createAnimation();

        this.physics.add.collider(this.playerSprite, this.platforms, this.offGroundMethod, null, this);
        this.physics.add.collider(this.playerSprite, this.grounds, this.testGroundCollide, null, this);
        this.physics.add.overlap(this.playerSprite, this.stars, this.destroyStar, null, this);
        this.cam = this.cameras.main;
        this.cam.setBounds(0, -500, 1080, 1220);
        this.cameras.main.startFollow(this.playerSprite);

        this.delayedEvent = this.time.delayedCall(this.delayTime, this.loseState, [], this);
        this.physics.pause();
        this.JumpImg = this.add.image(505, 360, 'Jump').setScale(1.3);
        this.startGameDelay = this.time.delayedCall(2000, this.startGame, null, this);
    }

    generatePlatform(level) {
        if(level === 0) {
            this.platforms = this.physics.add.staticGroup();
            this.platforms.create(500, 450, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(720, 250, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(0, 30, "ground").setScale(1.5,0.2).refreshBody();
            this.platforms.create(500, 150, "ground").setScale(0.2).refreshBody();
            this.stars = this.physics.add.group();
            this.stars.create(150, -5, 'star');
            this.delayTime = 10000;
        }
        else if(level === 1) {
            this.platforms = this.physics.add.staticGroup();
            this.platforms.create(680, 450, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(535, 250, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(250, 150, "ground").setScale(0.2).refreshBody();
            this.platforms.create(440, -60, "ground").setScale(0.2).refreshBody();
            this.platforms.create(680, -150, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(900, 5, "ground").setScale(0.2).refreshBody();
            this.platforms.create(900, 75, "ground").setScale(0.2).refreshBody();
            this.platforms.create(980, 75, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(850, 75, 'ground').setScale(0.2).refreshBody();
            this.stars = this.physics.add.group();
            this.stars.create(900, 40, 'star');
            this.delayTime = 13000;
        }
        else {
            this.platforms = this.physics.add.staticGroup();
            this.platforms.create(40, 450, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(800, 430, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(1090, 200, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(700, 230, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(600, 150, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(500, 110, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(360, 200, 'ground').setScale(0.2).refreshBody();
            this.platforms.create(620, 30, 'ground').setScale(1, 0.2).refreshBody();
            this.platforms.create(900, -30, 'ground').setScale(0.2).refreshBody();
            this.stars = this.physics.add.group();
            this.stars.create(1070, 180, 'star');
            this.delayTime = 14000;
        }
    }

    update() {   
        if (this.playerSprite.x >= 1064) this.playerSprite.x = 1064;
        if(this.playerSprite.x <= 16) this.playerSprite.x = 16;

        if (this.cursors.left.isDown) {
            this.walk(true)
        } else if (this.cursors.right.isDown) {
            this.walk(false)
        } 
        else {
            this.playerSprite.setVelocityX(0);
            if(this.playerSprite.body.touching.down){
                this.playerSprite.anims.play('turn');
            }
        }
        this.fall()

        if (this.cursors.up.isDown && this.playerSprite.body.touching.down) {
            this.playerSprite.anims.play('jump')
            this.playerSprite.setVelocityY(-600);
        }
        this.background.tilePositionY = this.cameras.main.scrollY * 0.3;
    }

    destroyStar(playerSprite, star) {
        star.destroy();
        this.winText.setVisible(true);
        this.winState = true;
        this.physics.pause();
    }

    loseState() {
        if (this.winState === false) {
            this.loseText.setVisible(true);
            this.physics.pause();
        }
    }

    offGroundMethod() {
        if (this.offGround === false) {
            this.offGround = true;
        }
    }

    testGroundCollide() {
        // if (this.offGround === true) {
        //     this.physics.pause();
        //     this.loseText.setVisible(true);
        // }
    }

    startGame() {
        this.JumpImg.destroy();
        this.physics.resume();

    }

    createAnimation() {
        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('frogs', {
        //         start: 0,
        //         end: 1
        //     }),
        //     frameRate: 10,
        //     repeat: -1,
        // });

        this.anims.create({
            key: 'turn',
            frames: [
                {key: 'frogs', frame: 3}
            ],
            frameRate: -1,
        });

        this.anims.create({
            key: 'walk',
            frames: [
                {key: 'frogs', frame: 0},
                {key: 'frogs', frame: 1},
                {key: 'frogs', frame: 2}
            ],
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: [
                {key: 'jump1'}
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [
                {key: 'jump1'},
                {key: 'jump2'}
            ],
            frameRate:12,
            repeat: 0
        });


        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('frogs', {
        //         start: 1,
        //         end: 2
        //     }),
        //     frameRate: 10,
        //     repeat: -1,
        // });
        
    }

    fall(){
        if(this.playerSprite.body.velocity.y > 0){
            this.playerSprite.anims.play('fall')
        }
    }


    walk(left_down){
        let v = 160

        if(left_down){
            v *= -1
        }

        this.playerSprite.setVelocityX(v);
        
        if(left_down){
                this.playerSprite.flipX = true;
        } else{
            this.playerSprite.flipX = false;
        }
        
        if(this.playerSprite.body.touching.down){
            this.playerSprite.anims.play('walk', true);
        }
    }

}