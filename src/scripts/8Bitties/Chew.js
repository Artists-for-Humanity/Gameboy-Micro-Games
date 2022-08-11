import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
export default class chew extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Chew",
    });
  }
  preload() {
    console.log("preload");
  }
  create() {
    console.log("create");
  }
  update() {
    if (this.gameOver && !this.sent) {
      eventsCenter.emit("game-end", this.victory);
      console.log("victory = " + this.victory);
      console.log("emission sent");
      this.sent = true;
    }
    console.log("update");
  }
}
