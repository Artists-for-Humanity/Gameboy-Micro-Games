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
        this.hitboxes = [];
        this.mouse;
        
        this.Left;
        this.Right;

        this.side = 0;
        this.sweeping = false;
        this.touched = false;
        this.textDisplayed = false;
        this.gameover = false;
        this.gamestarted = false;

        this.startText;
        this.deadText;
        this.winText;
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
            'mouse',
            new URL('assets/HideFromCat/mouse.png', import.meta.url).href,
            {
                frameWidth: 241,
                frameHeight: 180,
            }
            );
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
        this.cup = this.add.image(500, 370, 'cup');
        this.cup.depth = 1;
        this.plates = this.add.image(590, 360, 'plates');
        this.plates.depth = 1;
        this.cheese = this.physics.add.sprite(910, 665, 'cheese');
        this.cheese.setScale(0.6);
        this.cheese.depth = 3;
        this.laser = this.physics.add.sprite(540, 360, 'laser');
        this.hitbox1 = this.physics.add.sprite(0, 0, 'hitbox');
        this.hitbox1.alpha = 0;
        this.hitbox2 = this.physics.add.sprite(0, 0, 'hitbox');
        this.hitbox2.alpha = 0;
        this.hitboxes = [this.hitbox1, this.hitbox2];
        this.mouse = this.physics.add.sprite(150, 660, 'mouse');
        this.mouse.setScale(0.4);
        this.mouse.flipX = true;
        this.mouse.depth = 2;
        this.createAnims();

        this.physics.add.collider(this.mouse, this.hitboxes, () => { //collision detection between mouse and laser hitboxes
            this.lose();
        });
        this.physics.add.collider(this.mouse, this.cheese, () => { //collision detection between mouse and cheese
            this.touched = true;
            this.cheese.y = 620;
        });

        this.Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (!this.textDisplayed) {
            this.textDisplayed = true;
            this.displayStartText();
            this.time.delayedCall(3000, () => { //delete text and start game after 3 seconds
                this.startText.alpha = 0; 
                this.gamestarted = true; 
            }, [], this); 
        }
        if (!this.gameover && this.gamestarted) {
            this.startSweeping();
            this.updatePlayer();
            if (this.touched) {
                if (this.mouse.flipX) this.cheese.x = this.mouse.x + 10;
                if (!this.mouse.flipX) this.cheese.x = this.mouse.x - 10;
                if (this.mouse.x <= 360) this.win();
            }
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

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'mouse', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'run',
            frames: [
            { key: 'mouse', frame: 0 },
            { key: 'mouse', frame: 1 },
            { key: 'mouse', frame: 2 },] ,
            frameRate: 12
        });
    }

    displayStartText() {
        this.startText = this.add.text(540, 160, '')
        this.startText.setStyle({
            fontSize: '72px',
            fill: '#00ffff',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.startText.setText([
            "Steal the ",
            "cheese without",
            "getting spotted!"]);
        this.startText.setOrigin(0.5);
        this.startText.depth = 20;
        this.startText.alpha = 1;
    }

    sweepRight() {
        this.laser.anims.play('0');
        this.time.delayedCall(150, () => {
            this.laser.anims.play('1');
        }, [], this);
        this.time.delayedCall(300, () => {
            this.laser.anims.play('2');
            this.hitbox2.setPosition(570, 670);
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
            this.hitbox1.setPosition(570, 670);
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
            this.hitbox1.x = 570;
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
            this.hitbox2.x = 570;
        }, [], this);
        this.time.delayedCall(750, () => {
            this.laser.anims.play('1');
            this.hitbox2.setPosition(0);
        }, [], this);
        this.time.delayedCall(900, () => {
            this.laser.anims.play('0');
        }, [], this);
    }

    startSweeping() { //this.side used to prevent multiple calls of sweepRight and sweepLeft
        if (this.laser.frame.name === 0 && this.side === 0) {
            this.side = 1;
            this.time.delayedCall(1800, this.sweepRight, [], this);
        }
        if (this.laser.frame.name === 6 && this.side === 1) {
            this.side = 0;
            this.time.delayedCall(1800, this.sweepLeft, [], this);
        }
    }

    updatePlayer() {
        if (this.Right.isDown) {
            this.mouse.flipX = true;
            this.mouse.anims.play('run', true);
            this.mouse.x += 8;
        }
        else if (this.Left.isDown) {
            this.mouse.flipX = false;
            this.mouse.anims.play('run', true);
            this.mouse.x -= 8;
        }
        else this.mouse.anims.play('idle');
    }

    lose() {
        if (!this.gameover) {
            this.time.removeAllEvents();
            this.displayDeadText();
            this.gameover = true;
        }
    }

    displayDeadText() {
        this.deadText = this.add.text(540, 360, '')
        this.deadText.setStyle({
            fontSize: '100px',
            fill: '#ff0000',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.deadText.setText(
            ["You were",
            "spotted!"]);
        this.deadText.setOrigin(0.5);
        this.deadText.depth = 20;
    }

    win() {
        if (!this.gameover) {
            this.time.removeAllEvents();
            this.displayWinText();
            this.gameover = true;
        }
    }

    displayWinText() {
        this.winText = this.add.text(540, 360, '')
        this.winText.setStyle({
            fontSize: '100px',
            fill: '#00ff00',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.winText.setText("You won!");
        this.winText.setOrigin(0.5);
        this.winText.depth = 20;
    }
}