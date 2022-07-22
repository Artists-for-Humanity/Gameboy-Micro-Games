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

        this.Left;
        this.Right;
    }

    preload() {
        this.load.image('background', new URL('assets22/background.png',
            import.meta.url).href);
        this.load.image('table', new URL('assets22/table.png',
            import.meta.url).href);
        this.load.image('cat', new URL('assets22/cat.png',
            import.meta.url).href);
        this.load.image('eyes', new URL('assets22/eyes.png',
            import.meta.url).href);
        this.load.image('cheese', new URL('assets22/cheese.png',
            import.meta.url).href);
        this.load.image('cup', new URL('assets22/cup.png',
            import.meta.url).href);
        this.load.image('plates', new URL('assets22/plates.png',
            import.meta.url).href);
        this.load.spritesheet(
            'laser',
            new URL('assets22/laser.png', import.meta.url).href,
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
        this.createAnims();

        this.Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (this.Right.isDown) {
            this.laser.anims.play('sweepRight');
        }
        else if (this.Left.isDown) {
            this.laser.anims.play('sweepLeft');
        }
    }

    createAnims() {
        this.anims.create({
            key: 'sweepRight',
            frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'sweepLeft',
            frames: this.anims.generateFrameNumbers('laser', { start: 6, end: 0 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'laser', frame: 0 }],
            frameRate: 10
        });
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