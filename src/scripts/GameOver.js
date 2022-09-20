import eventsCenter from './EventsCenter'

const X = 1080
const Y = 720
export default class GameOver extends Phaser.Scene {

    // Game  Class Constructor
    gameData;
    textObj1 = null;
    textObj2 = null;
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'GameOver',
        });
    this.confirmKey;
    this.arrowButtons;

    this.letters = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
          ];
    }

    preload() {
        this.load.image('go_bg', new URL('globalAssets/go_screen.png', import.meta.url).href);
    }

    create() {
        this.arrowButtons = this.input.keyboard.createCursorKeys();
        this.confirmKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.add.image(X / 2, Y / 2, "go_bg");

        this.action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.action)) {
            location.reload();
        }
    }
}
