import PadInputHandler from './PadInputHandler';
class ButtonPressHandlers {
    constructor() {
        this.buttonHandlers = [];
    }
    addKey(button, callback) {
        this.buttonHandlers.push(new ButtonPressHandler(button, () => callback()));
    }
    addPad(button, callback) {
        this.buttonHandlers.push(new PadInputHandler(button, () => callback()));
    }
    update() {
        this.buttonHandlers.map((handler) => {
            handler.update();
        })
    }
}
export default ButtonPressHandlers;