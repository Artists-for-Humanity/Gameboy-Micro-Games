export default class MainMenu extends Phaser.Scene {

    // Game  Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MainMenu',
        });
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
        this.load.image('bg2', new URL('gameAssets/framemetalplates.png', import.meta.url).href);
        this.load.image('play', new URL('gameAssets/play.png', import.meta.url).href);
        this.load.image('finger', new URL('gameAssets/finger.png', import.meta.url).href);

    }

    create() {
        this.globalState.randomGame();
        this.add.image(540, 360, 'bg1');
        this.add.image(540, 360, 'bg2');
        this.playBtn = this.add.image(540, 390, 'play');
        this.fingerIcon = this.add.image(250, this.playBtn.y, 'finger').setScale(0.2);

        //this.globalState.setText('title of the game', this);

        this.btns = [this.playBtn, this.optionBtn, this.exitBtn];
        this.currentBottonIndex = 0;

        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.up)) {
            this.currentBottonIndex === 0 ? this.currentBottonIndex = 2 : this.currentBottonIndex -= 1;
            this.fingerIcon.setPosition(250, this.btns[this.currentBottonIndex].y);
        } if (Phaser.Input.Keyboard.JustDown(this.down)) {
            this.currentBottonIndex === 2 ? this.currentBottonIndex = 0 : this.currentBottonIndex += 1;
            this.fingerIcon.setPosition(250, this.btns[this.currentBottonIndex].y);
        } if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (this.currentBottonIndex == 0) {
                this.scene.start(this.listOfGames[Phaser.Math.Between(0, this.listOfGames.length)]);
            }
            if (this.currentBottonIndex == 1) console.log("Option menu");
            if (this.currentBottonIndex == 2) console.log("Exit game");
        }
    }



}

