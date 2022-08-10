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
  }

  preload() {
    this.load.image(
      "startScreen",
      new URL("./assets1/sort-screen.png", import.meta.url).href
    );
    this.load.image(
      "background",
      new URL("./assets1/game-background.png", import.meta.url).href
    );
    this.load.image(
      "gameOverScreen",
      new URL("./assets1/game-over.png", import.meta.url).href
    );
    this.load.image(
      "trash-bin",
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
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "background"
    );
    this.recycleBin = this.physics.add
      .image(760, 540, "recycle-bin")
      .setScale(0.2, 0.2);
    this.trashBin = this.physics.add
      .image(320, 540, "trash-bin")
      .setScale(0.2, 0.2);

    this.trashBinMap = {
      "chicken-leg": "trash-bin",
      "plastic-bag": "recycle-bin",
      "plastic-can-holder": "recycle-bin",
      pizza: "trash-bin",
    };

    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "gameOverScreen"
    );

    this.tempBg = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "startScreen"
    );

    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);
  }

  update() {
    if (!this.gameOver) {
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
      }

      if (this.currTrashItem.y >= 720 + this.currTrashItem.displayWidth / 2) {
        this.gameOver = true;
        this.gameOverScreen.visible = true;
        this.currTrashItem.visible = false;
      }
      this.time.delayedCall(1000, this.dropTrash, [], this);
    }
  }

  timerCountdown(time) {
    if (time / 1000 > 10) {
      this.gameState = false;
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

  // helper function that checks if the player lost the game or not.
  // when the wrong trash goes to the wrong can we will set the gameOver
  // flag to true
  addTrashCollider(trashBinType) {
    const destination = this.trashBinMap[this.currTrashItem.texture.key];
    this.physics.add.collider(this.currTrashItem, trashBinType, (a, b) => {
      if (destination !== trashBinType.texture.key) {
        this.gameOver = true;
        this.gameOverScreen.visible = true;
        a.destroy();
        b.destroy();
      } else {
        this.playerScore += 1;
        a.destroy();
        this.spawnTrash();
      }
    });
  }
}

/**
 *
 * Food dropping down game ends immediately.
 * Sorts correctly, but game ends before all items are sorted.
 * Trash to bin = immediate game over
 * Recycle, Trash = game over
 * Trash, trash, recycle, recycle = game won
 * 4 recycle = game won
 */
