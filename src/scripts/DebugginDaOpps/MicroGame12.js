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
  }

  preload() {
    this.load.image(
      "startScreen",
      new URL("./assets1/startscreen.png", import.meta.url).href
    );
  }

  create() {
    this.add.image(1080 / 2, 720 / 2, "startScreen");
  }

  update() {}
}
