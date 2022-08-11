import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
export default class Chew extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Chew",
    });
    this.victory = false;
    this.gameOver = false;
    this.keyInt = 0;
    this.biteCount = 0;
    this.chewInt = 0;
    this.marcy;
    this.frameNum = 0;
  }
  preload() {
    this.load.spritesheet(
      "8B1_meat",
      new URL("../8Bitties/assets/Chew/marcy_meat.png", import.meta.url).href,
      {
        frameHeight: 509,
        frameWidth: 253,
      }
    );
    this.load.spritesheet(
      "8B1_marcy",
      new URL("../8Bitties/assets/Chew/marcy.png", import.meta.url).href,
      {
        frameHeight: 610,
        frameWidth: 688,
      }
    );
    this.load.spritesheet(
      "8B1_marcyTail",
      new URL("../8Bitties/assets/Chew/marcy_tail.png", import.meta.url).href,
      {
        frameHeight: 610,
        frameWidth: 688,
      }
    );
    this.load.image(
      "bg",
      new URL("../8Bitties/assets/Chew/kitchenbg.png", import.meta.url).href
    );
  }
  create() {
    this.bg = this.add.image(540, 360, "bg");
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.makeAnims();
    this.tail = this.add.sprite(340, 420, "8B1_marcyTail", 0);
    this.marcy = this.add.sprite(340, 420, "8B1_marcy", this.frameNum);
    this.drumStick = this.add.sprite(640, 400, "8B1_meat", 0);
    this.tail.anims.play("wag", true);
  }
  update() {
    //this.meatStick();
    if (this.biteCount < 6) this.chewing();
    console.log(this.biteCount);
    if (this.gameOver && !this.sent) {
      eventsCenter.emit("game-end", this.victory);
      console.log("victory = " + this.victory);
      console.log("emission sent");
      this.sent = true;
    }
  }
  makeAnims() {
    this.anims.create({
      key: "wag",
      frames: [
        { key: "8B1_marcyTail", frame: 0 },
        { key: "8B1_marcyTail", frame: 1 },
        { key: "8B1_marcyTail", frame: 2 },
        { key: "8B1_marcyTail", frame: 3 },
      ],
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "lick",
      frames: [
        { key: "8B1_marcy", frame: 2 },
        { key: "8B1_marcy", frame: 3 },
        { key: "8B1_marcy", frame: 4 },
      ],
      frameRate: 6,
      repeat: -1,
      yoyo: true,
    });
  }
  chewing() {
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) this.keyInt += 1;
    if (this.keyInt === 3) {
      this.chewInt += 1;
      this.keyInt = 0;
      this.frameSwap();
    }
    if (this.chewInt === 2) {
      this.chewInt = 0;
      this.biteCount += 1;
      this.meatStick();
    }
  }
  meatStick() {
    this.drumStick.setFrame(this.biteCount);
    if (this.biteCount === 6) {
      this.marcy.play("lick");
      this.victory = true;
      //this.gameOver = true;
    }
  }
  frameSwap() {
    if (this.frameNum === 0) {
      this.frameNum = 1;
    } else {
      this.frameNum = 0;
    }

    this.marcy.setFrame(this.frameNum);
  }
}
