import Phaser from 'phaser';
const X = 1080
const Y = 720

const L_END = X/4
const L_START = -L_END


const R_START = 5*L_END
const R_END = 3*L_END
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
        this.life_total = 4
        this.closed = false
        this.open = false

        this.space

        this.heart
        this.gba
        this.life_group
        this.socket
        this.socket_group
        this.l_door
        this.r_door
        this.l_group
        this.r_group

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
            {   frameWidth: 252, frameHeight: 162})
        this.load.image('gba_socket', new URL('assets/gba_socket.png', import.meta.url).href)
        this.load.image('l_door', new URL('assets/l_door.png', import.meta.url).href)
        this.load.image('r_door', new URL('assets/r_door.png', import.meta.url).href)
    }

    create() {

        // Add images to Scene
        this.l_door = this.add.image(0, 0, 'l_door')
        this.r_door = this.add.image(0, 0, 'r_door')

        //TO BE CONTINUED
        this.l_sockets = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x:L_START, y: 5*Y/6 - 185, stepY: 185 }
        })

        this.l_life = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x:L_START, y: 5*Y/6 - 185, stepY: 185 }
        })

        this.r_sockets = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x:R_START, y: 5*Y/6 - 185, stepY: 185 }
        })

        this.r_life = this.physics.add.group({
            key: 'gba_socket',
            repeat: 1,
            setXY: { x:R_START, y: 5*Y/6 - 185, stepY: 185 }
        })

        

        this.l_sockets.setDepth(1)
        this.r_sockets.setDepth(1)
        this.l_life.setDepth(1)
        this.r_life.setDepth(1)

        this.l_group = this.add.container(L_START, Y/2)
        this.l_group.add(this.l_door)

        this.r_group = this.add.container(R_START, Y/2)
        this.r_group.add(this.r_door)  

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
                { key: 'gba_socket'}
            ],
            frameRate: 6,
            repeat: 2
        })   

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

        this.l_life.children.iterate((child) => {
            child.anims.play('life')
        });
        this.r_life.children.iterate((child) => {
            child.anims.play('life')
        });
    }

    update() {

        if(!this.closed){
            this.close_timer++
            this.close_doors()
        }
        else if(this.open){
            this.close_timer++
            this.open_doors()
        }

        this.life_toggle()
    }

    life_toggle(){
        if(Phaser.Input.Keyboard.JustDown(this.space)){
            if(this.life_total > 0){
                this.reduce_life()
                this.life_total--
            }
            if(this.life_total === 0 && this.closed){
                this.open = true;    
            }
        }
    }

    close_doors(){
        // If left door is not yet in closed position
        if(this.l_group.x < L_END){
            this.l_close()
            this.r_close()
        }
        else{
            this.close_timer = 0
            console.log("timer reset")
            this.closed = true
        }
    }

    open_doors(){
        if(this.l_group.x > L_START){
            this.l_open()
            this.r_open()
        }
        else{
            this.close_timer = 0
            console.log("timer reset")
            this.open = false
        }
    }

    l_close(){
        // If left door would overshoot closed position
        if(this.l_group.x + this.close_timer >= L_END){

            // Move Door
            this.l_group.x = L_END

            //Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x = L_END
            });
            this.l_life.children.iterate((child) => {
                child.x = L_END
            });
        }
        else{
            // Move Door
            this.l_group.x += this.close_timer

            // Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x += this.close_timer;
            });
            this.l_life.children.iterate((child) => {
                child.x += this.close_timer;
            });
        }
    }

    l_open(){
        // code for right door based on code for left door
        if(this.l_group.x - this.close_timer <= L_START){

            // Move Door
            this.l_group.x = L_START

            // Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x = L_START;
            });
            this.l_life.children.iterate((child) => {
                child.x = L_START;
            });

        }
        else{
            // Move Door
            this.l_group.x -= this.close_timer

            // Move Life Objects
            this.l_sockets.children.iterate((child) => {
                child.x -= this.close_timer;
            });
            this.l_life.children.iterate((child) => {
                child.x -= this.close_timer;
            });
        }
    }

    r_close(){
        // code for right door based on code for left door
        if(this.r_group.x - this.close_timer <= R_END){

            // Move Door
            this.r_group.x = R_END

            // Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x = R_END;
            });
            this.r_life.children.iterate((child) => {
                child.x = R_END;
            });

        }
        else{
            // Move Door
            this.r_group.x -= this.close_timer

            // Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x -= this.close_timer;
            });
            this.r_life.children.iterate((child) => {
                child.x -= this.close_timer;
            });
        }
    }

    r_open(){
        // If left door would overshoot closed position
        if(this.r_group.x + this.close_timer >= R_START){

            // Move Door
            this.r_group.x = R_START

            //Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x = R_START
            });
            this.r_life.children.iterate((child) => {
                child.x = R_START
            });
        }
        else{
            // Move Door
            this.r_group.x += this.close_timer

            // Move Life Objects
            this.r_sockets.children.iterate((child) => {
                child.x += this.close_timer;
            });
            this.r_life.children.iterate((child) => {
                child.x += this.close_timer;
            });
        }
    }

    reduce_life(){
        switch(this.life_total){
            case 1: case 2: this.r_disable(this.life_total); break;
            case 3: case 4: this.l_disable(this.life_total); break;
            default: return;
        }
    }

    l_disable(index){
        this.l_life.getChildren()[4-index].anims.play('blink')
    }

    r_disable(index){
        this.r_life.getChildren()[2-index].anims.play('blink')
    }
    
}
