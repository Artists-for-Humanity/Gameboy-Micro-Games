import Phaser from 'phaser';
const X = 1080
const Y = 720

const L_END = X / 4
const L_START = -L_END


const R_START = 5 * L_END
const R_END = 3 * L_END
export default class CutScreen extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: true,
            visible: true,
            key: 'CutScreen',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            }
        });
        this.close_timer = 0
        this.life_total = 5
        this.closed = false
        this.open = false

        this.lost
        this.score = 0

        this.space

        this.heart
        this.gba
        this.life_group
        this.socket
        this.socket_group
        this.l_door
        this.r_door

        this.faceplate
        this.numplate
        this.ones
        this.tens
        this.huns

        this.l_sockets
        this.r_sockets
        this.l_life
        this.r_life

        this.fly
        this.timer = 0

    }

    preload() {
        this.load.spritesheet(
            'gba', new URL('assets/gba.png', import.meta.url).href,

            { frameWidth: 252, frameHeight: 162 })
        this.load.spritesheet(
            'loss', new URL('assets/loss_cat.png', import.meta.url).href,
            { frameWidth: 419, frameHeight: 162 })
        this.load.spritesheet(
            'numbers', new URL('assets/numsheet.png', import.meta.url).href,
            { frameWidth: 77, frameHeight: 122 })
        this.load.image('gba_socket', new URL('assets/gba_socket.png', import.meta.url).href)
        this.load.image('num_plate', new URL('assets/num_plate.png', import.meta.url).href)
        this.load.image('l_door', new URL('assets/l_door.png', import.meta.url).href)
        this.load.image('r_door', new URL('assets/r_door.png', import.meta.url).href)
    }

    create() {

        // Add images to Scene
        this.l_door = this.add.image(L_START, Y / 2, 'l_door')
        this.r_door = this.add.image(R_START, Y / 2, 'r_door')

        this.faceplate = this.physics.add.sprite(R_START, Y / 4, 'loss')

        this.numplate = this.physics.add.sprite(L_START, Y / 4, 'num_plate')
        this.numplate.setScale(2 / 3, 1)
        this.ones = this.physics.add.sprite(L_START + 82, Y / 4, 'numbers')
        this.tens = this.physics.add.sprite(L_START, Y / 4, 'numbers')
        this.huns = this.physics.add.sprite(L_START - 82, Y / 4, 'numbers')

        // TO BE CONTINUED
        this.l_sockets = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x: L_START, y: 5 * Y / 6 - 185, stepY: 185 }
        })

        this.l_life = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x: L_START, y: 5 * Y / 6 - 185, stepY: 185 }
        })

        this.r_sockets = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x: R_START, y: 5 * Y / 6 - 185, stepY: 185 }
        })

        this.r_life = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x: R_START, y: 5 * Y / 6 - 185, stepY: 185 }
        })


        this.l_sockets.setDepth(1)
        this.r_sockets.setDepth(1)
        this.l_life.setDepth(1)
        this.r_life.setDepth(1)

        this.anims.create({
            key: 'life',
            frames: [
                { key: 'gba', frame: 0 },
                { key: 'gba', frame: 0 },
                { key: 'gba', frame: 1 },
                { key: 'gba', frame: 2 },
                { key: 'gba', frame: 2 },
                { key: 'gba', frame: 1 }
            ],
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'blink',
            frames: [
                { key: 'gba', frame: 0 },
                { key: 'gba_socket' }
            ],
            frameRate: 6,
            repeat: 2
        })
            <

            this.anims.create({
                key: 'cry',
                frames: [
                    { key: 'loss', frame: 0 },
                    { key: 'loss', frame: 1 },
                    { key: 'loss', frame: 2 },
                    { key: 'loss', frame: 3 }
                ],
                frameRate: 6,
                repeat: -1,
                yoyo: true
            })

        this.setScore(this.score)

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

        this.l_life.children.iterate((child) => {
            child.anims.play('life')
        });
        this.r_life.children.iterate((child) => {
            child.anims.play('life')
        });

        this.lost = true
        this.score = 23
    }

    update() {
        // this.globalState.test();

        if (!this.closed) {
            this.close_timer++
            this.close_doors()
        }
        else if (this.open) {
            console.log('reachme 00')
            this.close_timer++
            this.open_doors()
        }


    }

    testing() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.open = true
        }
    }


    close_doors() {
        // If left door is not yet in closed position
        if (this.l_door.x < L_END) {
            this.l_close()
            this.r_close()
        }
        else {
            this.close_timer = 0
            console.log("timer reset")
            this.closed = true
            this.closecon()
        }
    }

    open_doors() {
        if (this.l_door.x > L_START) {
            this.l_open()
            this.r_open()
        }
        else {
            this.close_timer = 0
            // console.log("timer reset")
            this.open = false
            this.closed = false
        }
    }

    l_close() {
        // If left door would overshoot closed position
        if (this.l_door.x + this.close_timer >= L_END) {

            // Move Door
            this.l_door.x = L_END

            this.numplate.x = L_END
            this.ones.x = L_END + 82
            this.tens.x = L_END
            this.huns.x = L_END - 82

            //Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x = L_END
            });
            this.l_life.children.iterate((child) => {
                child.x = L_END
            });
        }
        else {
            // Move Door
            this.l_door.x += this.close_timer

            this.numplate.x += this.close_timer
            this.ones.x += this.close_timer
            this.tens.x += this.close_timer
            this.huns.x += this.close_timer

            // Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x += this.close_timer;
            });
            this.l_life.children.iterate((child) => {
                child.x += this.close_timer;
            });
        }
    }

    l_open() {
        // code for right door based on code for left door
        if (this.l_door.x - this.close_timer <= L_START) {

            // Move Door
            this.l_door.x = L_START

            this.numplate.x = L_START
            this.ones.x = L_START + 82
            this.tens.x = L_START
            this.huns.x = L_START - 82

            // Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x = L_START;
            });
            this.l_life.children.iterate((child) => {
                child.x = L_START;
            });

        }
        else {
            // Move Door
            this.l_door.x -= this.close_timer

            this.numplate.x -= this.close_timer
            this.ones.x -= this.close_timer
            this.tens.x -= this.close_timer
            this.huns.x -= this.close_timer

            // Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x -= this.close_timer;
            });
            this.l_life.children.iterate((child) => {
                child.x -= this.close_timer;
            });


        }
    }

    r_close() {
        // code for right door based on code for left door
        if (this.r_door.x - this.close_timer <= R_END) {

            // Move Door
            this.r_door.x = R_END
            this.faceplate.x = R_END
            // Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x = R_END;
            });
            this.r_life.children.iterate((child) => {
                child.x = R_END;
            });

        }
        else {
            // Move Door
            this.r_door.x -= this.close_timer
            this.faceplate.x -= this.close_timer
            // Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x -= this.close_timer;
            });
            this.r_life.children.iterate((child) => {
                child.x -= this.close_timer;
            });
        }
    }

    r_open() {
        // If left door would overshoot closed position
        if (this.r_door.x + this.close_timer >= R_START) {

            // Move Door
            this.r_door.x = R_START
            this.faceplate.x = R_START
            //Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x = R_START
            });
            this.r_life.children.iterate((child) => {
                child.x = R_START
            });
        }
        else {
            // Move Door
            this.r_door.x += this.close_timer
            this.faceplate.x += this.close_timer

            // Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x += this.close_timer;
            });
            this.r_life.children.iterate((child) => {
                child.x += this.close_timer;
            });
        }
    }

    reduce_life() {
        switch (this.life_total) {
            case 1: case 2: this.r_disable(this.life_total); break;
            case 3: case 4: this.l_disable(this.life_total); break;
            default: return;
        }
    }

    l_disable(index) {
        this.l_life.getChildren()[4 - index].anims.play('blink')
    }

    r_disable(index) {
        this.r_life.getChildren()[2 - index].anims.play('blink')
    }

    setScore(score) {
        let o = score % 10
        let h = Math.floor(score / 100)
        let t = Math.floor((score - (h * 100)) / 10)


        this.ones.setFrame(o + 1)
        if (score >= 10)
            this.tens.setFrame(t + 1)
        if (score >= 100)
            this.huns.setFrame(h + 1)
    }

    closecon() {
        if (!this.lost) {
            this.score++
            this.setScore(this.score)
        }
        else {
            this.faceplate.anims.play('cry')
            this.life_total--
            this.reduce_life()
        }
    }

}
