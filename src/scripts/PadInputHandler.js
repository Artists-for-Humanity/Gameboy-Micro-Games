class PadInputHandler {
    constructor(buttonActive, callback) {
        this.state = "UP";
        this.buttonActive = buttonActive;
        this.callback = callback;
    }
    update() {
        if (this.buttonActive() && this.state === "UP") {
            this.state = "DOWN";
            this.callback();
        }
        if (!this.buttonActive() && this.state === "DOWN") {
            this.state = "UP";
        }
    }
}
export default PadInputHandler;