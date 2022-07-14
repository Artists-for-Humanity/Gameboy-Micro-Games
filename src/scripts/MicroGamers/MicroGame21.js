export default class MicroGame21 extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame21',
        });

        // Game Object Declarations
        this.background;
        this.box;

        this.myText;
        this.gameState = false;
        this.started = false;
        this.startTimer = 0;
        this.red, this.yellow, this.purple, this.blue;
        this.colorblocks = [];
        this.lightColors = ["0xFF8B8E", "0xF3E260", "0xB25AFD", "0x7CAFFE"];
        this.darkColors = ["0xFF3D41", "0xFFD000", "0x961BFF", "0x001EFF"];
        this.pattern = [];
  
        this.g1, this.g2, this.g3, this.g4;
        this.guessBlocks = [];
        this.guesses = [];
        this.guess = 0;
        this.selected = 0;
        this.last;

        this.keyA;
        this.cursors;
        this.interactive = false;
        this.clickAvailable = false;
        this.selectAvailable = false;
        this.clickTimer = 0;
        this.selectTimer = 0;

        this.win = false;
    }

    preload() {
        this.load.image('brickWall', new URL('brickWall.png', import.meta.url).href);
        this.load.image('box', new URL('box.png', import.meta.url).href);
        this.load.image('redButton', new URL('redButton.png', import.meta.url).href);
        this.load.image('yellowButton', new URL('yellowButton.png', import.meta.url).href);
        this.load.image('purpleButton', new URL('purpleButton.png', import.meta.url).href);
        this.load.image('blueButton', new URL('blueButton.png', import.meta.url).href);
    }

    create() {
        this.background = this.add.image(540, 360, 'brickWall');
        this.box = this.add.image(540, 360, 'box');
        this.box.visible = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.setText(); //start screen text

        this.red = this.add.rectangle(408, 334, 255, 170, "0xFF8B8E");
        this.yellow = this.add.rectangle(678, 334, 255, 170, "0xF3E260");
        this.purple = this.add.rectangle(408, 522, 255, 170, "0xB25AFD");
        this.blue = this.add.rectangle(678, 522, 255, 170, "0x7CAFFE");
        this.colorblocks = [this.red, this.yellow, this.purple, this.blue]; //add colorblocks to array

        for (var i = 0; i < this.colorblocks.length; i++) { //set board invisible when game starts
            this.colorblocks[i].visible = false;
        }

        this.g1 = this.add.rectangle(340.5, 160, 130, 90, "", 0);
        this.g2 = this.add.rectangle(475.5, 160, 130, 90, "", 0);
        this.g3 = this.add.rectangle(610.5, 160, 130, 90, "", 0);
        this.g4 = this.add.rectangle(745.5, 160, 130, 90, "", 0);
        this.guessBlocks = [this.g1, this.g2, this.g3, this.g4]; //add guess blocks to array, transparent at start

        for (var i = 0; i < 4; i++) { //create pattern
            this.pattern.push(this.getRandomInt(4));
        }
        console.log(this.pattern);
    }

    update(time, delta) {
        if (!this.started) this.startTimer += delta; //only use startTimer if game not started
        if (this.startTimer >= 2000 && !this.started) { //start game after 2 seconds
            this.startGame();
            this.gameState = true;
            this.started = true; //prevents startGame from continuously running
        }
        if (this.interactive && this.gameState === true) { //only runs when interactive mode is turned on AND gameState is TRUE
            this.clickTimer += delta;
            this.selectTimer += delta;
            if (this.clickTimer >= 200) this.clickAvailable = true; //only allows for click every 200ms
            if (this.selectTimer >= 200) this.selectAvailable = true; //only allows for selection every 200ms
            this.userInput();
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

    startGame() {
        this.myText.visible = false;
        this.showBoard();
        this.time.delayedCall(1000, this.flashPattern, [], this);
        this.time.delayedCall(this.pattern.length * 500 + 1000, this.startInteractive, [], this);
    }

    showBoard() {
        this.box.visible = true;
        for (var i = 0; i < this.colorblocks.length; i++) {
            this.colorblocks[i].visible = true;
        }
    }

    flash(num) {
        this.showBrighterColor(num);
        this.time.delayedCall(300, this.showOriginalColor, [num], this);
    }

    flashPattern() {
        for (var i = 0; i < this.pattern.length; i++) {
            this.time.delayedCall(i * 500, this.flash, [this.pattern[i]], this); //500 ms between flashes
        }
    }

    showBrighterColor(num) {
        this.colorblocks[num].setFillStyle(this.darkColors[num]);
    }

    showOriginalColor(num) {
        this.colorblocks[num].setFillStyle(this.lightColors[num]);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    startInteractive() {
        this.interactive = true;
        this.showOutline(this.selected);
    }

    showOutline(num) {
        this.colorblocks[num].setStrokeStyle(4, "0x000000");
        this.colorblocks[num].depth = 1;
    }

    hideOutline(num) {
        this.colorblocks[num].setStrokeStyle();
        this.colorblocks[num].depth = 0;
    }

    userInput(){
        if (this.clickAvailable && this.cursors.left.isDown && this.selected >= 1) { 
            this.last = this.selected;
            this.hideOutline(this.last);
            this.selected--;
            this.showOutline(this.selected);
            this.clickTimer = 0;
            this.clickAvailable = false;
        } else if (this.clickAvailable && this.cursors.right.isDown && this.selected <= 2) {
            this.last = this.selected;
            this.hideOutline(this.last);
            this.selected++;
            this.showOutline(this.selected);
            this.clickTimer = 0;
            this.clickAvailable = false;
        } else if (this.selectAvailable && this.keyA.isDown && this.guesses.length <= 3) {
            this.guesses.push(this.selected);
            this.guessBlocks[this.guess].setFillStyle(this.lightColors[this.guesses[this.guess]]);
            this.guessBlocks[this.guess].setStrokeStyle(2, "0x000000");
            console.log(this.guesses);
            if (JSON.stringify(this.guesses[this.guess]) != JSON.stringify(this.pattern[this.guess])) { //check loss condition
                console.log("YOU LOSE");
                this.gameState = false;
            }
            if (JSON.stringify(this.guesses) == JSON.stringify(this.pattern) && !this.win) { //check win condition
                console.log("YOU WIN!");
                this.gameState = false;
                this.win = true;
            }
            this.guess++;
            this.selectTimer = 0;
            this.selectAvailable = false;            
        }
    }
}