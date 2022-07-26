import Phaser from "phaser";
export default class FlySwat extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "FlySwat",
    });
    this.Side = 8;
    this.fly;
    this.swatter;
    this.positionState = 0;
  }
  preload() {
    this.load.image(
      "position",
      new URL("../8Bitties/assets/FlySwat/imageholer.png", import.meta.url).href
    );
  }
  create() {
    this.spawnRightPos();
  }
  update() {
    this.FlyMove();
    // console.log("update");
  }
  FlyMove() {
    if (this.positionState === 0) {
      return;
    }
  }
  getRpos() {
    if (this.Rinit === false) {
      console.log("hold");
    }
  }
  spawnRightPos() {
    for (let i = 0; i < this.Side; i++) {
      const boxPos = this.getRpos();
    }
  }
}
