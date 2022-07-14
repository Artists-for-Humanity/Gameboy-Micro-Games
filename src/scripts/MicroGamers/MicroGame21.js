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
        this.concrete;
        this.door1, this.door2, this.door3, this.door4, this.door5;
        this.doors = [];
        this.box;

        this.myText;
        this.lossText;
        this.winText;
        this.gameState = false;
        this.started = false;
        this.startTimer = 0;
        this.lightRed, this.lightYellow, this.lightPurple, this.lightBlue;
        this.lightColorButtons = [];
        this.darkRed, this.darkYellow, this.darkPurple, this.darkBlue;
        this.darkColorButtons = [];
        this.pattern = [];
  
        this.g1, this.g2, this.g3, this.g4;
        this.guessBlocks = [];
        this.guesses = [];
        this.guessNum = 0;

        this.cursors;
        this.interactive = false;
        this.selectAvailable = false;
        this.selectTimer = 0;
    }

    preload() {
        this.load.image('brickWall', new URL('assets21/brickWall.png', import.meta.url).href);
        this.load.image('concrete', new URL('assets21/concrete.png', import.meta.url).href);
        this.load.image('door1', new URL('assets21/door1.png', import.meta.url).href);
        this.load.image('door2', new URL('assets21/door2.png', import.meta.url).href);
        this.load.image('door3', new URL('assets21/door3.png', import.meta.url).href);
        this.load.image('door4', new URL('assets21/door4.png', import.meta.url).href);
        this.load.image('door5', new URL('assets21/door5.png', import.meta.url).href);
        this.load.image('box', new URL('assets21/box.png', import.meta.url).href);
        this.load.image('lightRed', new URL('assets21/lightRed.png', import.meta.url).href);
        this.load.image('lightYellow', new URL('assets21/lightYellow.png', import.meta.url).href);
        this.load.image('lightPurple', new URL('assets21/lightPurple.png', import.meta.url).href);
        this.load.image('lightBlue', new URL('assets21/lightBlue.png', import.meta.url).href);
        this.load.image('darkRed', new URL('assets21/darkRed.png', import.meta.url).href);
        this.load.image('darkYellow', new URL('assets21/darkYellow.png', import.meta.url).href);
        this.load.image('darkPurple', new URL('assets21/darkPurple.png', import.meta.url).href);
        this.load.image('darkBlue', new URL('assets21/darkBlue.png', import.meta.url).href);
    }

    create() {
        this.drawUI();
        this.cursors = this.input.keyboard.createCursorKeys(); //add keyboard input

        this.lightRed = this.add.sprite(408, 334, 'lightRed');
        this.lightYellow = this.add.sprite(678, 334, 'lightYellow');
        this.lightPurple = this.add.sprite(408, 522, 'lightPurple');
        this.lightBlue = this.add.sprite(678, 522, 'lightBlue');
        this.lightColorButtons = [this.lightRed, this.lightYellow, this.lightPurple, this.lightBlue]; //put lightColorButtons into an array

        this.darkRed = this.add.sprite(408, 334, 'darkRed');
        this.darkYellow = this.add.sprite(678, 334, 'darkYellow');
        this.darkPurple = this.add.sprite(408, 522, 'darkPurple');
        this.darkBlue = this.add.sprite(678, 522, 'darkBlue');
        this.darkColorButtons = [this.darkRed, this.darkYellow, this.darkPurple, this.darkBlue]; //put darkColorButtons into an array

        for (var i = 0; i < this.lightColorButtons.length; i++) { //set board invisible when game starts
            this.lightColorButtons[i].setScale(1.8);
            this.darkColorButtons[i].setScale(1.8);
        }
        this.hideBoard();

        this.g1 = this.add.sprite(340.5, 160, '');
        this.g2 = this.add.sprite(475.5, 160, '');
        this.g3 = this.add.sprite(610.5, 160, '');
        this.g4 = this.add.sprite(745.5, 160, '');
        this.guessBlocks = [this.g1, this.g2, this.g3, this.g4]; //initialize guessBlocks into an array

        for (var i = 0; i < this.guessBlocks.length; i++) { //turn guessBlocks invisible
            this.guessBlocks[i].visible = false;
        }

        for (var i = 0; i < 4; i++) { //create pattern
            this.pattern.push(this.getRandomInt(4));
        }
        console.log(this.pattern);
    }

    update(time, delta) {
        this.time.delayedCall(600, () => {this.door1.alpha += 0.006;}, [], this); //door fade in after 600ms
        if (!this.started) this.startTimer += delta; //only use startTimer if game not started
        if (this.startTimer >= 4500 && !this.started) { //start game after 4.5 seconds
            this.startGame();
            this.gameState = true;
            this.started = true; //prevents startGame from running again
        }
        if (this.interactive && this.gameState === true) { //only runs when interactive mode is turned on AND gameState is TRUE (game will stop after gameState is set back to FALSE)
            this.myText.alpha -= 0.0166; //fade text out
            this.selectTimer += delta; //timers used to prevent double clicks
            if (this.selectTimer >= 150) this.selectAvailable = true; //only allows for selection every 150ms
            this.userInput();
        }
    }

    drawUI() {
        this.background = this.add.image(540, 360, 'brickWall');
        this.door1 = this.add.image(540, 360, 'door1');
        this.door1.alpha = 0;
        this.concrete = this.add.image(540, 360, 'concrete');
        this.box = this.add.image(540, 360, 'box');
        this.box.visible = false;
        this.door2 = this.add.image(540, 360, 'door2');
        this.door3 = this.add.image(540, 360, 'door3');
        this.door4 = this.add.image(540, 360, 'door4');
        this.door5 = this.add.image(540, 360, 'door5');
        this.doors = [this.door2, this.door3, this.door4, this.door5];
        for (var i = 0; i < this.doors.length; i++) {
            this.doors[i].visible = false;
        }
    }

    startGame() {
        this.showMemorizeText();
        this.showBoard();
        this.time.delayedCall(2000, this.flashPattern, [], this); //flash pattern 2 second after board appears
        this.time.delayedCall(this.pattern.length * 500 + 2500, () => {this.interactive = true}, [], this); //starts interactive part of the game 4.5 seconds after board appear (4 * 500 + 2500 = 4500ms)
    }

    showMemorizeText() {
        this.myText = this.add.text(200, 14, '')
        this.myText.setStyle({
            fontSize: '60px',
            fill: '#000000',
            align: 'center',
        });
        this.myText.setText('Memorize the pattern!');
        this.myText.alpha = 1;
    }

    showLossText() {
        this.lossText = this.add.text(140, 260, 'YOU LOST!')
        this.lossText.setStyle({
            fontSize: '160px',
            fill: '#ff0000',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.lossText.alpha = 1;
    }

    showBoard() {
        this.box.visible = true;
        for (var i = 0; i < this.lightColorButtons.length; i++) {
            this.lightColorButtons[i].visible = true;
        }
    }

    hideBoard() {
        this.box.visible = false;
        for (var i = 0; i < this.lightColorButtons.length; i++) {
            this.lightColorButtons[i].visible = false;
            this.darkColorButtons[i].visible = false;
        }
    }

    hideGuessBlocks() {
        for (var i = 0; i < this.guessBlocks.length; i++) {
            this.guessBlocks[i].visible = false;
        }
    }

    flash(num, ms) { //num = the index that is flashed, ms = flash duration
        this.showDarkColor(num);
        this.time.delayedCall(ms, this.showLightColor, [num], this);
    }

    flashPattern() {
        for (var i = 0; i < this.pattern.length; i++) {
            this.time.delayedCall(i * 500, this.flash, [this.pattern[i], 300], this); //500 ms between flashes and 300ms flash durations
        }
    }

    showDarkColor(num) {
        this.lightColorButtons[num].visible = false;
        this.darkColorButtons[num].visible = true;
    }

    showLightColor(num) {
        this.darkColorButtons[num].visible = false;
        this.lightColorButtons[num].visible = true;
    }

    getRandomInt(max) { //random int from 0 to max, EXCLUSIVE
        return Math.floor(Math.random() * max);
    }

    userInput(){
        if (this.selectAvailable && this.cursors.up.isDown && this.guesses.length <= 3) { 
            this.flash(0, 200);
            this.guesses.push(0);
            this.guess();
        } else if (this.selectAvailable && this.cursors.right.isDown) {
            this.flash(1, 200);
            this.guesses.push(1);
            this.guess();
        } else if (this.selectAvailable && this.cursors.down.isDown) {
            this.flash(2, 200);
            this.guesses.push(2);
            this.guess();
        } else if (this.selectAvailable && this.cursors.left.isDown) {
            this.flash(3, 200);
            this.guesses.push(3);
            this.guess();
        }
    }

    guess() {
        this.showGuess(this.guesses[this.guessNum]);
        this.checkWL();
        this.guessNum++;
        this.selectTimer = 0;
        this.selectAvailable = false;
    }

    checkWL() {
        if (JSON.stringify(this.guesses[this.guessNum]) != JSON.stringify(this.pattern[this.guessNum])) { // loss condition
            this.showLossText();
            this.gameState = false;
        }
        if (JSON.stringify(this.guesses) == JSON.stringify(this.pattern)) { // win condition
            this.time.delayedCall(1500, this.win, [], this);
            this.gameState = false;
        }
    }

    showGuess(num) {
        var key;
        if (num === 0) key = 'lightRed';
        if (num === 1) key = 'lightYellow';
        if (num === 2) key = 'lightPurple';
        if (num === 3) key = 'lightBlue';
        this.guessBlocks[this.guessNum].setTexture(key);
        this.guessBlocks[this.guessNum].visible = true; //sets guessBlock to the color that lines up with the number guessed and turns that specific block visible
    }

    win() { //hides UI then opens door after 1 second
        this.box.visible = false;
        this.hideBoard();
        this.hideGuessBlocks();
        this.time.delayedCall(1000, this.openDoor, [], this);
    }
    
    openDoor() {
        this.door2.visible = true;
        this.time.delayedCall(200, () => {this.door3.visible = true;}, [], this);
        this.time.delayedCall(400, () => {this.door4.visible = true;}, [], this);
        this.time.delayedCall(600, () => {this.door5.visible = true;}, [], this);
        this.time.delayedCall(1000, this.showWinText, [], this);
    }

    showWinText() {
        this.winText = this.add.text(180, 260, 'YOU WON!');
        this.winText.setStyle({
            fontSize: '160px',
            fill: '#ff0000',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
    }
}