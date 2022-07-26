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

    }
    preload() {
        this.load.spritesheet("dude", new URL("./assets/FillerAssets/dude.png", import.meta.url).href, { frameWidth: 32, frameHeight: 48});
        this.load.image('sky',new URL("./assets/FillerAssets/bckg.png", import.meta.url).href);
        this.load.image('ground', new URL("./assets/FillerAssets/platform.png", import.meta.url).href);
        
    }
    create() {
        this.background = this.add.tileSprite(0, 0, 1080, 720, "sky");
        this.background.setOrigin(0,0);
        this.background.setScrollFactor(0);
        
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
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(200, 820, 'ground').setScale(11).refreshBody();
            // this.platforms.create(200, 568, 'ground').setScale(0.2).refreshBody();

        this.platforms.create(500, 450, 'ground').setScale(0.2).refreshBody();
        // this.platforms.create(200, 250, 'ground').setScale(0.2).refreshBody();
        this.platforms.create(720, 250, 'ground').setScale(0.2).refreshBody();
        

        this.playerSprite = this.physics.add.sprite(500,600, 'dude');
        
        // this.playerSprite.setBounce(0.2);
        this.playerSprite.setCollideWorldBounds(false); 
        this.playerSprite.body.setGravityY(700);



        this.physics.add.collider(this.playerSprite, this.platforms);
        this.cam = this.cameras.main;
        this.cam.setBounds(0, -500, 1080, 1220);
        this.cameras.main.startFollow(this.playerSprite);
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