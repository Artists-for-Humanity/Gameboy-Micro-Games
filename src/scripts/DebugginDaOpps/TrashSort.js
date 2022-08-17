import eventsCenter from '../EventsCenter'


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
    this.currTrashItem;
    this.playerScore = 0;
    this.firstTrash = Phaser.Math.Between(0, 3);
    this.victory = false;
    this.gameOver = false;
    this.sent = false;
  }

  preload() {
    this.load.image(
      "DO3_startScreen",
      new URL("./assets1/sort-screen.png", import.meta.url).href
    );
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
      "DO3_plastic_bag",
      new URL("./assets1/plastic-bag-pixel.png", import.meta.url).href
    );
    this.load.image(
      "DO3_plastic__can_holder",
      new URL("./assets1/plastic-can-holder.png", import.meta.url).href
    );
  }

  create() {
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
      DO3_plastic_bag: "DO3_recycle_bin",
      DO3_plastic__can_holder: "DO3_recycle_bin",
      DO3_pizza: "DO3_trash_bin",
    };

    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO3_gameOverScreen"
    );

    this.tempBg = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "DO3_startScreen"

    );

    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);
  }

  update() {
    if (!this.gameOver) {
      console.log('reachme 00');





      if (this.playerScore === this.triesToWin) {
        this.currTrashItem.visible = false;
        this.victory = true;
        this.gameOver = true;
        console.log('reachme 02');
        this.endText = this.add.text(300, 250, "You Won!");
        this.endText.setStyle({
          fontSize: "100px",
          fill: "000000",
          align: "center",
        });
      }

      if (this.currTrashItem === undefined) {

        this.currTrashItem = this.physics.add
          .image(
            this.game.config.width / 2,
            -100,
            Object.keys(this.trashBinMap)[this.firstTrash]
          )
          .setScale(0.12, 0.12);
        this.addTrashCollider(this.recycleBin);
        this.addTrashCollider(this.trashBin);
        console.log('reachme 06');

      }



      if (this.currTrashItem.y >= 720 + this.currTrashItem.displayWidth / 2) {
        this.gameOver = true;
        console.log('reachme 01');

        this.gameOverScreen.visible = true;
        this.currTrashItem.visible = false;
        console.log('reachme 04');

      }
      this.time.delayedCall(1000, this.dropTrash, [], this);




    }

    if (this.gameOver && !this.sent) {
      console.log('reachme 07');

      eventsCenter.emit('game-end', this.victory)
      console.log('emission sent')
      this.sent = true

    }
  }

  timerCountdown(time) {
    if (time / 1000 > 10) {
      this.gameState = false;
      this.gameOver = true;
      this.gameOverScreen.visible = true;
    }
  }

  onEvent() {
    this.tempBg.visible = false;
  }

  // Get the current trash item on screen and drop its y coordinate down.
  dropTrash() {
    this.addTrashCollider(this.recycleBin);
    this.addTrashCollider(this.trashBin);
    this.currTrashItem.y += 5;
    this.moveTrash();
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

  moveTrash() {
    if (this.cursors.left.isDown) {
      this.currTrashItem.x -= 3;
    }
    if (this.cursors.right.isDown) {
      this.currTrashItem.x += 3;
    }
  }

  addTrashCollider(trashBinType) {
    const destination = this.trashBinMap[this.currTrashItem.texture.key];
    this.physics.add.collider(this.currTrashItem, trashBinType, (a, b) => {
      if (destination !== trashBinType.texture.key) {
        this.gameOver = true;
        console.log('reachme 03');
        this.gameOverScreen.visible = true;
        a.destroy();
        b.destroy();
        console.log('reachme 03.1');
      } else {
        this.playerScore += 1;
        a.destroy();
        this.spawnTrash();
      }
    });
  }
}
