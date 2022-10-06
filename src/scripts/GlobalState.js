import Phaser from "phaser";
import eventsCenter from "./EventsCenter";

class GlobalState extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    this.initialTime = 10;
    this.timedEvent;
    this.cutScreen;
    this.gamePad = null;
  }

  test() {
    // this.cutScreen = this.scene.get('CutScreen');
    // this.cutScreen.testing();
  }

  randomGame() {
    // this.pluginManager.game.scene.start(this.game.scene.scenes[Phaser.Math.Between(0, this.game.scene.scenes.length)])
    //this.pluginManager.game.scene.start(this.game.scene.scenes[this.game.scene.scenes.length - 1]);
    console.log(this.game.scene.scenes[this.game.scene.scenes.length - 1]);
    this.pluginManager.game.scene.start();
  }

  preload(game) {
    // console.log(game);
    game.load.image(
      "mask",
      new URL("./globalAssets/mask.png", import.meta.url).href
    );
    game.load.image(
      "bomb",
      new URL("./globalAssets/bomb.png", import.meta.url).href
    );
    game.load.image(
      "fuse",
      new URL("./globalAssets/fuse.png", import.meta.url).href
    );
  }

  createBombTimer(bombPosX, bombPosY, sec, game) {
    this.fuseImg = game.add.sprite(bombPosX, bombPosY, "fuse");
    // console.log('hello', this.fuseImg);

    this.fuseImg.setScale(0.25, 0.25);
    this.bombImg = game.add.sprite(this.fuseImg.x, this.fuseImg.y, "bomb");
    this.bombImg.setScale(0.5, 0.5);
    this.bombImg.x -= this.fuseImg.displayWidth / 2;
    this.bombImg.visible = true;

    // 2:30 in seconds
    this.initialTime = sec;
    this.prevScale = 0;
    this.text = game.add.text(
      this.bombImg.x - this.bombImg.displayWidth / 2,
      this.bombImg.y + 70,
      "Countdown: " + this.formatTime(this.initialTime)
    );
    this.fuseMask = game.add.sprite(this.fuseImg.x, this.fuseImg.y, "mask");
    this.fuseMask.setScale(this.fuseImg.scaleX, this.fuseImg.scaleY);
    this.fuseMask.visible = false;

    this.fuseImg.mask = new Phaser.Display.Masks.BitmapMask(
      game,
      this.fuseMask
    );
    this.fuseImg.mask.invertAlpha = false;
  }

  onEvent() {
    if (this.initialTime === 1) {
      this.timedEvent.loop = false;
      this.timedEvent.repeatCount = 0;
      this.text.setText("Boom!!!!!");
      this.bombImg.visible = false;
      this.fuseImg.visible = false;
    } else {
      this.initialTime -= 1; // One second
      let stepWidth = this.fuseMask.displayWidth / this.initialTime;
      this.fuseMask.x -= stepWidth;
      this.text.setText("Countdown: " + this.formatTime(this.initialTime));
    }
  }

  formatTime(seconds) {
    // Minutes
    var minutes = Math.floor(seconds / 60);
    // Seconds
    var partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, "0");
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
  }

  initCountDown(game) {
    this.createBombTimer(250, 625, this.initialTime, game);
    // Each 1000 ms call onEvent
    this.timedEvent = game.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });
  }

  // Helper Functions

  setText(myText, game) {
    this.myText = game.add.text("");
    this.myText.setStyle({
      fontSize: "100px",
      fill: "#ffffff",
      align: "center",
    });
    this.myText.setText(myText);
    const width = this.myText.displayWidth / 2;
    this.myText.setX(540 - width).setY(170);
  }

  sendMessage(victory) {
    eventsCenter.emit("game-end", victory);
    // console.log('emission sent')
  }

  timerMessage(message) {
    eventsCenter.emit(message);
    // console.log("emission sent");
  }
}

export default GlobalState;
