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
        this.gamePad = null;
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
    // startGamePad() {
    //     console.log(this.gamead);
    //     if (this.input.gamepad.total) {
    //         this.gamePad = this.input.gamepad.pad1;
    //         this.initGamePad();
    //         console.log(this.gamePad);
    //     }
    // }
}
export default ButtonPressHandlers;