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
    this.lever;
    this.car;
  }

  preload() {
    this.load.image(
      "background",
      new URL("./assets/background.png", import.meta.url).href
    );
    this.load.spritesheet(
      "lever",
      new URL("./assets/lever.png", import.meta.url).href,
      {
        frameWidth: 88,
        frameHeight: 162,
      }
    );
    this.load.spritesheet(
      "car",
      new URL("./assets/car_spritesheet.png", import.meta.url).href,
      {
        frameWidth: 1080,
        frameHeight: 720,
      }
    );
  }

  create() {
    this.add.image(1080 / 2, 720 / 2, "background");
    // this.add.image(350, 720 / 2, "car");
    this.lever = this.physics.add.sprite(840, 400, "lever");
    this.car = this.physics.add.sprite(1080 / 2, 720 / 3, "car");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.setText();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);

    // Animation for car

    this.anims.create({
      key: "car-inflate",
      frames: [
        { key: "car", frame: 0 },
        { key: "car", frame: 1 },
        { key: "car", frame: 2 },
        { key: "car", frame: 3 },
        { key: "car", frame: 4 },
        { key: "car", frame: 5 },
        { key: "car", frame: 6 },
        { key: "car", frame: 7 },
      ],
      frameRate: 10,
    });

    // Animation for idle lever

    this.anims.create({
      key: "lever-idle",
      frames: [{ key: "lever", frame: 6 }],
      frameRate: 10,
    });

    this.anims.create({
      key: "lever-up",
      frames: [
        { key: "lever", frame: 0 },
        { key: "lever", frame: 1 },
        { key: "lever", frame: 2 },
        { key: "lever", frame: 3 },
        { key: "lever", frame: 4 },
        { key: "lever", frame: 5 },
        { key: "lever", frame: 6 },
      ],
      frameRate: 10,
    });

    this.anims.create({
      key: "lever-down",
      frames: [
        { key: "lever", frame: 6 },
        { key: "lever", frame: 5 },
        { key: "lever", frame: 4 },
        { key: "lever", frame: 3 },
        { key: "lever", frame: 2 },
        { key: "lever", frame: 1 },
        { key: "lever", frame: 0 },
      ],
      frameRate: 10,
    });

    this.anims.create({
      key: "car",
      frames: [
        { key: "car", frame: 0 },
        { key: "car", frame: 1 },
        { key: "car", frame: 2 },
        { key: "car", frame: 3 },
      ],
      frameRate: 10,
    });
  }

  update() {
    if (this.cursors.up.isDown) {
      this.lever.anims.play("lever-up", true);
    } else if (this.cursors.down.isDown) {
      this.lever.anims.play("lever-down", true);
      this.car.anims.play("car-inflate", true);
    }
  }

  setText() {
    this.startText = this.add.text(360, 300, "");
    this.startText.setStyle({
      fontSize: "100px",
      fill: "#000000",
      align: "center",
    });

    this.tempBg = this.add.image(1080 / 2, 720 / 2, "background");
    this.startText.setText("PUMP!");
    console.log("hello");
  }

  onEvent() {
    this.tempBg.visible = false;
    this.startText.visible = false;
  }
}
