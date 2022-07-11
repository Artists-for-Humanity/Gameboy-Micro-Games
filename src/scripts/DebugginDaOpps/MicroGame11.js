export default class MicroGame01 extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame11',
        });

        // Game Object Declarations
        this.myText;

    }

    preload() {
    }

    create() {
        this.setText();
    }

    update() {
    }

    setText() {
        this.myText = this.add.text(125, 360, '')
        this.myText.setStyle({
            fontSize: '100px',
            fill: '#000000',
            align: 'center',
        });
        this.myText.setText('DebugginDaOpps');
    }
}