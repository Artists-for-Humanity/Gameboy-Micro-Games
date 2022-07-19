export default class MicroGame12 extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: MicroGame12,
    });

    // Game Object Declarations
    // this.gameState = true;
    this.startScreen;
    this.timedEvent;
  }

  preload() {
    this.load.image(
      "startScreen",
      new URL("./assets1/startscreen.png", import.meta.url).href
    );
    this.load.image(
      "trash-can",
      new URL("./assets1/pixel-trash-can.png", import.meta.url).href
    );
    this.load.image(
      "recycle-bin",
      new URL("./assets1/recycle-bin-pixel.png", import.meta.url).href
    );
    this.load.image(
      "chicken-leg",
      new URL("./assets1/pixel-chicken-leg.png", import.meta.url).href
    );
    this.load.image(
      "pizza",
      new URL("./assets1/pizza-pixel.png", import.meta.url).href
    );
    this.load.image(
      "plastic-bag",
      new URL("./assets1/plastic-bag-pixel.png", import.meta.url).href
    );
    this.load.image(
      "plastic-can-holder",
      new URL("./assets1/plastic-can-holder.png", import.meta.url).href
    );
  }

  create() {
    this.tempBg = this.add.image(1080 / 2, 720 / 2, "startScreen");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);
  }

  update() {}

  onEvent() {
    this.tempBg.visible = false;
  }
}
