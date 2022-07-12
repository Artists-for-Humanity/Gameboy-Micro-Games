export default class MicroGame21 extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame21',
        });

        // Game Object Declarations
        this.myText;
        this.gameState = false;
        this.started = false;
        this.gameTime = 0;
        this.red;
        this.yellow;
        this.purple;
        this.blue;
        this.colors = [];
        this.originalColors = ["0xFF8B8E", "0xFFE058", "0xB25AFD", "0x4D7DFF"];
        this.brighterColors = ["0xFF3D41", "0xFFD000", "0x961BFF", "0x001EFF"];
        this.pattern;

    }

    preload() {
    }

    create() {
        this.setText(); //start screen text
        
        this.red = this.add.rectangle(405, 270, 270, 180, "0xFF8B8E");
        this.yellow = this.add.rectangle(675, 270, 270, 180, "0xFFE058");
        this.purple = this.add.rectangle(405, 450, 270, 180, "0xB25AFD");
        this.blue = this.add.rectangle(675, 450, 270, 180, "0x4D7DFF");
        this.colors = [this.red, this.yellow, this.purple, this.blue]; //add colorblocks to array

        for (var i = 0; i < this.colors.length; i++) { //set board invisible when game starts
            this.colors[i].visible = false;
        }
    }

    update(time, delta) {
        this.gameTime += delta;
        if (this.gameTime >= 2000 && !this.started) {
            this.gameState = true;
            this.started = true;
        }
        if (this.gameState) {
            this.runGame();
            this.gameState = false;
        }
    }

    setText() {
        this.myText = this.add.text(200, 330, '')
        this.myText.setStyle({
            fontSize: '60px',
            fill: '#000000',
            align: 'center',
        });
        this.myText.setText('Memorize the pattern!');
    }

    runGame() {
        this.myText.visible = false;
        this.showBoard();
        this.time.delayedCall(1000, this.flash, [Math.floor(Math.random() * 4)], this);
        this.time.delayedCall(2000, this.flash, [Math.floor(Math.random() * 4)], this);
        this.time.delayedCall(3000, this.flash, [Math.floor(Math.random() * 4)], this);
        this.time.delayedCall(4000, this.flash, [Math.floor(Math.random() * 4)], this);
    }

    showBoard() {
        for (var i = 0; i < this.colors.length; i++) {
            this.colors[i].visible = true;
        }
    }

    flash(num) {
        this.showBrighterColor(num);
        this.time.delayedCall(500, this.showOriginalColor, [num], this);
    }

    showBrighterColor(num) {
        this.colors[num].setFillStyle(this.brighterColors[num]);
    }

    showOriginalColor(num) {
        this.colors[num].setFillStyle(this.originalColors[num]);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
}