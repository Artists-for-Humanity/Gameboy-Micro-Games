export default class HitTheButton extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'HitTheButton',
        });

        // Game Object Declarations
        this.startCheck = false;
        this.gameActive = false;
        this.gameOver = false;
        this.victory = false;
        this.table;
        this.button;
        this.myName;
        this.cpuName;
        this.myHand;
        this.cpuHand;
        this.myScoreTracker;
        this.cpuScoreTracker;
        this.myScore = 0;
        this.cpuScore = 0;
        this.round = 1;
        this.cpuTimer = 0;

        this.permaText;
        this.myText;
        this.endText;

        this.keySPACE;
        this.keyPressAvailable = true;
        this.delayedCallCheck = false;
    }

    preload() {
        this.load.image('background', new URL('assets/HitTheButton/background.png',
            import.meta.url).href);
        this.load.image('table', new URL('assets/HitTheButton/table.png',
            import.meta.url).href);
        this.load.image('player', new URL('assets/HitTheButton/player.png',
            import.meta.url).href);
        this.load.image('cpu', new URL('assets/HitTheButton/cpu.png',
            import.meta.url).href);
        this.load.spritesheet(
            'button',
            new URL('assets/HitTheButton/button.png', import.meta.url).href,
            {
                frameWidth: 255,
                frameHeight: 175,
            }
        );
        this.load.spritesheet(
            'scoreTracker',
            new URL('assets/HitTheButton/scoreTracker.png', import.meta.url).href,
            {
                frameWidth: 321,
                frameHeight: 108,
            }
        );
        this.load.spritesheet(
            'hand',
            new URL('assets/HitTheButton/hand.png', import.meta.url).href,
            {
                frameWidth: 1080,
                frameHeight: 720,
            }
        );
    }

    create() {
        this.createAnims();
        this.setText();
        this.background = this.add.image(540, 360, 'background');
        this.table = this.add.image(540, 360, 'table');
        this.button = this.physics.add.sprite(540, 360, 'button');
        this.myName = this.physics.add.image(0, 0, 'player').setDisplayOrigin(-5, -5).setScale(0.5);
        this.cpuName = this.physics.add.image(1080, 0, 'cpu').setDisplayOrigin(216, -9).setScale(0.5);
        this.myHand = this.physics.add.sprite(540, 360, 'hand');
        this.cpuHand = this.physics.add.sprite(540, 360, 'hand');
        this.cpuHand.flipX = true;
        this.myScoreTracker = this.physics.add.sprite(0, 48, 'scoreTracker').setDisplayOrigin(-16, -12).setScale(0.38);
        this.cpuScoreTracker = this.physics.add.sprite(1080, 48, 'scoreTracker').setDisplayOrigin(321, -8).setScale(0.38);

        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        if (!this.startCheck) {
            this.startCheck = true;
            this.button.anims.play('red');
            this.time.delayedCall(4500, () => {
                this.myText.visible = false;
                this.gameActive = true;
                this.myHand.anims.play('idle', true);
                this.cpuHand.anims.play('idle', true);
            }, [], this);
        }
        if (this.gameActive) {

            //delayedCallCheck used to prevent multiple rounds starting at once
            if (!this.roundActive && !this.delayedCallCheck) {
                this.time.delayedCall(1000, () => {
                    this.startRound();
                    console.log('round start');
                }, [], this);
                this.delayedCallCheck = true;
            }
            if (this.roundActive) {
                if (Phaser.Input.Keyboard.JustDown(this.keySPACE) && this.keyPressAvailable) {
                    this.keyPressAvailable = false;
                    this.myHand.anims.play('slap');
                    this.myHand.on('animationcomplete', () => { 
                        this.time.delayedCall(250, () => {
                            this.myHand.anims.play('idle');
                            this.keyPressAvailable = true;
                        }, [], this);
                    });

                    //checks if button is green
                    if (this.button.anims.currentFrame.textureFrame === 1) {
                        this.roundWon();
                    } else {
                        this.roundLoss();
                    }
                }
                if (this.button.anims.currentFrame.textureFrame === 1) {
                    this.cpuTimer += delta;
                }
                if (this.cpuTimer >= 350) {
                    this.cpuHand.anims.play('slap');
                    this.cpuHand.on('animationcomplete', () => { 
                        this.time.delayedCall(250, () => { this.cpuHand.anims.play('idle') }, [], this);
                    });
                    this.roundLoss();
                }
            }
            if (this.myScore === 3 || this.cpuScore === 3) {
                this.gameActive = false;
                this.time.delayedCall(700, () => { this.endGame(); }, [], this);         
            }
        }

    }

    createAnims() {
        this.anims.create({
            key: 'red',
            frames: [{ key: 'button', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'green',
            frames: [{ key: 'button', frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: '0',
            frames: [{ key: 'scoreTracker', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: '1',
            frames: [{ key: 'scoreTracker', frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: '2',
            frames: [{ key: 'scoreTracker', frame: 2 }],
            frameRate: 10
        });
        this.anims.create({
            key: '3',
            frames: [{ key: 'scoreTracker', frame: 3 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'hand', frame: 0 },
                { key: 'hand', frame: 1 },
                { key: 'hand', frame: 2 },
                { key: 'hand', frame: 3 },
                { key: 'hand', frame: 4 },],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'slap',
            frames: [
                { key: 'hand', frame: 5 },
                { key: 'hand', frame: 6 },
                { key: 'hand', frame: 7 },
                { key: 'hand', frame: 8 },
                { key: 'hand', frame: 9 },],
            frameRate: 16
        });
    }

    setText() {
        this.permaText = this.add.text(540, 40, '');
        this.permaText.setStyle({
            fontSize: '36px',
            fill: '#00ffff',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.permaText.setText([
            "First to 3 wins!"]);
        this.permaText.setOrigin(0.5);
        this.permaText.depth = 20;

        this.myText = this.add.text(540, 360, '');
        this.myText.setStyle({
            fontSize: '54px',
            fill: '#00ffff',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.myText.setText([
            "When the button turns",
            "green, hit 'SPACE' before",
            "your opponent does!"]);
        this.myText.setOrigin(0.5);
        this.myText.depth = 20;

        this.endText = this.add.text(540, 360, '');
        this.endText.setStyle({
            fontSize: '100px',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 10
        });
        this.endText.setOrigin(0.5);
        this.endText.depth = 20;
    }

    startRound() {
        this.roundActive = true;

        //turn button green
        this.goGreen = this.time.delayedCall(this.getIntBetween(2000, 5000), () => { 
            this.button.anims.play('green');
        }, [], this);
    }
    
    reset() {
        this.time.delayedCall(500, () => {
            this.button.anims.play('red');
        }, [], this);
        this.roundActive = false;
        this.delayedCallCheck = false;
        this.cpuTimer = 0;
        this.round++;
    }

    roundWon() {
        this.myScore++;
        if (this.myScore === 1) this.myScoreTracker.anims.play('1');
        if (this.myScore === 2) this.myScoreTracker.anims.play('2');
        if (this.myScore === 3) this.myScoreTracker.anims.play('3');
        this.reset();
    }

    roundLoss() {
        this.time.removeEvent(this.goGreen);
        this.cpuScore++;
        if (this.cpuScore === 1) this.cpuScoreTracker.anims.play('1');
        if (this.cpuScore === 2) this.cpuScoreTracker.anims.play('2');
        if (this.cpuScore === 3) this.cpuScoreTracker.anims.play('3');
        this.reset();
    }

    endGame() {
        this.gameActive = false;
        this.gameOver = true;
        this.anims.pauseAll();
        this.time.removeAllEvents();
        if (this.myScore === 3) {
            this.endText.setStyle({
                fill: '#00ff00'
            });
            this.endText.setText('YOU WON!');
            this.victory = true;
        } else {
            this.endText.setStyle({
                fill: '#ff0000'
            });
            this.endText.setText('YOU LOST!')
        }
    }
    
    //helper function
    getIntBetween(lower, upper) {
        return Math.floor(Math.random() * (upper - lower) + lower);
    }
}