import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';
export default class ColorPasscode extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'ColorPasscode',
        });

        // Game Object Declarations
        this.background;
        this.concrete;
        this.door1, this.door2, this.door3, this.door4, this.door5;
        this.doors = [];
        this.box;
        this.t = 0;
        this.goText;
        this.goTextTimer = 0;
        this.lossText;
        this.winText;
        this.started = false;
        this.started2 = false;
        this.gameOver = false;
        this.victory = false;
        this.sent = false;
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

        this.interactive = false;
        this.Left;
        this.Right;
        this.Down;
        this.Up;
        this.buttonHandlers = new ButtonPressHandlers();
        this.gamePad = null;

    }

    preload() {
        this.load.image('brickWall', new URL('assets/ColorPasscode/brickWall.png',
            import.meta.url).href);
        this.load.image('concrete', new URL('assets/ColorPasscode/concrete.png',
            import.meta.url).href);
        this.load.image('door1', new URL('assets/ColorPasscode/door1.png',
            import.meta.url).href);
        this.load.image('door2', new URL('assets/ColorPasscode/door2.png',
            import.meta.url).href);
        this.load.image('door3', new URL('assets/ColorPasscode/door3.png',
            import.meta.url).href);
        this.load.image('door4', new URL('assets/ColorPasscode/door4.png',
            import.meta.url).href);
        this.load.image('door5', new URL('assets/ColorPasscode/door5.png',
            import.meta.url).href);
        this.load.image('box', new URL('assets/ColorPasscode/box.png',
            import.meta.url).href);
        this.load.image('lightRed', new URL('assets/ColorPasscode/lightRed.png',
            import.meta.url).href);
        this.load.image('lightYellow', new URL('assets/ColorPasscode/lightYellow.png',
            import.meta.url).href);
        this.load.image('lightPurple', new URL('assets/ColorPasscode/lightPurple.png',
            import.meta.url).href);
        this.load.image('lightBlue', new URL('assets/ColorPasscode/lightBlue.png',
            import.meta.url).href);
        this.load.image('darkRed', new URL('assets/ColorPasscode/darkRed.png',
            import.meta.url).href);
        this.load.image('darkYellow', new URL('assets/ColorPasscode/darkYellow.png',
            import.meta.url).href);
        this.load.image('darkPurple', new URL('assets/ColorPasscode/darkPurple.png',
            import.meta.url).href);
        this.load.image('darkBlue', new URL('assets/ColorPasscode/darkBlue.png',
            import.meta.url).href);
        this.load.audio(
            'MG_b4',
            new URL('assets/ColorPasscode/b4.wav', import.meta.url).href
        );
        this.load.audio(
            'MG_c4',
            new URL('assets/ColorPasscode/c4.wav', import.meta.url).href
        );
        this.load.audio(
            'MG_d4',
            new URL('assets/ColorPasscode/d4.wav', import.meta.url).href
        );
        this.load.audio(
            'MG_g4',
            new URL('assets/ColorPasscode/g4.wav', import.meta.url).href
        );
        this.load.audio(
            'demoDing',
            new URL('assets/ColorPasscode/passcodeding.wav', import.meta.url).href
        ); 
      //  this.load.audio(
       //     'start',
       //     new URL('assets/ColorPasscode/go.wav', import.meta.url).href
      //  );
        
    }

    create() {
        this.resetCPC();
        // this.startGamePad();
        this.makeSounds();
        this.drawUI();
        this.setText();
        // this.Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        // this.Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // this.Down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // this.Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);


        this.lightRed = this.add.sprite(408, 334, 'lightRed');
        this.lightYellow = this.add.sprite(678, 334, 'lightYellow');
        this.lightPurple = this.add.sprite(408, 522, 'lightPurple');
        this.lightBlue = this.add.sprite(678, 522, 'lightBlue');
        this.lightColorButtons = [this.lightRed, this.lightYellow, this.lightPurple, this.lightBlue];

        this.darkRed = this.add.sprite(408, 334, 'darkRed');
        this.darkYellow = this.add.sprite(678, 334, 'darkYellow');
        this.darkPurple = this.add.sprite(408, 522, 'darkPurple');
        this.darkBlue = this.add.sprite(678, 522, 'darkBlue');
        this.darkColorButtons = [this.darkRed, this.darkYellow, this.darkPurple, this.darkBlue];

        //scale buttons
        for (var i = 0; i < this.lightColorButtons.length; i++) {
            this.lightColorButtons[i].setScale(1.8);
            this.darkColorButtons[i].setScale(1.8);
        }
        this.hideBoard();

        this.g1 = this.add.sprite(340.5, 160, '');
        this.g2 = this.add.sprite(475.5, 160, '');
        this.g3 = this.add.sprite(610.5, 160, '');
        this.g4 = this.add.sprite(745.5, 160, '');
        this.guessBlocks = [this.g1, this.g2, this.g3, this.g4];
        this.hideGuessBlocks();

        //create pattern
        for (var i = 0; i < 4; i++) {
            this.pattern.push(this.getRandomInt(4));
        }
        // console.log(this.pattern);

        eventsCenter.on('start_game', () => { this.started2 = true; eventsCenter.emit('stop_timer'); });
        // console.log('start');
    }

    update(time, delta) {

        if (this.started2) {

            if (this.door1.alpha < 1) {

                //door fades in after 600ms
                this.time.delayedCall(600, () => {
                    this.door1.alpha += 0.008;
                }, [], this);
            }

            if (!this.started && this.door1.alpha === 1) {
                this.time.delayedCall(600, () => {
                    this.startGame();
                }, [], this);
                this.started = true;
            }

            if (this.goText.alpha > 0) {
                this.time.delayedCall(400, () => { this.goText.alpha -= 0.08; });
            }

            if (this.interactive && !this.gameOver) {
                this.t += delta;
                this.timeUp(this.t);
                // console.log(this.t);
                this.buttonHandlers.update();
                if (!this.gamePad) {
                    this.startGamePad();
                }
                this.userInput();
            }

            if (this.gameOver && !this.sent) {
                eventsCenter.emit('stop_timer');
                eventsCenter.emit("game-end", this.victory);
                this.sent = true;
            }

        }
    }

    startGamePad() {
        if (this.input.gamepad.total) {
            this.gamePad = this.input.gamepad.pad1;
            this.initGamePad();
            console.log(this.gamePad);
        }
    }

    initGamePad() {
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.7, () => this.userInput(3));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.7, () => this.userInput(1));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.7, () => this.userInput(2));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.7, () => this.userInput(0));
    }

    drawUI() {
        this.background = this.add.image(540, 360, 'brickWall');
        this.door1 = this.add.image(540, 360, 'door1');
        this.door1.alpha = 0;
        this.concrete = this.add.image(540, 360, 'concrete');
        this.concrete.depth = 1;
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

    setText() {
        this.goText = this.add.text(540, 360, '');
        this.goText.setStyle({
            fontSize: '120px',
            fill: '#000000',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 12
        });
        this.goText.setText('Go!');
        this.goText.setOrigin(0.5);
        this.goText.alpha = 0;
        this.goText.depth = 20;

        this.winText = this.add.text(540, 360, 'YOU WON!');
        this.winText.setStyle({
            fontSize: '160px',
            fill: '#00ff00',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.winText.setOrigin(0.5);
        this.winText.visible = false;
        this.winText.depth = 20;

        this.lossText = this.add.text(540, 360, 'YOU LOST!');
        this.lossText.setStyle({
            fontSize: '160px',
            fill: '#ff0000',
            align: 'center',
            stroke: '#808080',
            strokeThickness: 8
        });
        this.lossText.setOrigin(0.5);
        this.lossText.visible = false;
        this.lossText.depth = 20;
    }

    startGame() {
        this.showBoard();

        //flash pattern 1 second after board appears
        this.time.delayedCall(1000, this.flashPattern, [], this);

        //turns on interaction 4 seconds after board appear (4 * 500 + 2000 = 4000ms)
        this.time.delayedCall(this.pattern.length * 500 + 2000, () => {
            this.goText.alpha = 1;
            this.interactive = true;
            this.globalState.timerMessage('start_timer');
            this.hideGuessBlocks();
            for (var i = 0; i < this.guessBlocks.length; i++) {
                // console.log(i);
                this.guessBlocks[i].setTexture('');
              //  this.start.play({
               //     volume:1,
               //   });
            }
        }, [], this);
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

    //num = the pattern index that is flashed, ms = flash duration
    flash(num, ms, index) {

        //only used with flashPattern function
        if (index > -1) {
            var key;
            if (this.pattern[index] === 0) key = 'lightRed';
            if (this.pattern[index] === 1) key = 'lightYellow';
            if (this.pattern[index] === 2) key = 'lightPurple';
            if (this.pattern[index] === 3) key = 'lightBlue';
            this.guessBlocks[index].setTexture(key);
            this.guessBlocks[index].visible = true;
        }

        this.showDarkColor(num);
        this.time.delayedCall(ms, () => {
            this.showLightColor(num);
        }, [], this);

    }

    flashPattern() {
        for (var i = 0; i < this.pattern.length; i++) {

            //500ms between flashes and 300ms flash durations
            this.time.delayedCall(i * 500, this.flash, [this.pattern[i], 300, i], this);
            this.time.delayedCall(500);
            this.demoDing.play({
                volume:1,
          });
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

    //random int from 0 to max, EXCLUSIVE
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    //200ms flash duration
    userInput(x) {
        if (this.guessNum < 4) {
            // console.log(this.guessNum);
            if (x === 0) {
                this.flash(0, 200);
                this.guesses.push(0);
                this.guess();
            } else if (x === 1) {
                this.flash(1, 200);
                this.guesses.push(1);
                this.guess();
            } else if (x === 2) {
                this.flash(2, 200);
                this.guesses.push(2);
                this.guess();
            } else if (x === 3) {
                this.flash(3, 200);
                this.guesses.push(3);
                this.guess();
            }
        }
    }

    guess() {
        if (this.guessNum < 4) {
            this.showGuess(this.guesses[this.guessNum]);
            this.checkWL();
            this.guessNum++;
        }
    }

    //check win loss
    timeUp(t) {
        if (t > 6700) {
            this.lossText.visible = true;
            this.gameOver = true;
        }
    }
    checkWL() {

        //loss
        if (JSON.stringify(this.guesses[this.guessNum]) != JSON.stringify(this.pattern[this.guessNum])) {

            this.lossText.visible = true;
            this.gameOver = true;
        }

        //win
        if (JSON.stringify(this.guesses) == JSON.stringify(this.pattern)) {
            this.time.delayedCall(1500, this.win, [], this);
            this.victory = true;
        }
    }

    //each color has an index from 0 to 3
    showGuess(num) {
        var key;
        if (num === 0) {
            key = 'lightRed';
            this.c4.play({
                volume:1,
            });
        }
        else if (num === 1) {
            key = 'lightYellow';
            this.b4.play({
                volume:1,
            });
        }
        else if (num === 2) {
            key = 'lightPurple';
            this.d4.play({
                volume:1,
            });
        }
        else if (num === 3) {
            key = 'lightBlue';
            this.g4.play({
                volume:1,
            });
        }
        this.guessBlocks[this.guessNum].setTexture(key);
        this.guessBlocks[this.guessNum].visible = true;
    }

    win() {
        this.box.visible = false;
        this.hideBoard();
        this.hideGuessBlocks();
        this.time.delayedCall(600, this.openDoor, [], this);
    }

    openDoor() {
        this.door2.visible = true;
        this.time.delayedCall(200, () => {
            this.door3.visible = true;
        }, [], this);
        this.time.delayedCall(400, () => {
            this.door4.visible = true;
        }, [], this);
        this.time.delayedCall(600, () => {
            this.door5.visible = true;
        }, [], this);
        this.time.delayedCall(1000, () => {
            this.winText.visible = true;
            this.gameOver = true;
        }, [], this);
    }
    makeSounds(){
        this.b4 = this.sound.add('MG_b4');
        this.c4 = this.sound.add('MG_c4');
        this.d4 = this.sound.add('MG_d4');
        this.g4 = this.sound.add('MG_g4');
        this.demoDing = this.sound.add('demoDing');

    }
    resetCPC(){
        this.doors = [];
        this.t = 0;
        this.goTextTimer = 0;
        this.started = false;
        this.started2 = false;
        this.gameOver = false;
        this.victory = false;
        this.sent = false;
        this.startTimer = 0;
        this.lightColorButtons = [];
        this.darkColorButtons = [];
        this.pattern = [];

        this.g1, this.g2, this.g3, this.g4;
        this.guessBlocks = [];
        this.guesses = [];
        this.guessNum = 0;

        this.interactive = false;
        this.buttonHandlers = new ButtonPressHandlers();
        this.gamePad = null;
    }
}