export default class MicroGame11 extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "MicroGame11",
    });

    // Game Object Declarations
    this.gameState = true;
    this.eventScreen;
    this.startText;
    this.timedEvent;
    this.lever;
    this.car;
    this.pumpToWin = 18;
    this.playerPumps = 0;
    this.clickAvailable = true;
    this.clickTimer = 0;
  }

  preload() {
    this.load.image(
      "background",
      new URL("./assets/background.png", import.meta.url).href
    );
    this.load.image(
      "pumpgame_bg",
      new URL("./assets/pumpgame_background.png", import.meta.url).href
    );
    this.load.image(
      "temp_car_bg",
      new URL("./assets/camry_background.png", import.meta.url).href
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
        frameWidth: 980,
        frameHeight: 720,
      }
    );
  }

  create() {
    this.add.image(1080 / 2, 720 / 2, "background");
    this.add.image(980 / 2, 720 / 2, "pumpgame_bg");
    // this.add.image(980 / 2, 720 / 2, "temp_car_bg");
    this.lever = this.physics.add.sprite(900, 480, "lever");
    this.car = this.physics.add.sprite(980 / 2, 355, "car");

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

    // this.anims.create({
    //   key: "car",
    //   frames: [
    //     { key: "car", frame: 0 },
    //     { key: "car", frame: 1 },
    //     { key: "car", frame: 2 },
    //     { key: "car", frame: 3 },
    //   ],
    //   frameRate: 10,
    // });
  }

  update(time, delta) {
    if (this.gameState) {
      this.clickTimer += delta;
      this.timerCountdown(time);
      if (this.clickTimer > 100) this.clickAvailable = true;
      if (this.cursors.up.isDown) {
        this.lever.anims.play("lever-up", true);
      } else if (this.cursors.down.isDown && this.clickAvailable) {
        this.time.delayedCall(100, this.updatePump, [], this);
        this.clickAvailable = false;
        this.clickTimer = 0;
      }
    }
  }

  timerCountdown(time) {
    if (time / 1000 > 5 && this.playerPumps < this.pumpToWin) {
      console.log("5 seconds passed! You lose!");
      this.gameState = false;
      this.endText = this.add.text(300, 360, "You lose!");
      this.endText.setStyle({
        fontSize: "100px",
        fill: "#000000",
        align: "center",
      });
    }

    if (time / 1000 > 5 && this.playerPumps >= this.pumpToWin) {
      this.gameState = false;
      this.endText = this.add.text(300, 360, "You Won!");
      this.endText.setStyle({
        fontSize: "100px",
        fill: "#000000",
        align: "center",
      });
    }
  }

  updatePump() {
    this.playerPumps += 1;
    console.log(this.playerPumps);
    this.lever.anims.play("lever-down", true);
    if (this.playerPumps === 25) {
      this.car.anims.play("car-inflate-25%", true);
    }
    if (this.playerPumps === 50) {
      this.car.anims.play("car-inflate-50%", true);
    }
    if (this.playerPumps === 75) {
      this.car.anims.play("car-inflate-75%", true);
    }
    if (this.playerPumps === 100) {
      this.car.anims.play("car-inflate-100%", true);
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
  }

  onEvent() {
    this.tempBg.visible = false;
    this.startText.visible = false;
  }
}

// How to win the game:
/**
 *
 * Pump car to 100%
 *
 * need meter variable track progress.
 *
 * How to track meter?
 *
 * Every time we pump we increase meter percentage.
 *
 * Win = meter 100% && still time left on timer.
 *
 * Lose = meter !100% && no time left on timer.
 */
