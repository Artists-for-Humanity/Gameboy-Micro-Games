import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';
import phaserJuice from '../phaserJuice.js';
export default class TrashSort extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "TrashSort",
    });

    // Game Object Declarations
    this.triesToWin = 4;
    this.startScreen;
    this.timedEvent;
    this.currTrashItem= null;
    this.playerScore = 0;
    this.firstTrash = Phaser.Math.Between(0, 3);
    this.victory = false;
    this.gameOver = false;
    this.sent = false;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {
    this.load.image(
      "DO3_background",
      new URL("./assets1/game-background.png", import.meta.url).href
    );
    this.load.image(
      "DO3_gameOverScreen",
      new URL("./assets1/game-over.png", import.meta.url).href
    );
    this.load.image(
      "DO3_trash_bin",
      new URL("./assets1/pixel-trash-can.png", import.meta.url).href
    );
    this.load.image(
      "DO3_recycle_bin",
      new URL("./assets1/recycle-bin-pixel.png", import.meta.url).href
    );
    this.load.image(
      "DO3_chicken_leg",
      new URL("./assets1/pixel-chicken-leg.png", import.meta.url).href
    );
    this.load.image(
      "DO3_pizza",
      new URL("./assets1/pizza-pixel.png", import.meta.url).href
    );
    this.load.image(
      "DO3_can",
      new URL("./assets1/can.png", import.meta.url).href
    );
    this.load.image(
      "DO3_soda_can",
      new URL("./assets1/soda-can.png", import.meta.url).href
    );
  }

  create() {
    this.resetTrashSort()
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO3_background"
    );
    this.recycleBin = this.physics.add
      .image(760, 540, "DO3_recycle_bin")
      .setScale(0.2, 0.2);
    this.trashBin = this.physics.add
      .image(320, 540, "DO3_trash_bin")
      .setScale(0.2, 0.2);

    this.trashBinMap = {
      DO3_chicken_leg: "DO3_trash_bin",
      DO3_can: "DO3_recycle_bin",
      DO3_soda_can: "DO3_recycle_bin",
      DO3_pizza: "DO3_trash_bin",
    };

    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO3_gameOverScreen"
    );

    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);

    eventsCenter.on('start_game', () => { this.started = true; this.globalState.timerMessage('start_timer'); });

    this.juice = new phaserJuice(this);
  }
  resetTrashSort(){
    this.triesToWin = 4;
    this.playerScore = 0;
    this.firstTrash = Phaser.Math.Between(0, 3);
    this.victory = false;
    this.gameOver = false;
    this.sent = false;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
    this.currTrashItem= null;



  }


  update() {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();

      if (this.playerScore === this.triesToWin) {
        this.currTrashItem.visible = false;
        this.victory = true;
        this.gameOver = true;
        this.endText = this.add.text(300, 250, "You Won!");
        this.endText.setStyle({
          fontSize: "100px",
          fill: "000000",
          align: "center",
        });
      }

      if (this.currTrashItem === null) {
        this.currTrashItem = this.physics.add
          .image(
            this.game.config.width / 2,
            -100,
            Object.keys(this.trashBinMap)[this.firstTrash]
          )
          .setScale(0.12, 0.12);
        this.addTrashCollider(this.recycleBin);
        this.addTrashCollider(this.trashBin);
      }

      if (this.currTrashItem.y >= 720 + this.currTrashItem.displayWidth / 2) {
        this.gameOver = true;

        this.gameOverScreen.visible = true;
        this.currTrashItem.visible = false;
      }
      this.time.delayedCall(10, this.dropTrash, [], this);
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
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.moveTrash(-1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.moveTrash(1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.moveTrash(0));
  }

  timerCountdown(time) {
    if (time / 1000 > 10) {
      this.gameState = false;
      this.gameOver = true;
      this.gameOverScreen.visible = true;
    }
  }

  // Get the current trash item on screen and drop its y coordinate down.
  dropTrash() {
    this.addTrashCollider(this.recycleBin);
    this.addTrashCollider(this.trashBin);
    this.currTrashItem.y += 5;
    // this.moveTrash();
  }

  // Spawn new trash onto the screen, replace the trash image of the currentTrashItem, and reset the y coordinate.
  spawnTrash() {
    this.currTrashItem = this.physics.add
      .image(
        this.game.config.width / 2,
        0,
        Object.keys(this.trashBinMap)[Phaser.Math.Between(0, 3)]
      )
      .setScale(0.12, 0.12);
  }

  moveTrash(x) {
    if (!this.gameOver) {
      if (x === -1) {
        this.currTrashItem.setVelocityX(-300);
      }
      if (x === 1) {
        this.currTrashItem.setVelocityX(300);
      }
      if (x === 0) {
        this.currTrashItem.setVelocityX(0);
      }
    }
  }

  addTrashCollider(trashBinType) {
    const destination = this.trashBinMap[this.currTrashItem.texture.key];
    this.physics.add.overlap(this.currTrashItem, trashBinType, (a, b) => {
      if (destination !== trashBinType.texture.key) {
        this.gameOver = true;
        this.gameOverScreen.visible = true;
        a.destroy();
        b.destroy();
      } else {
        this.playerScore += 1;
        a.destroy();
        this.juice.shake(trashBinType);
        this.spawnTrash();

      }
    });
  }
}
