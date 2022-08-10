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
        this.load.image('bg1', new URL('gameAssets/bgframe.png', import.meta.url).href)
        this.load.image('bg2', new URL('gameAssets/framemetalplates.png', import.meta.url).href)



    }

    create() {
        this.globalState.randomGame();
        this.add.image(540, 360, 'bg1')
        this.add.image(540, 360, 'bg2')

        this.globalState.setText('Micro Games', this);
    }

    update() {

    }

}