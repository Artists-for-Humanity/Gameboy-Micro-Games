export default class MicroGame31 extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame31',
        });

        // Game Object Declarations
        this.myText;

    }

    preload() {
    }

    create() {
        this.setText();
        this.globalState.randomGame();
    }

    update() {
    }

    setText() {
        this.myText = this.add.text(400, 360, '')
        this.myText.setStyle({
            fontSize: '100px',
            fill: '#000000',
            align: 'center',
        });
        this.myText.setText('Team4');
    }
}