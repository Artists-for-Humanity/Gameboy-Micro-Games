import Phaser from "phaser";
export default class Blanket extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "Blanket");
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
  }
  preload() {
    this.load.image(
      "Blanket",
      new URL("../assets/blanket.png", import.meta.url).href
    );
  }
  update() {
    console.log("blanket");
  }
}
