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

    }

    create() {
        this.globalState.test();
    }

    update() {

    }

}