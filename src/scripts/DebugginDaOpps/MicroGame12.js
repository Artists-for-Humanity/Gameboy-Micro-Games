export default class MicroGame12 extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "MicroGame12",
    });

    // Game Object Declarations
    this.gameState = true;
    this.startScreen;
    this.timedEvent;
    this.firstTrash = Phaser.Math.Between(0, 3);
  }

  preload() {
    this.load.image(
      "startScreen",
      new URL("./assets1/startScreen.png", import.meta.url).href
    );
    this.load.image(
      "gameOverScreen",
      new URL("./assets1/game-over.png", import.meta.url).href
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
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;
    this.recycleBin = this.physics.add
      .image(760, 540, "recycle-bin")
      .setScale(0.15, 0.15);
    this.trashBin = this.physics.add
      .image(320, 540, "trash-can")
      .setScale(0.15, 0.15);
    this.currTrashItem;
    this.chicken;
    this.listOfTrashItems = [
      { image: "chicken-leg", destination: "trash" },
      { image: "pizza", destination: "trash" },
      { image: "plastic-bag", destination: "recycle" },
      {
        image: "plastic-can-holder",
        destination: "recycle",
      },
    ];
    this.gameOverScreen = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "gameOverScreen"
    );
    this.currTrashItem = this.physics.add
      .image(
        this.gameWidth / 2,
        0,
        this.listOfTrashItems[this.firstTrash].image
      )
      .setScale(0.1, 0.1);

    this.tempBg = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "startScreen"
    );

    this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.currTrashItem, this.trashBin, (a, b) => {
      console.log("What is :", a.texture.key, b.texture.key);
      if (a.texture.key === "chicken-leg" && b.texture.key === "trash-can") {
        a.destroy();
      }
      if (a.texture.key === "pizza" && b.texture.key === "trash-can") {
        a.destroy();
      }
      this.spawnTrash();
    });
    this.physics.add.collider(this.currTrashItem, this.recycleBin);

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);
  }

  update() {
    this.time.delayedCall(1000, this.dropTrash, [], this);
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
    if (this.currTrashItem.y >= 720 + this.currTrashItem.displayWidth / 2) {
      this.spawnTrash();
    }
    this.currTrashItem.y += 2;
    this.moveTrash();
  }

  // Spawn new trash onto the screen, replace the trash image of the currentTrashItem, and reset the y coordinate.
  spawnTrash() {
    console.log("spawn new trash");
    this.currTrashItem = this.physics.add
      .image(
        this.gameWidth / 2,
        0,
        this.listOfTrashItems[Phaser.Math.Between(0, 3)].image
      )
      .setScale(0.1, 0.1);

    this.physics.add.collider(this.currTrashItem, this.trashBin, (a, b) => {
      a.destroy();
      console.log("What is :", a.texture.key);
      this.spawnTrash();
    });
    // if
  }

  //
  moveTrash() {
    // check if left arrow key is down, then change the -x coordinate
    if (this.cursors.left.isDown) {
      this.currTrashItem.x -= 2;
    }
    if (this.cursors.right.isDown) {
      this.currTrashItem.x += 2;
    }
    // check if left arrow key is down, then change the x coordinate
  }
}
