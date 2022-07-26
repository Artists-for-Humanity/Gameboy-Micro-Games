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

        this.Left;
        this.Right;
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
        this.cup = this.add.image(540, 360, 'cup');
        this.cup.depth = 1;
        this.plates = this.add.image(540, 360, 'plates');
        this.plates.depth = 1;
        this.laser = this.physics.add.sprite(540, 360, 'laser');
        this.hitbox1 = this.physics.add.sprite(130, 670, 'hitbox');
        this.hitbox1.depth = 2;
        this.hitbox2 = this.physics.add.sprite(400, 670, 'hitbox');
        this.hitbox2.depth = 2;

        this.createAnims();

        this.Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.Right)) {
            this.sweepRight();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.Left)) {
            this.sweepLeft();
        }
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
            this.hitbox1.x = 195;
            this.hitbox2.x = 470;
        }, [], this);
        this.time.delayedCall(300, () => {
            this.laser.anims.play('2');
            this.hitbox1.x = 250;
            this.hitbox2.x = 530;
        }, [], this);
        this.time.delayedCall(450, () => {
            this.laser.anims.play('3');
            this.hitbox1.x = 360;
            this.hitbox2.x = 645;
        }, [], this);
        this.time.delayedCall(600, () => {
            this.laser.anims.play('4');
            this.hitbox1.x = 455;
            this.hitbox2.x = 725;
        }, [], this);
        this.time.delayedCall(750, () => {
            this.laser.anims.play('5');
            this.hitbox1.x = 525;
            this.hitbox2.x = 800;
        }, [], this);
        this.time.delayedCall(900, () => {
            this.laser.anims.play('6'); 
            this.hitbox1.x = 620;
            this.hitbox2.x = 905;
        }, [], this);

    }

    sweepLeft() {
        this.laser.anims.play('6');
        this.time.delayedCall(150, () => {
            this.laser.anims.play('5');
            this.hitbox1.x = 525;
            this.hitbox2.x = 800;
        }, [], this);
        this.time.delayedCall(300, () => {
            this.laser.anims.play('4');
            this.hitbox1.x = 455;
            this.hitbox2.x = 725;
        }, [], this);
        this.time.delayedCall(450, () => {
            this.laser.anims.play('3');
            this.hitbox1.x = 360;
            this.hitbox2.x = 645;
        }, [], this);
        this.time.delayedCall(600, () => {
            this.laser.anims.play('2');
            this.hitbox1.x = 250;
            this.hitbox2.x = 530;
        }, [], this);
        this.time.delayedCall(750, () => {
            this.laser.anims.play('1');
            this.hitbox1.x = 195;
            this.hitbox2.x = 470;
        }, [], this);
        this.time.delayedCall(900, () => {
            this.laser.anims.play('0');
            this.hitbox1.x = 130;
            this.hitbox2.x = 400;
        }, [], this);
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