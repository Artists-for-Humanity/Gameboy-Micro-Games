import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';

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
        this.ground;
        this.fly;
        this.delayTime;
        this.randomNum = Math.floor(Math.random() * 3);
        this.victory = false;
        this.gameOver = false;
        this.sent = false;
        this.started = false;
        this.buttonHandlers = new ButtonPressHandlers();
        this.gamePad = null;
        // this.gamestarted = false;

    }
    preload() {
        this.load.spritesheet("frogs", new URL("./assets/frogJump/frogs.png",
            import.meta.url).href, {
            frameWidth: 46,
            frameHeight: 38
        });

        this.load.spritesheet('platform', new URL("./assets/frogJump/fleafsheet.png",
            import.meta.url).href, {
            frameWidth: 332,
            frameHeight: 163
        });
        this.load.spritesheet("fly", new URL("./assets/frogJump/fly.png",
            import.meta.url).href, {
            frameWidth: 299,
            frameHeight: 160
        });
        this.load.image('sky', new URL("./assets/frogJump/bkg2.png",
            import.meta.url).href);
        this.load.image('jump1', new URL("./assets/frogJump/frogjump1.png",
            import.meta.url).href);
        this.load.image('jump2', new URL("./assets/frogJump/frogjump2.png",
            import.meta.url).href);
        this.load.image('ground', new URL("./assets/frogJump/bigplatform.png",
            import.meta.url).href);
        this.load.image('Jump', new URL("./assets/frogJump/Jump.png",
            import.meta.url).href);
        this.load.image('TIFJwin', new URL("./assets/frogJump/win.png",
            import.meta.url).href);
        this.load.image('TIFJlose', new URL("./assets/frogJump/youlosefrog.png",
            import.meta.url).href);

    }
    create() {
        this.setfrogJump()
        // this.gamestarted = true;
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "sky");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);

        // this.generatePlatform(this.randomNum);
        this.generatePlatform(this.randomNum);
        this.ground = this.physics.add.sprite(530, 685, 'ground');
        this.ground.setScale(1.25, .75);
        this.ground.setImmovable(true);

        this.playerSprite = this.physics.add.sprite(500, 620, 'frogs');


        this.playerSprite.setCollideWorldBounds(false);
        this.playerSprite.body.setGravityY(700);

        console.log(this.playerSprite);


        this.loseText = this.add.image(240, 290, 'TIFJlose');
        this.loseText.setScrollFactor(0);
        this.loseText.setOrigin(0, 0);
        this.loseText.setVisible(false);

        this.winText = this.add.image(240, 220, 'TIFJwin');
        this.winText.setOrigin(0, 0);
        this.winText.setScrollFactor(0);
        this.winText.setVisible(false);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.grounds = this.physics.add.staticGroup();
        // this.grounds.create(1080, 820, 'ground').setScale(5).refreshBody();
        this.createAnimation();

        this.physics.add.collider(this.playerSprite, this.platforms, this.offGroundMethod, null, this);
        this.physics.add.collider(this.playerSprite, this.grounds, this.testGroundCollide, null, this);
        this.physics.add.collider(this.playerSprite, this.ground);
        this.physics.add.overlap(this.playerSprite, this.fly, this.destroyFly, null, this);
        this.cam = this.cameras.main;
        this.cam.setBounds(0, -500, 1080, 1220);
        this.cameras.main.startFollow(this.playerSprite);

        eventsCenter.on('start_game', () => {
            this.started = true;
            eventsCenter.emit('start_timer');
        });

        //this.delayedEvent = this.time.delayedCall(this.delayTime, this.loseState, [], this);
        //this.physics.pause();
        //this.JumpImg = this.add.image(505, 360, 'Jump').setScale(1.3);
        //this.startGameDelay = this.time.delayedCall(2000, this.startGame, null, this);
    }
    update() {
        if (this.started) {
            this.platforms.getChildren().forEach((platform) => {
                platform.anims.play('idleLeaf', true);
            });


            this.fly.anims.play('flying', true);

            if (this.playerSprite.x >= 1064) this.playerSprite.x = 1064;
            if (this.playerSprite.x <= 16) this.playerSprite.x = 16;

            this.buttonHandlers.update();
            if (!this.gamePad) {
                this.startGamePad();
            }


            this.fall();
            this.buttonHandlers.update();



            this.background.tilePositionY = this.cameras.main.scrollY * 0.3;

            if (this.gameOver && !this.sent) {
                eventsCenter.emit('stop_timer');
                eventsCenter.emit('game-end', this.victory);
                this.sent = true;
            }
            this.updatePlayer();
        }
    }

    startGamePad() {
        if (this.input.gamepad.total) {
            this.gamePad = this.input.gamepad.pad1;
            this.initGamePad();
        }
    }

    initGamePad() {
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.updatePlayer(0));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => {
            this.updatePlayer(1);
        });
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.updatePlayer(2));
        // this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 1, () => this.updatePlayer(3));
        this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.updatePlayer(3); });

    }

    updatePlayer(x) {
        if (x === 0) {
            this.walk(true);
        } else if (x === 1) {
            this.walk(false);
        } else if (x === 2) {
            this.playerSprite.setVelocityX(0);
            if (this.playerSprite.body.touching.down) {
                this.playerSprite.anims.play('turn');
            }
        }
        if (x === 3 && this.playerSprite.body.touching.down) {
            this.playerSprite.anims.play('jump');
            this.playerSprite.setVelocityY(-600 * 1.2);
        }


    }
    generatePlatform(level) {
        this.platforms = this.physics.add.staticGroup();
        if (level === 0) {

            this.platforms.create(500, 450, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(720, 250, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(0, 30, "platform").setScale(1.5, 0.2).refreshBody();
            this.platforms.create(500, 150, "platform").setScale(0.2).refreshBody();
            this.fly = this.physics.add.sprite(150, -5, 'fly').setScale(0.2, 0.2);
            this.delayTime = 10000;
        } else if (level === 1) {
            console.log('reach me 01');
            this.platforms.create(680, 450, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(535, 250, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(250, 150, "platform").setScale(0.2).refreshBody();
            this.platforms.create(440, -60, "platform").setScale(0.2).refreshBody();
            this.platforms.create(680, -150, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(890, 1, "platform").setScale(0.2).refreshBody();
            this.platforms.create(910, 75, "platform").setScale(0.2).refreshBody();
            this.platforms.create(980, 75, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(850, 75, 'platform').setScale(0.2).refreshBody();
            this.fly = this.physics.add.sprite(900, 40, 'fly').setScale(0.2, 0.2);
            this.delayTime = 13000;
        } else {
            console.log('reach me 02');

            this.platforms.create(40, 450, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(800, 430, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(1040, 200, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(700, 230, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(600, 150, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(500, 110, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(360, 200, 'platform').setScale(0.2).refreshBody();
            this.platforms.create(620, 30, 'platform').setScale(1, 0.2).refreshBody();
            this.platforms.create(900, -30, 'platform').setScale(0.2).refreshBody();
            this.fly = this.physics.add.sprite(1050, 170, 'fly').setScale(0.2, 0.2);
            this.delayTime = 14000;
        }
    }

    destroyFly(playerSprite, fly) {
        // fly.destroy();
        this.fly.setVisible(false);
        //this.winText.setVisible(true);
        this.winState = true;
        this.victory = true;
        this.gameOver = true;
        // this.physics.pause();
    }

    loseState() {
        if (this.winState === false) {
            this.loseText.setVisible(true);
            this.gameOver = true;
            this.game = true;
            // this.physics.pause();
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

        this.anims.create({
            key: 'flying',
            frames: [{
                key: 'fly',
                frame: 0
            },
            {
                key: 'fly',
                frame: 1
            },
            {
                key: 'fly',
                frame: 2
            },
            {
                key: 'fly',
                frame: 3
            },
            {
                key: 'fly',
                frame: 4
            },
            {
                key: 'fly',
                frame: 5
            }
            ],
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'idleLeaf',
            frames: [{
                key: 'platform',
                frame: 0
            },
            {
                key: 'platform',
                frame: 1
            },
            {
                key: 'platform',
                frame: 2
            }
            ],
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'frogs',
                frame: 3
            }],
            frameRate: -1,
        });

        this.anims.create({
            key: 'walk',
            frames: [{
                key: 'frogs',
                frame: 0
            },
            {
                key: 'frogs',
                frame: 1
            },
            {
                key: 'frogs',
                frame: 2
            }
            ],
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: [{
                key: 'jump1'
            }],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{
                key: 'jump1'
            },
            {
                key: 'jump2'
            }
            ],
            frameRate: 12,
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

    fall() {
        if (this.playerSprite.body.velocity.y > 0) {
            this.playerSprite.anims.play('fall');
        }
    }

    setfrogJump(){
        this.delayed = false;
        this.winState = false;
        this.offGround = false;
        this.randomNum = Math.floor(Math.random() * 3);
        this.victory = false;
        this.gameOver = false;
        this.sent = false;
        this.started = false;
        this.buttonHandlers = new ButtonPressHandlers();
        this.gamePad = null;
    }


    walk(left_down) {
        let v = 160 * 1.2;

        if (left_down) {
            v *= -1;
        }

        this.playerSprite.setVelocityX(v);

        if (left_down) {
            this.playerSprite.flipX = true;
        } else {
            this.playerSprite.flipX = false;
        }

        if (this.playerSprite.body.touching.down) {
            this.playerSprite.anims.play('walk', true);
        }
    }

}