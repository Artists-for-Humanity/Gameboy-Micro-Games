export default class FrogJump extends Phaser.Scene {
    // Game Class Constructor

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'FrogJump',
        });

        // Game Object Declarations
        this.myText;
        this.keySpace;
        this.delayed = false;
        this.winState = false;
        this.offGround = false;
        this.delayTime;


        


    }
    preload() {
        this.load.spritesheet("dude", new URL("./assets/FillerAssets/dude.png", import.meta.url).href, { frameWidth: 32, frameHeight: 48});
        this.load.image('sky',new URL("./assets/FillerAssets/bckg.png", import.meta.url).href);
        this.load.image('ground', new URL("./assets/FillerAssets/platform.png", import.meta.url).href);
        this.load.image('star', new URL("./assets/FillerAssets/star.png", import.meta.url).href);
        this.load.image('Jump', new URL("./assets/Jump.png", import.meta.url).href);
    }
    create() {
        

    
        this.background = this.add.tileSprite(0, 0, 1080, 720, "sky");
        this.background.setOrigin(0,0);
        this.background.setScrollFactor(0)


        this.loseText = this.add.text(330, 310)
        this.loseText.setText('You Lose');
        this.loseText.setStyle({
            fontSize: '100px',
            fill: '#00ff00'
        })
        this.loseText.setScrollFactor(0);

        this.loseText.setVisible(false);

        this.winText = this.add.text(330, 310)
        this.winText.setText('You Win');
        this.winText.setStyle({
            fontSize: '100px',
            fill: '#00ff00'
        })

        this.winText.setScrollFactor(0);

        this.winText.setVisible(false);

        
        
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20,
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.grounds = this.physics.add.staticGroup();
        this.grounds.create(200, 820, 'ground').setScale(11).refreshBody();
        this.generatePlatformV2();
            // this.platforms.create(200, 568, 'ground').setScale(0.2).refreshBody();

        
        
        
        

        this.playerSprite = this.physics.add.sprite(500,620, 'dude');
        
        // this.playerSprite.setBounce(0.2);
        this.playerSprite.setCollideWorldBounds(false); 
        this.playerSprite.body.setGravityY(700);



        this.physics.add.collider(this.playerSprite, this.platforms, this.offGroundMethod, null, this);
        this.physics.add.collider(this.playerSprite, this.grounds, this.testGroundCollide, null, this);
        this.physics.add.overlap(this.playerSprite, this.stars, this.destroyStar, null, this);
        this.cam = this.cameras.main;
        this.cam.setBounds(0, -500, 1080, 1220);
        this.cameras.main.startFollow(this.playerSprite);

        this.delayedEvent = this.time.delayedCall(this.delayTime, this.loseState, [], this);
        this.physics.pause();
        this.JumpImg = this.add.image(505,400, 'Jump');
        this.startGameDelay = this.time.delayedCall(2000, this.startGame, null, this);
        // this.setText();
    }

    generatePlatformV1(){

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(500, 450, 'ground').setScale(0.2).refreshBody();
        // this.platforms.create(200, 250, 'ground').setScale(0.2).refreshBody();
        this.platforms.create(720, 250, 'ground').setScale(0.2).refreshBody();
        this.platforms.create(0,30, "ground").setScale(1.5).refreshBody();
        this.platforms.create(500,150, "ground").setScale(0.2).refreshBody();
        this.stars = this.physics.add.group();
        this.stars.create(150,-20, 'star');
        this.delayTime = 8000;


    }

    generatePlatformV2(){

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(680, 450, 'ground').setScale(0.2).refreshBody();
        // this.platforms.create(200, 250, 'ground').setScale(0.2).refreshBody();
        this.platforms.create(535, 250, 'ground').setScale(0.2).refreshBody();
        // this.platforms.create(1300,30, "ground").setScale(1.5).refreshBody();
        this.platforms.create(250,150, "ground").setScale(0.2).refreshBody();
        this.platforms.create(440, -60, "ground").setScale(0.2).refreshBody();
        this.platforms.create(680, -150, 'ground').setScale(0.2).refreshBody();
        this.platforms.create(900, 5, "ground").setScale(0.2).refreshBody();
        this.platforms.create(900, 75, "ground").setScale(0.2).refreshBody();
        this.platforms.create(980, 75, 'ground').setScale(0.2).refreshBody();
        this.platforms.create(850,75, 'ground').setScale(0.2).refreshBody();
        this.stars = this.physics.add.group();
        this.stars.create(900,40,'star');
        this.delayTime = 10800;
    

    }

    update() {
        if (this.cursors.left.isDown)
    {
        this.playerSprite.setVelocityX(-160);

        this.playerSprite.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.playerSprite.setVelocityX(160);

        this.playerSprite.anims.play('right', true);
    }
    else
    {
        this.playerSprite.setVelocityX(0);

        this.playerSprite.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.playerSprite.body.touching.down)
    {
        this.playerSprite.setVelocityY(-600);
    }


    // this.background.tilePositionX = this.cameras.main.scrollX * .3;
    

    }
    destroyStar(playerSprite, star) {
        star.destroy()

        this.winText.setVisible(true);

        this.winState = true;
        
        this.physics.pause();
    }

    loseState(scene) {
        if(this.winState === false) {
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
        if(this.offGround === true) {
            this.physics.pause();
            this.loseText.setVisible(true);
        }
    }

    startGame() {
        this.JumpImg.destroy()
        this.physics.resume();
        
    }



    setText() {
        // this.myText = this.add.text(275, 360, '')
        // this.myText.setStyle({
        //     fontSize: '100px',
        //     fill: '#000000',
        //     align: 'center',
        // });
        // this.myText.setText('8Bitties');
    }



    
    
}