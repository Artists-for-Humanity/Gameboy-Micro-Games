import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from '../ButtonPressHandlers';
export default class CarPump extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "CarPump",
    });

    // Game Object Declarations
    this.gameStarted = false;
    this.gameOver = false;
    this.gameState = true;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.lever;
    this.car25;
    this.car50;
    this.car75;
    this.car100;
    this.carpumpTimer = 0;
    this.playerPumps = 0;
    this.downInt = 0;
    this.inflateInt = 0;
    this.endgameTimer = 0;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {
    this.load.image(
      "DO2_pumpgame_bg",
      new URL("./assets/pumpgame_background.png", import.meta.url).href
    );
    this.load.image(
      "DO2_gameOverScreen",
      new URL("./assets/game-over.png", import.meta.url).href
    );
    this.load.spritesheet(
      "DO2_lever",
      new URL("./assets/lever.png", import.meta.url).href,
      { frameWidth: 88, frameHeight: 162 }
    );
    this.load.image(
      "DO2_arrow_up",
      new URL("./assets/arrow_up.png", import.meta.url).href
    );
    this.load.image(
      "DO2_arrow_down",
      new URL("./assets/arrow_down.png", import.meta.url).href
    );
    this.load.image(
      "DO2_car",
      new URL("./assets/car.png", import.meta.url).href
    );
    this.load.spritesheet(
      "DO2_car25",
      new URL("./assets/25car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );
    this.load.spritesheet(
      "DO2_car50",
      new URL("./assets/50car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );

    this.load.spritesheet(
      "DO2_car75",
      new URL("./assets/75car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );

    this.load.spritesheet(
      "DO2_car100",
      new URL("./assets/100car_spritesheet.png", import.meta.url).href,
      { frameWidth: 1080, frameHeight: 720 }
    );
    this.load.audio(
      'DO2_carSound',
      new URL('./assets/car start up.wav', import.meta.url).href
    );
    this.load.audio(
      'DO2_pump1',
      new URL('./assets/pump1.wav', import.meta.url).href
    );
    this.load.audio(
      'DO2_pump2',
      new URL('./assets/pump2.wav', import.meta.url).href
    );
  }

  create() {
    this.setCarPump();
    this.makeSounds();
    this.add.image(1080 / 2, 720 / 2, "DO2_pumpgame_bg");
    this.lever = this.physics.add.sprite(955, 480, "DO2_lever");
    this.car = this.add.image(540, 350, "DO2_car");
    this.car25 = this.physics.add.sprite(540, 350, "DO2_car25");
    this.car50 = this.physics.add.sprite(540, 350, "DO2_car50");
    this.car75 = this.physics.add.sprite(540, 350, "DO2_car75");
    this.car100 = this.physics.add.sprite(540, 350, "DO2_car100");
    this.upArrow = this.add
      .image(1040, 350, "DO2_arrow_up")
      .setScale(0.4, 0.4)
      .setVisible(false);
    this.downArrow = this.add
      .image(1040, 450, "DO2_arrow_down")
      .setScale(0.4, 0.4);
    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO2_gameOverScreen"
    );

    // this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    // this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    this.car25.visible = false;
    this.car50.visible = false;
    this.car75.visible = false;
    this.car100.visible = false;
    this.gameOverScreen.visible = false;
    this.createAnimations();
    eventsCenter.on('start_game', () => { this.started = true; this.globalState.timerMessage('start_timer'); });

  }

  update(time, delta) {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) {
        console.log("yes");
        this.startGamePad();
      }
      this.buttonHandlers.update();
      this.upAndDown();
      this.pumpToWin();

      if (this.gameOver && !this.sent) {
        eventsCenter.emit('stop_timer');
        eventsCenter.emit("game-end", this.victory);
        this.sent = true;
      }
      console.log(this.downInt);

      this.timerCountdown(time);

    }
    if (this.gameOver && !this.sent) {
      eventsCenter.emit("stop_timer");
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    }
  }
  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.5, () => this.upAndDown(0));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.5, () => this.upAndDown(1));
  }
  onEvent() {
    this.tempBg.visible = false;
    this.gameStarted = true;
  }
  infalte1() {
    if (this.car1 === false) {
      this.car25.anims.play("DO2_car_inflate25%");
      this.car1 = true;
    }
  }
  inflate2() {
    if (this.car2 === false) {
      this.car50.anims.play("DO2_car_inflate50%");
      this.car2 = true;
      this.car25.visible = false;
      this.car50.visible = true;
    }
  }
  inflate3() {
    if (this.car3 === false) {
      this.car50.visible = false;
      this.car75.visible = true;
      this.car75.anims.play("DO2_car_inflate75%");
      this.car3 = true;
    }
  }
  inflate4() {
    if (this.car4 === false) {
      this.car75.visible = false;
      this.car100.anims.play("DO2_car_inflate100%");
      this.carStartSound.play(
        {volume: 1,}
      )
      this.car4 = true;
      this.car100.visible = true;
      this.victory = true;
      this.gameStarted = false;
      this.gameOver = true;
      this.gameStarted = false;
      this.endText = this.add.text(300, 360, "You Won!");
      this.endText.setStyle({
        fontSize: "100px",
        fill: "#000000",
        align: "center",
      });
    }
  }
  upAndDown(x) {
    if (x === 0 /*|| Phaser.Input.Keyboard.JustDown(this.up)*/) {

      this.upArrow.visible = false;
      this.downArrow.visible = true;
      this.lever.anims.play("DO2_lever_up", true);
      this.pump1.play({
        volume: .1,
      });
    }
    if (x === 1 /*|| Phaser.Input.Keyboard.JustDown(this.down)*/) {
      this.upArrow.visible = true;
      this.downArrow.visible = false;
      this.lever.anims.play("DO2_lever_down", true);
      this.downInt += 1;
      this.pump2.play({
        volume: .1,
      });
      this.updatePump();
    }
  }
  pumpToWin() {
    if (this.downInt === 16) {
      this.downInt = 0;
      this.inflateInt += 1;
    }
    if (this.inflateInt === 1) this.infalte1();
    if (this.inflateInt === 2) this.inflate2();
    if (this.inflateInt === 3) this.inflate3();
    if (this.inflateInt === 4) this.inflate4();
  }
  createAnimations() {
    this.anims.create({
      key: "DO2_lever_up",
      frames: [
        { key: "DO2_lever", frame: 1 },
        { key: "DO2_lever", frame: 2 },
        { key: "DO2_lever", frame: 3 },
        { key: "DO2_lever", frame: 4 },
        { key: "DO2_lever", frame: 5 },
        { key: "DO2_lever", frame: 6 },
        { key: "DO2_lever", frame: 7 },
      ],
      frameRate: 30,
    });

    this.anims.create({
      key: "DO2_lever_down",
      frames: [
        { key: "DO2_lever", frame: 7 },
        { key: "DO2_lever", frame: 6 },
        { key: "DO2_lever", frame: 5 },
        { key: "DO2_lever", frame: 4 },
        { key: "DO2_lever", frame: 3 },
        { key: "DO2_lever", frame: 2 },
        { key: "DO2_lever", frame: 1 },
      ],
      frameRate: 30,
    });

    // Car animations
    this.anims.create({
      key: "DO2_car_inflate25%",
      frames: [
        { key: "DO2_car25", frame: 0 },
        { key: "DO2_car25", frame: 1 },
        { key: "DO2_car25", frame: 2 },
        { key: "DO2_car25", frame: 3 },
        { key: "DO2_car25", frame: 4 },
        { key: "DO2_car25", frame: 5 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO2_car_inflate50%",
      frames: [
        { key: "DO2_car50", frame: 0 },
        { key: "DO2_car50", frame: 1 },
        { key: "DO2_car50", frame: 2 },
        { key: "DO2_car50", frame: 3 },
        { key: "DO2_car50", frame: 4 },
        { key: "DO2_car50", frame: 5 },
        { key: "DO2_car50", frame: 6 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO2_car_inflate75%",
      frames: [
        { key: "DO2_car75", frame: 0 },
        { key: "DO2_car75", frame: 1 },
        { key: "DO2_car75", frame: 2 },
        { key: "DO2_car75", frame: 3 },
        { key: "DO2_car75", frame: 4 },
        { key: "DO2_car75", frame: 5 },
        { key: "DO2_car75", frame: 6 },
      ],
      frameRate: 24,
    });

    this.anims.create({
      key: "DO2_car_inflate100%",
      frames: [
        { key: "DO2_car100", frame: 0 },
        { key: "DO2_car100", frame: 1 },
        { key: "DO2_car100", frame: 2 },
        { key: "DO2_car100", frame: 3 },
        { key: "DO2_car100", frame: 4 },
        { key: "DO2_car100", frame: 5 },
        { key: "DO2_car100", frame: 6 },
      ],
      frameRate: 24,
    });
  }

  // update(time, delta) {
  //   if (this.gameState) {
  //     this.clickTimer += delta;
  //     this.timerCountdown(time);
  //     if (Phaser.Input.Keyboard.JustDown(this.up) && this.downWasPressed) {
  //       this.downWasPressed = false;
  //       this.upWasPressed = true;
  //       this.lever.anims.play("DO2_lever_up", true);
  //       this.downArrow.setVisible(true);
  //       this.upArrow.setVisible(false);
  //     } else if (
  //       Phaser.Input.Keyboard.JustDown(this.down) &&
  //       this.upWasPressed
  //     ) {
  //       this.downWasPressed = true;
  //       this.upWasPressed = false;
  //       this.time.delayedCall(100, this.updatePump, [], this);
  //       this.clickTimer = 0;
  //     }
  //     if (this.gameOver && !this.sent) {
  //       eventsCenter.emit("stop_timer");
  //       eventsCenter.emit("game-end", this.victory);
  //       this.sent = true;
  //     }
  //   }
  // }

  timerCountdown(time) {
    if (time / 1000 > 15 && this.playerPumps < this.pumpToWin) {
      this.gameState = false;
      this.gameOver = true;
      this.gameOverScreen.visible = true;
    }

    if (this.playerPumps > this.downInt) {
      console.log("win");
      this.victory = true;
      this.gameState = false;
      this.gameOver = true;
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

    this.lever.anims.play("DO2_lever_down", true);
    this.downArrow.setVisible(false);
    this.upArrow.setVisible(true);
    if (this.playerPumps === 4) {
      this.car25.visible = true;
      this.car25.anims.play("DO2_car_inflate25%", true);
      this.car.visible = false;
    }
    if (this.playerPumps === 8) {
      this.car50.visible = true;
      this.car50.anims.play("DO2_car_inflate50%", true);
      this.car25.visible = false;
    }
    if (this.playerPumps === 12) {
      this.car75.visible = true;
      this.car75.anims.play("DO2_car_inflate75%", true);
      this.car50.visible = false;
    }
    if (this.playerPumps === 16) {
      this.car100.visible = true;
      this.car100.anims.play("DO2_car_inflate100%", true);
      this.car75.visible = false;
    }
  }
  makeSounds(){
    this.pump1 = this.sound.add('DO2_pump1')
    this.pump2 = this.sound.add('DO2_pump2')
    this.carStartSound = this.sound.add('DO2_carSound')
  }
  setCarPump(){
    this.gameStarted = false;
    this.gameOver = false;
    this.gameState = true;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.carpumpTimer = 0;
    this.playerPumps = 0;
    this.downInt = 0;
    this.inflateInt = 0;
    this.endgameTimer = 0;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
}
