export default class MicroGame11 extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame11',
        });

        // Game Object Declarations
        this.myText;
        this.eventScreen;
        this.startText;


    }

    preload() {
        console.log("preload start");
        this.load.image('background', new URL('./assets/background.png', import.meta.url).href);
    }

    create() {
        console.log("create")
        this.add.image(540, 360, 'background');
        this.setText();
        // timer = game.time.create(false);
    }

    update() {
    }

    setText() {
        this.startText = this.add.text(360, 300, '')
        this.startText.setStyle({
            fontSize: '100px',
            fill: '#000000',
            align: 'center',
        });
        this.startText.setText('PUMP!');
    }
}