export default class MicroGame22 extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame22',
        });

        // Game Object Declarations
        this.background;
        this.table;
        this.cat;
        this.cheese;
        this.cup;
        this.eyebeams;
        this.plates;
        this.laser;
        this.hitbox1;
        this.hitbox2;
        this.mouse;
        
        this.Left;
        this.Right;

        this.side = 0;
        this.sweeping = false;
        this.gameover = false;
    }

    preload() {
        this.load.image('background', new URL('assets/HideFromCat/background.png',
            import.meta.url).href);
        this.load.image('table', new URL('assets/HideFromCat/table.png',
            import.meta.url).href);
        this.load.image('cat', new URL('assets/HideFromCat/cat.png',
            import.meta.url).href);
        this.load.image('eyes', new URL('assets/HideFromCat/eyes.png',
            import.meta.url).href);
        this.load.image('cheese', new URL('assets/HideFromCat/cheese.png',
            import.meta.url).href);
        this.load.image('cup', new URL('assets/HideFromCat/cup.png',
            import.meta.url).href);
        this.load.image('plates', new URL('assets/HideFromCat/plates.png',
            import.meta.url).href);
        this.load.image('hitbox', new URL('assets/HideFromCat/hitbox.png',
            import.meta.url).href);
        this.load.image('mouse', new URL('assets/HideFromCat/mouse.png',
            import.meta.url).href);
        this.load.spritesheet(
            'laser',
            new URL('assets/HideFromCat/laser.png', import.meta.url).href,
            {
                frameWidth: 1080,
                frameHeight: 720,
            }
            );
    }

    create() {
        this.background = this.add.image(540, 360, 'background');
        this.cat = this.add.image(540, 360, 'cat');
        this.eyes = this.add.image(540, 360, 'eyes');
        this.table = this.add.image(540, 360, 'table');
        this.cup = this.add.image(500, 360, 'cup');
        this.cup.depth = 1;
        this.plates = this.add.image(590, 360, 'plates');
        this.plates.depth = 1;
        this.laser = this.physics.add.sprite(540, 360, 'laser');
        this.hitbox1 = this.physics.add.sprite(0, 0, 'hitbox');
        // this.hitbox1.alpha = 0;
        this.hitbox2 = this.physics.add.sprite(0, 0, 'hitbox');
        // this.hitbox2.alpha = 0;
        this.mouse = this.physics.add.sprite(150, 660, 'mouse');
        this.mouse.setScale(0.4);
        this.mouse.flipX = true;
        this.mouse.depth = 2;
        this.createAnims();

        this.Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (this.Right.isDown) {
            this.mouse.flipX = true;
            this.mouse.x += 8;
        }
        if (this.Left.isDown) {
            this.mouse.flipX = false;
            this.mouse.x -= 8;
        }
        this.startSweeping();
    }

    createAnims() {
        this.anims.create({
            key: '0',
            frames: [{ key: 'laser', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: '1',
            frames: [{ key: 'laser', frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: '2',
            frames: [{ key: 'laser', frame: 2 }],
            frameRate: 10
        });
        this.anims.create({
            key: '3',
            frames: [{ key: 'laser', frame: 3 }],
            frameRate: 10
        });
        this.anims.create({
            key: '4',
            frames: [{ key: 'laser', frame: 4 }],
            frameRate: 10
        });
        this.anims.create({
            key: '5',
            frames: [{ key: 'laser', frame: 5 }],
            frameRate: 10
        });
        this.anims.create({
            key: '6',
            frames: [{ key: 'laser', frame: 6 }],
            frameRate: 10
        });
    }

    sweepRight() {
        this.laser.anims.play('0');
        this.time.delayedCall(150, () => {
            this.laser.anims.play('1');
        }, [], this);
        this.time.delayedCall(300, () => {
            this.laser.anims.play('2');
            this.hitbox2.setPosition(530, 670);
        }, [], this);
        this.time.delayedCall(450, () => {
            this.laser.anims.play('3');
            this.hitbox2.x = 645;
        }, [], this);
        this.time.delayedCall(600, () => {
            this.laser.anims.play('4');
            this.hitbox2.x = 725;
        }, [], this);
        this.time.delayedCall(750, () => {
            this.laser.anims.play('5');
            this.hitbox1.setPosition(525, 670);
            this.hitbox2.setPosition(0);
        }, [], this);
        this.time.delayedCall(900, () => {
            this.laser.anims.play('6'); 
            this.hitbox1.x = 620;
        }, [], this);

    }

    sweepLeft() {
        this.laser.anims.play('6');
        this.time.delayedCall(150, () => {
            this.laser.anims.play('5');
            this.hitbox1.x = 525;
        }, [], this);
        this.time.delayedCall(300, () => {
            this.laser.anims.play('4');
            this.hitbox1.setPosition(0);
            this.hitbox2.setPosition(725, 670);
        }, [], this);
        this.time.delayedCall(450, () => {
            this.laser.anims.play('3');
            this.hitbox2.x = 645;
        }, [], this);
        this.time.delayedCall(600, () => {
            this.laser.anims.play('2');
            this.hitbox2.x = 530;
        }, [], this);
        this.time.delayedCall(750, () => {
            this.laser.anims.play('1');
            this.hitbox2.setPosition(0);
        }, [], this);
        this.time.delayedCall(900, () => {
            this.laser.anims.play('0');
        }, [], this);
    }

    startSweeping() {
        if (this.laser.frame.name === 0 && this.side === 0) {
            this.side = 1;
            this.time.delayedCall(2200, this.sweepRight, [], this);
        }
        if (this.laser.frame.name === 6 && this.side === 1) {
            this.side = 0;
            this.time.delayedCall(2200, this.sweepLeft, [], this);
        }
    }

    setText() {
        this.myText = this.add.text(400, 360, '')
        this.myText.setStyle({
            fontSize: '100px',
            fill: '#000000',
            align: 'center',
        });
        this.myText.setText('Team4');
    }
}