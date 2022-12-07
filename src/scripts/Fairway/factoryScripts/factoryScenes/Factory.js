import Phaser from 'phaser';
import eventsCenter from "../../../EventsCenter";
import ButtonPressHandlers from '../../../ButtonPressHandlers';
export default class Factory extends Phaser.Scene {
    constructor() {
        super({
            active: false,
            visible: true,
            key: 'Factory',
        });
        this.player;
        this.playerBoxA;
        this.playerBoxB;
        this.playerBoxC;
        this.playerBoxD;
        this.t = 0;
        this.currBoxIdx = 0;
        this.cursors;
        this.scoreA = 1;
        this.scoreB = 1;
        this.scoreC = 1;
        this.scoreD = 1;
        this.scoreTextA;
        this.scoreTextB;
        this.scoreTextC;
        this.scoreTextD;
        this.left;
        this.right;
        this.up;
        this.down;
        this.space;
        this.moveBeep;
        this.pickUpBeep;
        this.scoreBeep;
        this.loseBeep;
        this.beltBeep;
        this.discardBeep;
        this.boxA;
        this.boxB;
        this.boxC;
        this.boxD;
        this.conveBelt;
        this.placeholderA;
        this.placeholderB;
        this.placeholderC;
        this.placeholderD;
        this.homeScreen;
        this.timer = 0;
        this.trash;
        this.canMove = true;
        this.spaceDown = false;
        this.gamePad = null;
        this.buttonHandlers = new ButtonPressHandlers();
        this.pad;
        this.gameOver = false;
        this.victory = false;
        this.sent = false;
        this.started = false;
    }
    preload() {
        this.load.image('background', new URL('../factoryAssets/factoryBackground.png',
            import.meta.url).href);
        this.load.image('worker', new URL('../factoryAssets/factoryWorker.png',
            import.meta.url).href);
        this.load.image('boxa', new URL('../factoryAssets/Box_A.png',
            import.meta.url).href);
        this.load.image('boxb', new URL('../factoryAssets/Box_B.png',
            import.meta.url).href);
        this.load.image('boxc', new URL('../factoryAssets/Box_C.png',
            import.meta.url).href);
        this.load.image('boxd', new URL('../factoryAssets/Box_D.png',
            import.meta.url).href);
        this.load.image('place', new URL('../factoryAssets/place.png',
            import.meta.url).href);
        this.load.image('boxworkera', new URL('../factoryAssets/boxWorkerA.png',
            import.meta.url).href);
        this.load.image('boxworkerb', new URL('../factoryAssets/boxWorkerB.png',
            import.meta.url).href);
        this.load.image('boxworkerc', new URL('../factoryAssets/boxWorkerC.png',
            import.meta.url).href);
        this.load.image('boxworkerd', new URL('../factoryAssets/boxWorkerD.png',
            import.meta.url).href);
        this.load.image('win1', new URL('../factoryAssets/youWin.png',
            import.meta.url).href);
        this.load.image('lose', new URL('../factoryAssets/youLose.png',
            import.meta.url).href);
        this.load.image('homescreen', new URL('../factoryAssets/startScreen.png',
            import.meta.url).href);
        this.load.image('trash', new URL('../factoryAssets/trashCan.png',
            import.meta.url).href);
        this.load.audio('move', new URL('../factoryAssets/move.mp3',
            import.meta.url).href);
        this.load.audio('pickup', new URL('../factoryAssets/pickUp.mp3',
            import.meta.url).href);
        this.load.audio('score', new URL('../factoryAssets/score.mp3',
            import.meta.url).href);
        this.load.audio('lose', new URL('../factoryAssets/lose.mp3',
            import.meta.url).href);
        this.load.audio('belt', new URL('../factoryAssets/belt.mp3',
            import.meta.url).href);
        this.load.audio('discard', new URL('../factoryAssets/discard.mp3',
            import.meta.url).href);
    }
    create() {
        this.canMove = true;
        this.conveBelt = [];
        this.userInput();
        this.addImages();
        this.boxList = [this.boxA, this.boxB, this.boxC, this.boxD];
        this.addOverlap();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.moveBeep = this.sound.add('move');
        this.pickUpBeep = this.sound.add('pickup');
        this.scoreBeep = this.sound.add('score');
        this.loseBeep = this.sound.add('lose');
        this.beltBeep = this.sound.add('belt');
        this.discardBeep = this.sound.add('discard');
        this.scoreTextA = this.add.text(827, 140, 1, {
            fontSize: '20px',
            fill: '#000',
        });
        this.scoreTextB = this.add.text(827, 290, 1, {
            fontSize: '20px',
            fill: '#000',
        });
        this.scoreTextC = this.add.text(827, 442, 1, {
            fontSize: '20px',
            fill: '#000',
        });
        this.scoreTextD = this.add.text(827, 591, 1, {
            fontSize: '20px',
            fill: '#000',
        });
        this.populateConveBelt();

        eventsCenter.on('start_game', () => {
            this.started = true;
            this.globalState.timerMessage('start_timer');
        });
    }
    addImages() {
        this.add.image(540, 360, 'background');
        this.player = this.physics.add.image(660, 190, 'worker');
        this.playerBoxA = this.physics.add.image(660, 190, 'boxworkera');
        this.playerBoxA.visible = false;
        this.playerBoxB = this.physics.add.image(660, 340, 'boxworkerb');
        this.playerBoxB.visible = false;
        this.playerBoxC = this.physics.add.image(660, 490, 'boxworkerc');
        this.playerBoxC.visible = false;
        this.playerBoxD = this.physics.add.image(660, 640, 'boxworkerd');
        this.playerBoxD.visible = false;
        this.boxA = this.physics.add.image(135, 190, 'boxa');
        this.boxA.visible = false;
        this.boxA.body.setSize(300, 15);
        this.boxB = this.physics.add.image(135, 190, 'boxb');
        this.boxB.visible = false;
        this.boxB.body.setSize(300, 15);
        this.boxC = this.physics.add.image(135, 190, 'boxc');
        this.boxC.visible = false;
        this.boxC.body.setSize(300, 15);
        this.boxD = this.physics.add.image(135, 190, 'boxd');
        this.boxD.visible = false;
        this.boxD.body.setSize(300, 15);
        this.placeholderA = this.physics.add.image(800, 190, 'place');
        this.placeholderA.body.setSize(200, 15);
        this.placeholderB = this.physics.add.image(800, 340, 'place');
        this.placeholderB.body.setSize(200, 15);
        this.placeholderC = this.physics.add.image(800, 490, 'place');
        this.placeholderC.body.setSize(200, 15);
        this.placeholderD = this.physics.add.image(800, 640, 'place');
        this.placeholderD.body.setSize(200, 15);
        this.trash = this.physics.add.image(330, 161, 'trash');
        this.trash.body.setSize(40, 400);
    }
    addOverlap() {
        this.physics.add.overlap(this.placeholderA, this.playerBoxA, this.onDepositA, null, this);
        this.physics.add.overlap(this.placeholderA, this.playerBoxB, this.gameOverB, null, this);
        this.physics.add.overlap(this.placeholderA, this.playerBoxC, this.gameOverC, null, this);
        this.physics.add.overlap(this.placeholderA, this.playerBoxD, this.gameOverD, null, this);
        this.physics.add.overlap(this.placeholderB, this.playerBoxB, this.onDepositB, null, this);
        this.physics.add.overlap(this.placeholderB, this.playerBoxA, this.gameOverA, null, this);
        this.physics.add.overlap(this.placeholderB, this.playerBoxC, this.gameOverC, null, this);
        this.physics.add.overlap(this.placeholderB, this.playerBoxD, this.gameOverD, null, this);
        this.physics.add.overlap(this.placeholderC, this.playerBoxC, this.onDepositC, null, this);
        this.physics.add.overlap(this.placeholderC, this.playerBoxA, this.gameOverA, null, this);
        this.physics.add.overlap(this.placeholderC, this.playerBoxB, this.gameOverB, null, this);
        this.physics.add.overlap(this.placeholderC, this.playerBoxD, this.gameOverD, null, this);
        this.physics.add.overlap(this.placeholderD, this.playerBoxD, this.onDepositD, null, this);
        this.physics.add.overlap(this.placeholderD, this.playerBoxA, this.gameOverA, null, this);
        this.physics.add.overlap(this.placeholderD, this.playerBoxB, this.gameOverB, null, this);
        this.physics.add.overlap(this.placeholderD, this.playerBoxC, this.gameOverC, null, this);
        this.physics.add.overlap(this.trash, this.playerBoxA, this.onDiscardA, null, this);
        this.physics.add.overlap(this.trash, this.playerBoxB, this.onDiscardB, null, this);
        this.physics.add.overlap(this.trash, this.playerBoxC, this.onDiscardC, null, this);
        this.physics.add.overlap(this.trash, this.playerBoxD, this.onDiscardD, null, this);
    }
    userInput() {
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(time, delta) {
        if (this.started) {
            this.t += delta;
            this.timer++;
            if (this.timer >= 20 && this.canMove) {
                this.moveBoxes(this.currBoxIdx);
                this.currBoxIdx === this.boxList.length - 1 ? this.currBoxIdx = 0 : this.currBoxIdx += 1;
                this.timer = 0;
            }
            this.spaceDown = false;
            this.movePlayer();
            this.timeRun(this.t);
            this.buttonHandlers.update();
            if (!this.gamePad) {
                this.startGamePad();
            }

        }
        if (this.gameOver && !this.sent) {
            eventsCenter.emit('stop_timer');
            eventsCenter.emit("game-end", this.victory);
            this.sent = true;
        }
    }
    initGamePad() {
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 1, () => this.onDownInput());
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === -1, () => this.onUpInput());
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 1, () => this.onRightInput());
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === -1, () => this.onLeftInput());
        this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => {
            this.spaceDown = true;
        });
    }
    startGamePad() {
        if (this.input.gamepad.total) {
            this.gamePad = this.input.gamepad.pad1;
            this.initGamePad();
            console.log(this.gamePad);
        }
    }
    timeRun(t) {
        if (this.t >= 7000) {
            this.gameOverValues();
        }
    }
    moveBoxes() {
        for (let i = 0; i < this.conveBelt.length; i++) {
            let curBox = this.conveBelt[i];
            this.beltBeep.play({
                volume: 0.2
            });
            curBox.y += 75;
            if (curBox.y === 265) {
                this.conveBelt[i].setVisible(true);
            }
        }
        if (this.conveBelt[this.conveBelt.length - 1].y >= 865) {
            const randomIdx = Phaser.Math.Between(0, this.boxList.length - 1);
            const boxListCopy = [...this.boxList];
            const boxStrs = ['boxa', 'boxb', 'boxc', 'boxd'];
            const newBox = this.physics.add.image(135, 190, boxStrs[randomIdx]);
            this.addCollision(newBox);
            newBox.y = 265;
            newBox.visible = true;
            newBox.body.setSize(300, 15);
            this.conveBelt.pop();
            this.conveBelt.unshift(newBox);
        }
    }
    intitalizeConveBelt() {
        const listOfBoxesCopy = [...this.boxList];
        for (let i = 0; i < this.boxList.length; i++) {
            let randomIdx = Phaser.Math.Between(0, listOfBoxesCopy.length - 1);
            this.conveBelt[i] = listOfBoxesCopy[randomIdx];
            this.addCollision(this.conveBelt[i]);
            listOfBoxesCopy.splice(randomIdx, 1);
        }
    }
    populateConveBelt() {
        if (this.conveBelt.length === 0) {
            this.intitalizeConveBelt();
        }
        let startingYPos = -260;
        for (let i = 0; i < this.conveBelt.length; i++) {
            let curBox = this.conveBelt[i];
            curBox.y = startingYPos;
            startingYPos += 75 * 2;
        }
    }
    onPlayerMoveRight() {
        if (this.player.y === 340) {
            this.player.x = 660;
        }
        if (this.playerBoxA.y === 340 && this.playerBoxA.visible) {
            this.playerBoxA.x = 660;
        }
        if (this.playerBoxB.y === 340 && this.playerBoxB.visible) {
            this.playerBoxB.x = 660;
        }
        if (this.playerBoxC.y === 340 && this.playerBoxC.visible) {
            this.playerBoxC.x = 660;
        }
        if (this.playerBoxD.y === 340 && this.playerBoxD.visible) {
            this.playerBoxD.x = 660;
        }
        this.player.body.setSize(4, 4);
        if (this.playerBoxA.visible) {
            this.playerBoxA.body.setSize(120, 120);
        } else if (this.playerBoxB.visible) {
            this.playerBoxB.body.setSize(120, 120);
        } else if (this.playerBoxC.visible) {
            this.playerBoxC.body.setSize(120, 120);
        } else if (this.playerBoxD.visible) {
            this.playerBoxD.body.setSize(120, 120);
        }
        this.trash.body.setSize(4, 4);
    }
    onPlayerMoveLeft() {
        if (this.player.y === 340) {
            this.player.x = 315;
        }
        if (this.playerBoxA.y === 340 && this.playerBoxA.visible) {
            this.playerBoxA.x = 315;
        }
        if (this.playerBoxB.y === 340 && this.playerBoxB.visible) {
            this.playerBoxB.x = 315;
        }
        if (this.playerBoxC.y === 340 && this.playerBoxC.visible) {
            this.playerBoxC.x = 315;
        }
        if (this.playerBoxD.y === 340 && this.playerBoxD.visible) {
            this.playerBoxD.x = 315;
        }
        this.player.body.setSize(120, 120);
        this.playerBoxA.body.setSize(4, 4);
        this.playerBoxB.body.setSize(4, 4);
        this.playerBoxC.body.setSize(4, 4);
        this.playerBoxD.body.setSize(4, 4);
        this.trash.body.setSize(4, 4);
    }
    onPlayerMoveUp() {
        if (this.player.y === 490) {
            this.player.y = 340;
        } else if (this.player.y === 640) {
            this.player.y = 490;
        } else if (this.player.y === 340 && this.player.x === 660) {
            this.player.y = 190;
        }
        if (this.playerBoxA.y === 490 && this.playerBoxA.visible) {
            this.playerBoxA.y = 340;
        } else if (this.playerBoxA.y === 640 && this.playerBoxA.visible) {
            this.playerBoxA.y = 490;
        } else if (this.playerBoxA.y === 340 && this.playerBoxA.x === 660 && this.playerBoxA.visible) {
            this.playerBoxA.y = 190;
        }
        if (this.playerBoxB.y === 490 && this.playerBoxB.visible) {
            this.playerBoxB.y = 340;
        } else if (this.playerBoxB.y === 640 && this.playerBoxB.visible) {
            this.playerBoxB.y = 490;
        } else if (this.playerBoxB.y === 340 && this.playerBoxB.x === 660 && this.playerBoxB.visible) {
            this.playerBoxB.y = 190;
        }
        if (this.playerBoxC.y === 490 && this.playerBoxC.visible) {
            this.playerBoxC.y = 340;
        } else if (this.playerBoxC.y === 640 && this.playerBoxC.visible) {
            this.playerBoxC.y = 490;
        } else if (this.playerBoxC.y === 340 && this.playerBoxC.x === 660 && this.playerBoxC.visible) {
            this.playerBoxC.y = 190;
        }
        if (this.playerBoxD.y === 490 && this.playerBoxD.visible) {
            this.playerBoxD.y = 340;
        } else if (this.playerBoxD.y === 640 && this.playerBoxD.visible) {
            this.playerBoxD.y = 490;
        } else if (this.playerBoxD.y === 340 && this.playerBoxD.x === 660 && this.playerBoxD.visible) {
            this.playerBoxD.y = 190;
        }
        this.player.body.setSize(4, 4);
        this.playerBoxA.body.setSize(4, 4);
        this.playerBoxB.body.setSize(4, 4);
        this.playerBoxC.body.setSize(4, 4);
        this.playerBoxD.body.setSize(4, 4);
        if (this.playerBoxA.visible || this.playerBoxB.visible || this.playerBoxC.visible || this.playerBoxD.visible) {
            this.trash.body.setSize(40, 400);
        } else {
            this.trash.body.setSize(4, 4);
        }
    }
    onPlayerMoveDown() {
        if (this.player.y === 490) {
            this.player.y = 640;
        } else if (this.player.y === 340) {
            this.player.y = 490;
        } else if (this.player.y === 190) {
            this.player.y = 340;
        }
        if (this.playerBoxA.y === 490 && this.playerBoxA.visible) {
            this.playerBoxA.y = 640;
        } else if (this.playerBoxA.y === 340 && this.playerBoxA.visible) {
            this.playerBoxA.y = 490;
        } else if (this.playerBoxA.y === 190 && this.playerBoxA.visible) {
            this.playerBoxA.y = 340;
        }
        if (this.playerBoxB.y === 490 && this.playerBoxB.visible) {
            this.playerBoxB.y = 640;
        } else if (this.playerBoxB.y === 340 && this.playerBoxB.visible) {
            this.playerBoxB.y = 490;
        } else if (this.playerBoxB.y === 190 && this.playerBoxB.visible) {
            this.playerBoxB.y = 340;
        }
        if (this.playerBoxC.y === 490 && this.playerBoxC.visible) {
            this.playerBoxC.y = 640;
        } else if (this.playerBoxC.y === 340 && this.playerBoxC.visible) {
            this.playerBoxC.y = 490;
        } else if (this.playerBoxC.y === 190 && this.playerBoxC.visible) {
            this.playerBoxC.y = 340;
        }
        if (this.playerBoxD.y === 490 && this.playerBoxD.visible) {
            this.playerBoxD.y = 640;
        } else if (this.playerBoxD.y === 340 && this.playerBoxD.visible) {
            this.playerBoxD.y = 490;
        } else if (this.playerBoxD.y === 190 && this.playerBoxD.visible) {
            this.playerBoxD.y = 340;
        }
        this.player.body.setSize(4, 4);
        this.playerBoxA.body.setSize(4, 4);
        this.playerBoxB.body.setSize(4, 4);
        this.playerBoxC.body.setSize(4, 4);
        this.playerBoxD.body.setSize(4, 4);
        this.trash.body.setSize(4, 4);
    }
    movePlayer() {
        if (Phaser.Input.Keyboard.JustDown(this.left)) {
            this.onPlayerMoveLeft();
            this.moveBeep.play();
            this.player.rotation = 0;
            this.playerBoxA.rotation = 0;
            this.playerBoxB.rotation = 0;
            this.playerBoxC.rotation = 0;
            this.playerBoxD.rotation = 0;
            console.log('Moved Left!');
        }
        if (Phaser.Input.Keyboard.JustDown(this.right)) {
            this.onPlayerMoveRight();
            this.moveBeep.play();
            this.player.rotation = 3.13;
            this.playerBoxA.rotation = 3.13;
            this.playerBoxB.rotation = 3.13;
            this.playerBoxC.rotation = 3.13;
            this.playerBoxD.rotation = 3.13;
            console.log('Moved Right!');
        }
        if (Phaser.Input.Keyboard.JustDown(this.up)) {
            this.onPlayerMoveUp();
            this.moveBeep.play();
            this.player.rotation = 1.58;
            this.playerBoxA.rotation = 1.58;
            this.playerBoxB.rotation = 1.58;
            this.playerBoxC.rotation = 1.58;
            this.playerBoxD.rotation = 1.58;
            console.log('Moved Up!');
        }
        if (Phaser.Input.Keyboard.JustDown(this.down)) {
            this.onPlayerMoveDown();
            this.moveBeep.play();
            this.player.rotation = 4.73;
            this.playerBoxA.rotation = 4.73;
            this.playerBoxB.rotation = 4.73;
            this.playerBoxC.rotation = 4.73;
            this.playerBoxD.rotation = 4.73;
            console.log('Moved Down!');
        }
    }
    onLeftInput() {
        this.onPlayerMoveLeft();
        this.moveBeep.play();
        this.player.rotation = 0;
        this.playerBoxA.rotation = 0;
        this.playerBoxB.rotation = 0;
        this.playerBoxC.rotation = 0;
        this.playerBoxD.rotation = 0;
        console.log('Moved Left!');
    }
    onRightInput() {
        this.onPlayerMoveRight();
        this.moveBeep.play();
        this.player.rotation = 3.13;
        this.playerBoxA.rotation = 3.13;
        this.playerBoxB.rotation = 3.13;
        this.playerBoxC.rotation = 3.13;
        this.playerBoxD.rotation = 3.13;
        console.log('Moved Right!');
    }
    onUpInput() {
        this.onPlayerMoveUp();
        this.moveBeep.play();
        this.player.rotation = 1.58;
        this.playerBoxA.rotation = 1.58;
        this.playerBoxB.rotation = 1.58;
        this.playerBoxC.rotation = 1.58;
        this.playerBoxD.rotation = 1.58;
        console.log('Moved Up!');
    }
    onDownInput() {
        this.onPlayerMoveDown();
        this.moveBeep.play();
        this.player.rotation = 4.73;
        this.playerBoxA.rotation = 4.73;
        this.playerBoxB.rotation = 4.73;
        this.playerBoxC.rotation = 4.73;
        this.playerBoxD.rotation = 4.73;
        console.log('Moved Down!');
    }
    addCollision(box) {
        this.physics.add.collider(box, this.player, () => {
            this.onColidPickup(box);
        });
    }
    onColidPickup(box) {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown && this.player.visible) {
            if (box.texture.key === 'boxa' && this.player.visible) {
                this.playerBoxA.visible = true;
                this.playerBoxA.x = this.player.x;
                this.playerBoxA.y = this.player.y;
                console.log('Picked Up Box A!');
            }
            if (box.texture.key === 'boxb' && this.player.visible) {
                this.playerBoxB.visible = true;
                this.playerBoxB.x = this.player.x;
                this.playerBoxB.y = this.player.y;
                console.log('Picked Up Box B!');
            }
            if (box.texture.key === 'boxc' && this.player.visible) {
                this.playerBoxC.visible = true;
                this.playerBoxC.x = this.player.x;
                this.playerBoxC.y = this.player.y;
                console.log('Picked Up Box C!');
            }
            if (box.texture.key === 'boxd' && this.player.visible) {
                this.playerBoxD.visible = true;
                this.playerBoxD.x = this.player.x;
                this.playerBoxD.y = this.player.y;
                console.log('Picked Up Box D!');
            }
            box.visible = false;
            box.body.setSize(4, 4);
            this.player.visible = false;
            this.pickUpBeep.play();
            this.spaceDown = false;
        }
    }
    onDepositA() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxA.visible && this.playerBoxA.y === 190) {
                this.scoreBeep.play();
                this.playerBoxA.visible = false;
                this.player.visible = true;
                this.player.x = 660;
                this.player.y = 190;
                this.depositSize();
                this.scoreA -= 1;
                this.scoreTextA.setText(`${this.scoreA}`);
                console.log('Deposited Box A!');
                this.scoreMaxA();
                this.gameWin();
                this.spaceDown = false;
            }
        }
    }
    onDepositB() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxB.visible && this.playerBoxB.y === 340 && this.playerBoxB.x === 660) {
                this.scoreBeep.play();
                this.playerBoxB.visible = false;
                this.player.visible = true;
                this.player.x = 660;
                this.player.y = 340;
                this.depositSize();
                this.scoreB -= 1;
                this.scoreTextB.setText(`${this.scoreB}`);
                console.log('Deposited Box B!');
                this.scoreMaxB();
                this.gameWin();
                this.spaceDown = false;
            }
        }
    }
    onDepositC() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxC.visible && this.playerBoxC.y === 490 && this.playerBoxC.x === 660) {
                this.scoreBeep.play();
                this.playerBoxC.visible = false;
                this.player.visible = true;
                this.player.x = 660;
                this.player.y = 490;
                this.depositSize();
                this.scoreC -= 1;
                this.scoreTextC.setText(`${this.scoreC}`);
                console.log('Deposited Box C!');
                this.scoreMaxC();
                this.gameWin();
                this.spaceDown = false;
            }
        }
    }
    onDepositD() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxD.visible && this.playerBoxD.y === 640 && this.playerBoxD.x === 660) {
                this.scoreBeep.play();
                this.playerBoxD.visible = false;
                this.player.visible = true;
                this.player.x = 660;
                this.player.y = 640;
                this.depositSize();
                this.scoreD -= 1;
                this.scoreTextD.setText(`${this.scoreD}`);
                console.log('Deposited Box D!');
                this.scoreMaxD();
                this.gameWin();
                this.spaceDown = false;
            }
        }
    }
    scoreMaxA() {
        if (this.scoreA <= 0) {
            this.scoreTextA.setText('✓');
            this.placeholderA.body.setSize(4, 4);
            console.log('All 4 A-Boxes Deposited!');
        }
    }
    scoreMaxB() {
        if (this.scoreB <= 0) {
            this.scoreTextB.setText('✓');
            this.placeholderB.body.setSize(4, 4);
            console.log('All 4 B-Boxes Deposited!');
        }
    }
    scoreMaxC() {
        if (this.scoreC <= 0) {
            this.scoreTextC.setText('✓');
            this.placeholderC.body.setSize(4, 4);
            console.log('All 4 C-Boxes Deposited!');
        }
    }
    scoreMaxD() {
        if (this.scoreD <= 0) {
            this.scoreTextD.setText('✓');
            this.placeholderD.body.setSize(4, 4);
            console.log('All 4 D-Boxes Deposited!');
        }
    }
    depositSize() {
        this.playerBoxA.body.setSize(4, 4);
        this.playerBoxB.body.setSize(4, 4);
        this.playerBoxC.body.setSize(4, 4);
        this.playerBoxD.body.setSize(4, 4);
    }
    onDiscardA() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxA.visible && this.playerBoxA.x === 315 && this.playerBoxA.y === 340) {
                this.playerBoxA.visible = false;
                this.playerBoxA.x = 660;
                this.playerBoxA.y = 190;
                this.discardValues();
                console.log('Discarded Box A!');
                this.spaceDown = false;
            }
        }
    }
    onDiscardB() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxB.visible && this.playerBoxB.x === 315 && this.playerBoxB.y === 340) {
                this.playerBoxB.visible = false;
                this.playerBoxB.x = 660;
                this.playerBoxB.y = 340;
                this.discardValues();
                console.log('Discarded Box B!');
                this.spaceDown = false;
            }
        }
    }
    onDiscardC() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxC.visible && this.playerBoxC.x === 315 && this.playerBoxC.y === 340) {
                this.playerBoxC.visible = false;
                this.playerBoxC.x = 660;
                this.playerBoxC.y = 490;
                this.discardValues();
                console.log('Discarded Box C!');
                this.spaceDown = false;
            }
        }
    }
    onDiscardD() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxD.visible && this.playerBoxD.x === 315 && this.playerBoxD.y === 340) {
                this.playerBoxD.visible = false;
                this.playerBoxD.x = 660;
                this.playerBoxD.y = 640;
                this.discardValues();
                console.log('Discarded Box D!');
                this.spaceDown = false;
            }
        }
    }
    discardValues() {
        this.discardBeep.play({
            volume: 0.4
        });
        this.player.visible = true;
        this.player.x = 315;
        this.player.y = 340;
    }
    gameOverA() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxA.visible) {
                this.gameOverValues();
            }
        }
    }
    gameOverB() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxB.visible) {
                this.gameOverValues();
            }
        }
    }
    gameOverC() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxC.visible) {
                this.gameOverValues();
            }
        }
    }
    gameOverD() {
        if (Phaser.Input.Keyboard.JustDown(this.space) || this.spaceDown) {
            if (this.playerBoxD.visible) {
                this.gameOverValues();
            }
        }
    }
    gameOverValues() {
        this.add.image(540, 360, 'lose');
        this.loseBeep.play();
        this.boxA.visible = false;
        this.boxB.visible = false;
        this.boxC.visible = false;
        this.boxD.visible = false;
        this.scene.pause();
        console.log('You Lost!');
        this.gameOver = true;
    }
    gameWin() {
        if (this.scoreA + this.scoreB + this.scoreC + this.scoreD <= 1) {
            this.add.image(540, 360, 'win1');
            this.scene.pause();
            console.log('You Won!');
            this.victory = true;
            this.gameOver = true;
        }
    }
}