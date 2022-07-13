export default class Cat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "shadow", "fall", "safe", "fail");
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.fail = true;
    this.fall = false;
    this.safe = false;
    this.catScale = 0;
    this.timer = 0;
  }

  create() {
    console.log("create");
  }
  update() {
    this.scaleShadow();
  }
  scaleShadow() {
    if (this.catScale <= 1) {
      this.timer++;
      this.catScale += 0.17 / this.timer;
      this.scene.cat.setScale(this.catScale);
    } else if (this.timer === 201) {
      this.timer = 0;
      this.playanimations();
    }
  }
  playanimations() {
    if (this.safe === true) {
      this.anims.play("safe", true);
      return;
    }
    if (this.fall === true) {
      this.anims.play("fall", true);
      return;
    }
    if (this.fail === true) {
      this.anims.play("fail", true);
      return;
    }
  }
}
