import eventsCenter from './EventsCenter'

const TIME = 5

export default class Timer extends Phaser.Scene {

    // Game  Class Constructor
    constructor() {
        super({
            active: false,
            visible: true,
            key: 'Timer',
        });
        this.timer = 0
        this.timeLeft = TIME
        this.timeUp = true
        this.sent = false
        this.timerSprite
        this.frame

        this.started = false;

    }

    preload() {
        this.load.spritesheet(
            'num_sheet', new URL('globalAssets/numsheet.png', import.meta.url).href,
            { frameWidth: 77, frameHeight: 122 })
        this.load.image('t_frame', new URL('globalAssets/t_frame.png', import.meta.url).href)

    }

    create() {
        this.animationBuilder()
        this.frame = this.add.image(1080/16+6, 720-90,'t_frame')
        this.timerSprite = this.physics.add.sprite(1080/16+6, 720-90,'num_sheet', this.timeLeft+1)

        eventsCenter.on('reset_timer', () => {this.timeLeft = TIME; this.timerSprite.setFrame(TIME)})
        eventsCenter.on('start_timer', () => {this.timeUp = false; this.sent = false})
        eventsCenter.on('stop_timer', () => {this.timeUp = true; this.sent = true})
        
    }

    update() {
        if(!this.timeUp){
            this.updateTimer()
            this.updateAnimation()
        } else{
            if(!this.sent){
                this.globalState.timerMessage('stop_timer')
                this.globalState.sendMessage(false)
                this.sent = true
            }
        }
    }

    updateTimer(){
        this.timer++
        if(this.timer >= 60){
            this.timer = 0
            this.timeLeft--
        }
    }

    setTimer(){
        this.timeLeft = TIME
    }

    updateAnimation(){
        if(this.timeLeft > 0){
            this.timerSprite.setFrame(this.timeLeft+1)
        } else{
                this.timerSprite.anims.play('time_up', true).once('animationcomplete', () => {
                this.timeUp = true
                this.timer = 0
            })
        }
    }

    animationBuilder(){
        this.anims.create({
            key:'time_up',
            frames: [
                { key: 'num_sheet', frame: 0},
                { key: 'num_sheet', frame: 1},
                { key: 'num_sheet', frame: 0},
                { key: 'num_sheet', frame: 1},
                { key: 'num_sheet', frame: 0},
                { key: 'num_sheet', frame: 1},
                { key: 'num_sheet', frame: 0}
            ],
            frameRate: 6,
            repeat: 0
        })
    }
}