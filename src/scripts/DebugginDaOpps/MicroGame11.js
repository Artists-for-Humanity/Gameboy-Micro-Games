export default class MicroGame11 extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "MicroGame11",
    });

    // Game Object Declarations
    this.eventScreen;
    this.startText;
    this.timedEvent;
  }

  preload() {
    this.load.image(
      "background",
      new URL("./assets/background.png", import.meta.url).href
    );
    this.load.image(
      "full-tire",
      new URL("./assets/car.png", import.meta.url).href
    );
    this.load.image("car", new URL("./assets/car.png", import.meta.url).href);
  }

  create() {
    this.add.image(540, 360, "background");
    this.setText();
    // timer = game.time.create(false);

    this.timedEvent = this.time.addEvent({
      delay: 500,
      callback: this.onEvent(),
      callbackScope: this,
      loop: false,
    });
  }

  update() {}

  setText() {
    this.startText = this.add.text(360, 300, "");
    this.startText.setStyle({
      fontSize: "100px",
      fill: "#000000",
      align: "center",
    });
    this.startText.setText("PUMP!");
    console.log("text");
  }

  onEvent() {
    this.startText.visible = true;
  }
}
