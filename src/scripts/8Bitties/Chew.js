import Phaser from "phaser";
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
    console.log("update");
  }
}
