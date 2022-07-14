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
        this.lightColorBlocks = [];
        this.darkRed, this.darkYellow, this.darkPurple, this.darkBlue;
        this.darkColorBlocks = [];
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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
            this.lightColorBlocks[i].setScale(1.8);
            this.darkColorBlocks[i].setScale(1.8);
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
            this.clickTimer += delta;
            this.selectTimer += delta; //timers used to prevent double clicks
            this.showDarkColor(this.selected); //show selected block
            if (this.clickTimer >= 150) this.clickAvailable = true; //only allows for click every 150ms
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
        this.time.delayedCall(2000, this.flashPattern, [], this); //flash pattern 1 second after board appears
        this.time.delayedCall(this.pattern.length * 500 + 3000, () => {this.interactive = true}, [], this); //starts interactive part of the game 5 seconds after board appear (4 * 500 + 3000 = 5000ms)
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
        for (var i = 0; i < this.lightColorBlocks.length; i++) {
            this.lightColorBlocks[i].visible = true;
        }
    }

    hideBoard() {
        this.box.visible = false;
        for (var i = 0; i < this.lightColorBlocks.length; i++) {
            this.lightColorBlocks[i].visible = false;
            this.darkColorBlocks[i].visible = false;
        }
    }

    hideGuessBlocks() {
        for (var i = 0; i < this.guessBlocks.length; i++) {
            this.guessBlocks[i].visible = false;
        }
    }

    flash(num) {
        this.showDarkColor(num);
        this.time.delayedCall(300, this.showLightColor, [num], this); //flash appears for 300ms
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

    hide(num) {
        this.showLightColor(num);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    userInput(){
        if (this.clickAvailable && this.cursors.left.isDown && this.selected >= 1) { 
            this.move(0); //0 indicates LEFT
        } else if (this.clickAvailable && this.cursors.right.isDown && this.selected <= 2) {
            this.move(1); //1 indicates RIGHT
        } else if (this.selectAvailable && this.keyA.isDown && this.guesses.length <= 3) {
            this.guesses.push(this.selected); //adds selected color to guess array
            this.showGuess(this.selected);
            if (JSON.stringify(this.guesses[this.guess]) != JSON.stringify(this.pattern[this.guess])) { //check loss condition
                this.showLossText();
                this.gameState = false;
            }
            if (JSON.stringify(this.guesses) == JSON.stringify(this.pattern)) { //check win condition
                this.time.delayedCall(1500, this.win, [], this);
                this.gameState = false;
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

    win() {
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