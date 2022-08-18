import eventsCenter from './EventsCenter'

const X = 1080
const Y = 720
export default class GameOver extends Phaser.Scene {

    // Game  Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'GameOver',
        });
    }

    preload() {
        this.load.image('go_bg', new URL('globalAssets/go_screen.png', import.meta.url).href);
    }

    create() {
        this.add.image(X / 2, Y / 2, "go_bg");

        this.action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.action)) {
            location.reload();
        }
    }
}
