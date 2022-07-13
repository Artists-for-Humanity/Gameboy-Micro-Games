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
        this.startTimer = 0;
        this.red, this.yellow, this.purple, this.blue;
        this.colorblocks = [];
        this.originalColors = ["0xFF8B8E", "0xFFE058", "0xB25AFD", "0x4D7DFF"];
        this.brighterColors = ["0xFF3D41", "0xFFD000", "0x961BFF", "0x001EFF"];
        this.pattern = [];
  
        this.g1, this.g2, this.g3, this.g4;
        this.guessBlocks = [];
        this.guesses = [];
        this.guess = 0;
        this.selected = 0;
        this.last;

        this.keyA;
        this.keyS;
        this.keySPACE;
        this.interactive = false;
        this.clickAvailable = false;
        this.selectAvailable = false;
        this.clickTimer = 0;
        this.selectTimer = 0;

        this.win = false;
    }

    preload() {
    }

    create() {
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.setText(); //start screen text
        
        this.red = this.add.rectangle(405, 270, 270, 180, "0xFF8B8E");
        this.yellow = this.add.rectangle(675, 270, 270, 180, "0xFFE058");
        this.purple = this.add.rectangle(405, 450, 270, 180, "0xB25AFD");
        this.blue = this.add.rectangle(675, 450, 270, 180, "0x4D7DFF");
        this.colorblocks = [this.red, this.yellow, this.purple, this.blue]; //add colorblocks to array

        this.g1 = this.add.rectangle(337.5, 130, 135, 90, "", 0);
        this.g2 = this.add.rectangle(472.5, 130, 135, 90, "", 0);
        this.g3 = this.add.rectangle(607.5, 130, 135, 90, "", 0);
        this.g4 = this.add.rectangle(742.5, 130, 135, 90, "", 0);
        this.guessBlocks = [this.g1, this.g2, this.g3, this.g4]; //add guess blocks to array, transparent at start

        for (var i = 0; i < this.colorblocks.length; i++) { //set board invisible when game starts
            this.colorblocks[i].visible = false;
        }

        for (var i = 0; i < 4; i++) { //create pattern
            this.pattern.push(this.getRandomInt(4));
        }
        console.log(this.pattern);
    }

    update(time, delta) {
        if (!(this.started)) this.startTimer += delta; //only use startTimer if game not started
        if (this.startTimer >= 2000 && !this.started) { //start game after 2 seconds
            this.gameState = true;
            this.started = true;
        }
        if (this.gameState) {
            this.startGame();
            this.gameState = false; //prevents startGame from continuously running
        }
        if (this.interactive) { //interactive modde on
            this.clickTimer += delta;
            this.selectTimer += delta;
            if (this.clickTimer >= 200) this.clickAvailable = true; //only allows for click every 200ms
            if (this.selectTimer >= 200) this.selectAvailable = true; //only allows for selection every 200ms
            this.userInput();

            if (JSON.stringify(this.guesses) == JSON.stringify(this.pattern) && !this.win) {
                console.log("YOU WIN!");
                this.win = true;
            }
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
        this.time.delayedCall(500, this.flashPattern, [], this);
        this.time.delayedCall(this.pattern.length * 500 + 1000, this.startInteractive, [], this);
    }

    showBoard() {
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
        this.colorblocks[num].setFillStyle(this.brighterColors[num]);
    }

    showOriginalColor(num) {
        this.colorblocks[num].setFillStyle(this.originalColors[num]);
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
        if (this.clickAvailable && this.keyA.isDown && this.selected >= 1) { 
            this.last = this.selected;
            this.hideOutline(this.last);
            this.selected--;
            this.showOutline(this.selected);
            this.clickTimer = 0;
            this.clickAvailable = false;
        } else if (this.clickAvailable && this.keyS.isDown && this.selected <= 2) {
            this.last = this.selected;
            this.hideOutline(this.last);
            this.selected++;
            this.showOutline(this.selected);
            this.clickTimer = 0;
            this.clickAvailable = false;
        } else if (this.selectAvailable && this.keySPACE.isDown && this.guesses.length <= 3) {
            this.guesses.push(this.selected);
            this.guessBlocks[this.guess].setFillStyle(this.originalColors[this.guesses[this.guess]], 1);
            this.guessBlocks[this.guess].setStrokeStyle(2, "0x000000", 1);
            this.guess++;
            this.selectTimer = 0;
            this.selectAvailable = false;
            console.log(this.guesses);
            
        }
    }
}