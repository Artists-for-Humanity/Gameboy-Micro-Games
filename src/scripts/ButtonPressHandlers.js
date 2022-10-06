import Phaser from "phaser";
import PadInputHandler from './PadInputHandler';
class ButtonPressHandlers extends Phaser.Scene {

    constructor() {
        super({
            active: false,
            visible: false,
            key: "ButtonPressHandlers",
        });
        this.buttonHandlers = [];
        // this.gamePad = null;
    }

    preload() { }

    create() { }

    update() {
        if (!this.gamePad) this.startGamePad();
    }



    addKey(button, callback) {
        this.buttonHandlers.push(new ButtonPressHandler(button, () => callback()));
    }
    addPad(button, callback) {
        this.buttonHandlers.push(new PadInputHandler(button, () => callback()));
    }
    updates() {
        this.buttonHandlers.map((handler) => {
            handler.update();
        });
    }
    startGamePad(scene) {
        if (scene.input.gamepad.total) {
            scene.globalState.gamePad = scene.input.gamepad.pad1;
            scene.initGamePad();
        }
    }
}
export default ButtonPressHandlers;