import Phaser from 'phaser';
import eventsCenter from '../EventsCenter';

const SCALE_MULTIPLIER = 4.5;
const METER_WIDTH = 108;
const WIN_VALUE = 80;

export default class SockToss extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'SockToss',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 4500 }
                }
            }
        });
        // determines how low the sock can fall     
        this.floorval;
        // number tells us if the game is won - 0 for ongoing, 1 for won, 2 for lost
        this.victory = false;
        // tells us how full the meter is
        this.meterX;
        // tells us if the meter should be decreasing or increasing
        this.decreasing;
        // ontrol meter speed via updates
        this.timer;
        this.timer2;
        // boolean determining if game should be stopped
        this.stopped;
        // Game Object Declarations
        this.sock;
        this.hand;
        this.basket_b;
        this.basket_f;
        this.player;
        // toss/win/lose text images
        this.toss;
        this.win;
        this.lose;
        // for user input
        this.cursors;
        // tells us if the game has started
        this.tossed;
        this.started;
        // tells us the sock has been thrown
        this.thrown;
        // used to iterate an if-statement in update only once
        this.dropped;
        // meter to be masked
        this.meter;
        // meter frame
        this.meterF;
        // mask for meter
        this.mmask;
        // tossing ranges
        this.xrange;
        this.yrange;

        this.gameOver = false;
        this.sent = false;
        this.timerStopped = false;
    }

    preload() {
        this.load.image('background', new URL('assets/background.png', import.meta.url).href);
        this.load.image('floor', new URL('assets/floor.png', import.meta.url).href);
        this.load.image('basket_back', new URL('assets/basket_back.png', import.meta.url).href);
        this.load.image('basket_front', new URL('assets/basket_front.png', import.meta.url).href);
        this.load.image('hand_closed', new URL('assets/hand_closed.png', import.meta.url).href);
        this.load.image('hand_open', new URL('assets/hand_open.png', import.meta.url).href);
        this.load.image('hand_win', new URL('assets/hand_win.png', import.meta.url).href);
        this.load.image('hand_lose', new URL('assets/hand_lose.png', import.meta.url).href);
        this.load.image('meter', new URL('assets/meter.png', import.meta.url).href);
        this.load.image('meter_mask', new URL('assets/meter_mask.png', import.meta.url).href);
        this.load.image('meter_frame', new URL('assets/meter_frame.png', import.meta.url).href);
        this.load.image('sock', new URL('assets/sock.png', import.meta.url).href);
        this.load.image('sock_win', new URL('assets/win.png', import.meta.url).href);
        this.load.image('sock_lose', new URL('assets/lose.png', import.meta.url).href);
    }

    create() {
        // Add images to Scene
        this.add.image(1080 / 2, 720 / 2, 'background').setScale(SCALE_MULTIPLIER);
        this.basket_b = this.add.image(13 * SCALE_MULTIPLIER, 21 * SCALE_MULTIPLIER, 'basket_back');
        this.basket_b.setOrigin(0, 0);
        this.basket_b.setScale(SCALE_MULTIPLIER);
        this.basket_f = this.add.image(13 * SCALE_MULTIPLIER, 21 * SCALE_MULTIPLIER, 'basket_front');
        this.basket_f.setOrigin(0, 0);
        this.basket_f.setScale(SCALE_MULTIPLIER);
        // Add hand and sock sprites
        this.player = this.add.container(918, 368);
        this.hand = this.physics.add.sprite(0, 0, 'hand_open');
        this.hand.setScale(SCALE_MULTIPLIER);
        this.sock = this.physics.add.sprite(-2, -6, 'sock');
        this.sock.setScale(SCALE_MULTIPLIER);
        this.player.add(this.hand);
        this.player.add(this.sock);
        this.hand.body.setAllowGravity(false);
        this.sock.body.setAllowGravity(false);
        // Add win and lose text
        //this.toss = this.add.image(1080 / 2, 720 / 2, 'toss')
        //this.toss.setVisible(true)
        this.win = this.add.image(1080 / 2, 720 / 2, 'sock_win');
        this.win.setVisible(false);
        this.lose = this.add.image(1080 / 2, 720 / 2, 'sock_lose');
        this.lose.setVisible(false);
        // Add meter and frame
        this.meter = this.add.image(125 * SCALE_MULTIPLIER, 140 * SCALE_MULTIPLIER, 'meter');
        this.meter.setOrigin(0, 0);
        this.meter.setScale(SCALE_MULTIPLIER);
        this.meterF = this.add.image(125 * SCALE_MULTIPLIER, 140 * SCALE_MULTIPLIER, 'meter_frame');
        this.meterF.setOrigin(0, 0);
        this.meterF.setScale(SCALE_MULTIPLIER);
        // Add meter mask
        this.mmask = this.make.graphics();
        this.mmask.fillStyle(0xffffff);
        this.mmask.beginPath();
        this.mmask.fillRect(127 * SCALE_MULTIPLIER, 142 * SCALE_MULTIPLIER, 0, 14 * SCALE_MULTIPLIER);
        const mask = this.mmask.createGeometryMask();
        this.meter.setMask(mask);
        // Initialize keyboard manager
        this.cursors = this.input.keyboard.createCursorKeys();
        // set default values
        this.tossed = false;
        this.started = false;
        this.thrown = false;
        this.dropped = false;
        this.player.angle += 30;
        this.meterX = 0;
        this.timer = 0;
        this.timer2 = 0;
        //this.toss.scale = 0

        eventsCenter.on('start_game', () => { if (!this.gameOver) { this.started = true; eventsCenter.emit('start_timer'); } });

        this.anims.create({
            key: 'throw',
            frames: [{ key: 'hand_closed' }]
        });
        this.anims.create({
            key: 'win',
            frames: [{ key: 'hand_win' }]
        });
        this.anims.create({
            key: 'lose',
            frames: [{ key: 'hand_lose' }]
        });
    }
    update() {
        // this nested if-statement plays the intro "TOSS" text
        // Started will be set to true at the end
        if (this.started) {
            this.timer++;
            if (this.cursors.space.isDown) {
                this.thrown = true;
            }
            // Game runtime code
            if (!this.thrown) {
                this.throwncon();
            }
            // Run when spacebar is pressed
            else {   // Runs dropping code only once
                if (!this.dropped) {
                    this.dropcon(this);
                    eventsCenter.emit('stop_timer');
                }
                // Spins hand for throw
                this.handrot();
                // When sock lands
                if (this.sock.y >= this.floorval) {
                    // Runs stopping code only once
                    if (!this.stopped) {
                        this.sockstop();
                    }
                    this.endcon();
                    if (this.gameOver && !this.sent) {
                        this.globalState.timerMessage('stop_timer');
                        this.globalState.sendMessage(this.victory);
                        this.sent = true;
                    }
                }
            }

        }
    }
    maskdraw() {
        this.mmask.clear();
        this.mmask.fillRect(127 * SCALE_MULTIPLIER, 142 * SCALE_MULTIPLIER, (this.meterX + 1) * SCALE_MULTIPLIER, 14 * SCALE_MULTIPLIER);
    }
    // tosstext() {
    //     // grow "TOSS" until it reaches max scale
    //     if (this.toss.scale < 4) {
    //         this.toss.scale += 0.1;
    //     }
    //     // once "TOSS" is maxed, we pause for 50 milliseconds before starting the game
    //     else {
    //         this.timer2++
    //         // make sure 50 ms have elapsed, then set started to true
    //         if (this.timer2 > 50) {
    //             this.toss.setVisible(false)
    //             this.started = true
    //         }
    //     }
    // }
    throwncon() {
        //framerate check
        if (this.timer == 1) {
            //reset timer
            this.timer = 0;
            // check to see which way meter should move
            this.metercheck();
            // move player/adjust meterx
            this.playermove();
            // redraw mask
            this.maskdraw();
        }
    }
    // QOL function for oscilating between two values
    dircheck(dec, inc) {
        if (dec) {
            this.decreasing = true;
        }
        if (inc) {
            this.decreasing = false;
        }
    }
    metercheck() {
        this.dircheck(this.meterX >= METER_WIDTH, this.meterX <= 0);
    }
    playermove() {
        // move the meter in that direction
        if (this.decreasing) {
            this.deccon();
        }
        else {
            this.inccon();
        }
        // move hand
        this.player.y = ((METER_WIDTH - this.meterX) * 0.3 + 50) * SCALE_MULTIPLIER;
    }
    deccon() {
        this.player.x += (this.meterX / METER_WIDTH) * SCALE_MULTIPLIER;
        this.meterX -= 2;
        this.player.angle += 30 / 54;
    }
    inccon() {
        this.meterX += 2;
        this.player.x -= (this.meterX / METER_WIDTH) * SCALE_MULTIPLIER;
        this.player.angle -= 30 / 54;
    }
    handrot() {
        if (this.hand.angle > -90) {
            this.hand.angle -= (15 / Math.sqrt(2));
        }
    }
    dropcon() {
        this.timer = 0;

        this.hand.anims.play('throw');
        this.player.remove(this.sock);
        this.sock.x = this.player.x - (2 * SCALE_MULTIPLIER);
        this.sock.y = this.player.y - (6 * SCALE_MULTIPLIER);
        this.sock.angle = this.player.angle;
        this.sock.body.setAllowGravity(true);

        if (this.meterX >= WIN_VALUE) {

            this.xrange = (-1 * (60 + 10 * ((this.meterX - 80) / 28))) * SCALE_MULTIPLIER;
            this.yrange = -755 * SCALE_MULTIPLIER;
            this.basket_f = this.physics.add.sprite(13 * SCALE_MULTIPLIER, 21 * SCALE_MULTIPLIER, 'basket_front');
            this.basket_f.setOrigin(0, 0);
            this.basket_f.setScale(SCALE_MULTIPLIER);
            this.basket_f.body.setAllowGravity(false);

            this.floorval = 720 / 2;
            this.victory = true;
        }
        else {
            this.xrange = (-70 * this.meterX / (METER_WIDTH)) * SCALE_MULTIPLIER;
            this.yrange = (-755 * this.meterX / (METER_WIDTH - 28)) * SCALE_MULTIPLIER;

            this.floorval = 720 * .75;
            this.victory = false;
        }

        this.sock.setVelocityX(this.xrange);
        this.sock.setVelocityY(this.yrange);
        this.meter.setDepth(1);
        this.meterF.setDepth(1);
        this.dropped = true;
    }
    sockstop() {
        this.stopped = true;
        this.timer = 0;
        this.sock.setVelocity(0, 0);
        this.sock.body.setAllowGravity(false);
    }
    endcon() {
        this.player.angle = 0;
        this.hand.angle = 0;
        if (this.victory) {
            this.wincon();
        } else {
            this.losecon();
        }
    }
    wincon() {
        this.hand.anims.play('win');
        this.win.setDepth(2);
        this.win.setVisible(true);
        this.player.x = 200 * SCALE_MULTIPLIER;
        this.player.y = 26 * SCALE_MULTIPLIER;
        if (this.win.scale < 4) {
            this.win.scale += 1 / 4;
        }
        else
            setTimeout(() => {
                this.gameOver = true;
            }, 1500);
        this.dircheck(this.player.scale >= 1.2, this.player.scale <= 1);
        if (this.decreasing) {
            this.player.scale -= 0.01;
        }
        else {
            this.player.scale += 0.01;
        }
        // close doors
    }
    losecon() {
        this.hand.anims.play('lose');
        this.lose.setDepth(2);
        this.lose.setVisible(true);
        this.player.x = 200 * SCALE_MULTIPLIER;
        this.player.y = 60 * SCALE_MULTIPLIER;
        if (this.lose.scale < 4) {
            this.lose.scale += 1 / 4;
        }
        else
            setTimeout(() => {
                this.gameOver = true;
            }, 1500);
        this.dircheck(this.player.scale >= 1, this.player.scale <= 0.8);
        if (this.decreasing) {
            this.player.scale -= 0.005;
        }
        else {
            this.player.scale += 0.005;
        }
    }
}