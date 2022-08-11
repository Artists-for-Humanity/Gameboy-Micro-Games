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
  }
  preload() {
    this.load.spritesheet(
      "8B1_meat",
      new URL("../8Bitties/assets/Chew/fly_sheet.png", import.meta.url).href,
      {
        frameHeight: 128,
        frameWidth: 190,
      }
    );
    this.load.spritesheet(
      "8B1_marcy",
      new URL("../8Bitties/assets/Chew/flyswatter_sheet.png", import.meta.url)
        .href,
      {
        frameHeight: 430,
        frameWidth: 322,
      }
    );
  }
  create() {
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.makeAnims();
    this.marcy = this.add.sprite(540, 360, "8B1_marcy");
    this.drumStick = this.add.sprite(540, 400, "8B1_meat");
  }
  update() {
    this.meatStick();
    this.chewing();
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
      key: "1",
      frames: [{ key: "8B1_meat", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "2",
      frames: [{ key: "8B1_meat", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "3",
      frames: [{ key: "8B1_meat", frame: 2 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "4",
      frames: [{ key: "8B1_meat", frame: 3 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "5",
      frames: [{ key: "8B1_meat", frame: 4 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "open",
      frames: [{ key: "8B1_marcy", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "closed",
      frames: [{ key: "8B1_marcy", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });
  }
  chewing() {
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) this.keyInt += 1;
    if (this.keyInt === 3) {
      this.chewInt += 1;
      this.keyInt = 0;
      this.marcy.anims.play("open", true);
    }
    if (this.chewInt === 2) {
      this.chewInt = 0;
      this.biteCount += 1;
      this.marcy.anims.play("closed", true);
    }
  }
  meatStick() {
    if (this.biteCount === 1) this.drumStick.anims.play("1");
    if (this.biteCount === 2) this.drumStick.anims.play("2");
    if (this.biteCount === 3) this.drumStick.anims.play("3");
    if (this.biteCount === 4) this.drumStick.anims.play("4");
    if (this.biteCount === 5) {
      this.drumStick.anims.play("5");
      this.victory = true;
      this.gameOver = true;
    }
  }
}
