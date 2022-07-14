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
        this.lightRed, this.lightYellow, this.lightPurple, this.lightBlue;
        this.lightColorBlocks = [];
        this.darkRed, this.darkYellow, this.darkPurple, this.darkBlue;
        this.darkColorBlocks = [];
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
        this.load.image('lightRed', new URL('lightRed.png', import.meta.url).href);
        this.load.image('lightYellow', new URL('lightYellow.png', import.meta.url).href);
        this.load.image('lightPurple', new URL('lightPurple.png', import.meta.url).href);
        this.load.image('lightBlue', new URL('lightBlue.png', import.meta.url).href);
        this.load.image('darkRed', new URL('darkRed.png', import.meta.url).href);
        this.load.image('darkYellow', new URL('darkYellow.png', import.meta.url).href);
        this.load.image('darkPurple', new URL('darkPurple.png', import.meta.url).href);
        this.load.image('darkBlue', new URL('darkBlue.png', import.meta.url).href);
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

        this.lightRed = this.add.sprite(408, 334, 'lightRed');
        this.lightYellow = this.add.sprite(678, 334, 'lightYellow');
        this.lightPurple = this.add.sprite(408, 522, 'lightPurple');
        this.lightBlue = this.add.sprite(678, 522, 'lightBlue');
        this.lightColorBlocks = [this.lightRed, this.lightYellow, this.lightPurple, this.lightBlue]; //put lightColorBlocks into an array

        this.darkRed = this.add.sprite(408, 334, 'darkRed');
        this.darkYellow = this.add.sprite(678, 334, 'darkYellow');
        this.darkPurple = this.add.sprite(408, 522, 'darkPurple');
        this.darkBlue = this.add.sprite(678, 522, 'darkBlue');
        this.darkColorBlocks = [this.darkRed, this.darkYellow, this.darkPurple, this.darkBlue]; //put darkColorBlocks into an array

        for (var i = 0; i < this.lightColorBlocks.length; i++) { //set board invisible when game starts
            this.lightColorBlocks[i].visible = false;
            this.lightColorBlocks[i].setScale(1.8);
            this.darkColorBlocks[i].visible = false;
            this.darkColorBlocks[i].setScale(1.8);
        }

        this.g1 = this.add.sprite(340.5, 160, '');
        this.g2 = this.add.sprite(475.5, 160, '');
        this.g3 = this.add.sprite(610.5, 160, '');
        this.g4 = this.add.sprite(745.5, 160, '');
        this.guessBlocks = [this.g1, this.g2, this.g3, this.g4]; //initialize guessBlocks and make them all invisible

        for (var i = 0; i < this.guessBlocks.length; i++) { //turn guessBlocks invisible at the start of the game
            this.guessBlocks[i].visible = false;
        }

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
            this.started = true; //prevents startGame from running again
        }
        if (this.interactive && this.gameState === true) { //only runs when interactive mode is turned on AND gameState is TRUE (game will stop after gameState is set back to FALSE)
            this.clickTimer += delta;
            this.selectTimer += delta; //timers used to prevent double clicks
            this.showDarkColor(this.selected); //show selected block
            if (this.clickTimer >= 150) this.clickAvailable = true; //only allows for click every 150ms
            if (this.selectTimer >= 150) this.selectAvailable = true; //only allows for selection every 150ms
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
        this.time.delayedCall(this.pattern.length * 500 + 2000, () => {this.interactive = true}, [], this); //starts interactive part of the game 1 second after  pattern flahses (2000 - 1000)
    }

    showBoard() {
        this.box.visible = true;
        for (var i = 0; i < this.lightColorBlocks.length; i++) {
            this.lightColorBlocks[i].visible = true;
        }
    }

    flash(num) {
        this.showDarkColor(num);
        this.time.delayedCall(300, this.showLightColor, [num], this);
    }

    flashPattern() {
        for (var i = 0; i < this.pattern.length; i++) {
            this.time.delayedCall(i * 500, this.flash, [this.pattern[i]], this); //500 ms between flashes
        }
    }

    showDarkColor(num) {
        this.lightColorBlocks[num].visible = false;
        this.darkColorBlocks[num].visible = true;
    }

    showLightColor(num) {
        this.darkColorBlocks[num].visible = false;
        this.lightColorBlocks[num].visible = true;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    hide(num) {
        this.showLightColor(num);
    }

    userInput(){
        if (this.clickAvailable && this.cursors.left.isDown && this.selected >= 1) { 
            this.move(0); //0 indicates LEFT
        } else if (this.clickAvailable && this.cursors.right.isDown && this.selected <= 2) {
            this.move(1); //1 indicates RIGHT
        } else if (this.selectAvailable && this.keyA.isDown && this.guesses.length <= 3) {
            this.guesses.push(this.selected);
            this.showGuess(this.selected);
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

    move(num) {
        this.last = this.selected;
        if (num === 0) this.selected--; //left
        if (num === 1) this.selected++; //right
        this.hide(this.last); //hide last block
        this.clickTimer = 0;
        this.clickAvailable = false;
    }

    showGuess(num) {
        var key;
        if (num === 0) key = 'lightRed';
        if (num === 1) key = 'lightYellow';
        if (num === 2) key = 'lightPurple';
        if (num === 3) key = 'lightBlue';
        this.guessBlocks[this.guess].setTexture(key);
        this.guessBlocks[this.guess].visible = true;
    }
}