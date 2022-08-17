import eventsCenter from './EventsCenter'

const X = 1080
const Y = 720

export default class MainMenu extends Phaser.Scene {

    // Game  Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MainMenu',
        });

        this.btns = [];
        this.animations = [];
        this.fingerIcon
        this.fingerPos = 0

        this.left
        this.right
        this.action

        this.sent = false

        this.wobbleDir = false

        this.wobbleTimer = 0
    }

    preload() {
        this.listOfGames = [
            "Emeowgency",
            "ColorLab",
            "MicroGame11",
            "Highest2Lowest",
            "FrogJump",
            "CircleGame",
            "BewteenSpace",
            "ColorPasscode",
            "HideFromCat",
            "HitTheButton",
            "TugOWar",
            "FlySwat",
            "DrinkPour"];

        this.load.image('bg1', new URL('gameAssets/bgframe.png', import.meta.url).href);
        this.load.spritesheet('play', new URL('gameAssets/play_btn.png', import.meta.url).href,
            { frameWidth: 239, frameHeight: 117 })
        this.load.spritesheet('score', new URL('gameAssets/score_btn.png', import.meta.url).href,
            { frameWidth: 239, frameHeight: 117 })
        this.load.image('finger', new URL('gameAssets/finger.png', import.meta.url).href);
    }

  create() {
        this.add.image(X/2, Y/2, "bg1");
        this.btns.push(this.physics.add.sprite(X/4, Y*.80, 'play'))
        this.btns.push(this.physics.add.sprite(3*X/4, Y*.80, 'score'))

        this.fingerIcon = this.add.image(this.btns[0].x, this.btns[0].y - 117, 'finger').setRotation(Math.PI/2)

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        this.animationBuilder()
        this.updateSelection()
    }

    update() {
        this.buttonPresses()
        this.verticalWobble(this.fingerIcon, .5, 4)
    }

    buttonPresses(){
        if (Phaser.Input.Keyboard.JustDown(this.left)){
            this.updateSelection("left")
        } 
        if(Phaser.Input.Keyboard.JustDown(this.right)){
            this.updateSelection("right")
        } 
        if(Phaser.Input.Keyboard.JustDown(this.action)){
            this.buttonEvents()
        }
    }

    verticalWobble(obj, amount, speed){
        this.wobbleTimer+=speed
        if(this.wobbleTimer % 100 === 0){
            this.wobbleDir = !this.wobbleDir}
        this.wobbleDir ? obj.y += amount : obj.y -= amount
    }

    updateSelection(input){

        this.btns[this.fingerPos].anims.stop().setFrame(0)

        if(input === "left"){
            this.fingerPos === 0 ? this.fingerPos = this.btns.length-1 : this.fingerPos--
        }
        if(input === "right"){
            this.fingerPos === this.btns.length-1 ? this.fingerPos = 0 : this.fingerPos++
        }
        
        this.fingerIcon.x = this.btns[this.fingerPos].x
        this.btns[this.fingerPos].anims.play(this.animations[this.fingerPos])
    }

    buttonEvents(){
        switch(this.fingerPos){
            case 0: // Play
                this.playGame()
                break;
            case 1: // Scores
            default:
                break;
        }
    }

    playGame(){
        if(!this.sent){
            this.scene.run("CutScreen")
            //this.globalState.sendMessage(true)
            this.sent = true
        }
    }

    animationBuilder(){
        this.animations.push(
            this.anims.create({
                key: 'play_btn',
                frames:"play",
                frameRate: 12,
                repeat: -1,
                yoyo: true
            }) 
        )
        this.animations.push(
            this.anims.create({
                key: 'score_btn',
                frames:"score",
                frameRate: 12,
                repeat: -1,
                yoyo: true
            }) 
        )
    }
}
