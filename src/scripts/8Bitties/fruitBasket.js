import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from "../ButtonPressHandlers";
const w = 1080;
const h = 720;
export default class fruitBasket extends Phaser.Scene {
  constructor() {
    super({
      key: "fruitBasket",
      active: false,
      visible: false,
    });
    this.leftCloud;
    this.victory = false;
    this.sent = false;
  }
  preload() {
    this.load.image(
      "8B7_BG",
      new URL(
        "./assets/fruitBaskets/background.png", import.meta.url).href
    );
    this.load.image(
      "8B7_CLOUDS",
      new URL(
        "./assets/fruitBaskets/clouds.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B7_lCatCloud",
      new URL(
        "./assets/fruitBaskets/catcloud1.png", import.meta.url).href,
      {
        frameWidth: 430/2,
        frameHeight: 112,
      }
    );
    this.load.spritesheet(
      "8B7_rCatCloud",
      new URL(
        "./assets/fruitBaskets/catclouds2.png", import.meta.url).href,
      {
        frameWidth: 430/2,
        frameHeight: 112,
      }
    );
    this.load.spritesheet(
      "8B7_FRUITS",
      new URL(
        "./assets/fruitBaskets/fruits.png", import.meta.url).href,
      {
        frameWidth: 432/4,
        frameHeight: 112,
      }
    );
    this.load.spritesheet(
      "8B7_baskets",
      new URL(
        "./assets/fruitBaskets/basket.png", import.meta.url).href,
      {
        frameWidth: 488/2,
        frameHeight: 112,
      }
    );
  }
  create() {
    this.makeAnims();
    this.add.image(w/2, h/2, '8B7_BG');
    this.add.image(w/2, h *.12,'8B7_CLOUDS');
    this.leftCloud = this.add.sprite(w*.25,h*.25, '8B7_lCatCloud')
    this.leftCloud.flipX = true;
    this.rightCloud = this.add.sprite(w*.75, h*.25, '8B7_rCatCloud');
    this.ground = this.physics.add.image( w/2, h*.937,'idkyet');
    this.ground.visible = false;
    this.ground.setSize(w, 90);

    this.cloudAnims(); 
  }
  cloudAnims(){
    this.leftCloud.anims.play('Lcloud', true);
    this.time.delayedCall(500, () => {
      this.rightCloud.anims.play('Rcloud', true);;
  }, [], this);
   
  }
  update() {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      //
      if (this.gameOver && !this.sent) {
        eventsCenter.emit("stop_timer");
        eventsCenter.emit("game-end", this.victory);
        this.sent = true;
      }
    }

  }
 

  makeAnims(){
    this.anims.create({
      key: "Rcloud",
      frames: [
        { key: "8B7_rCatCloud", frame: 0 },
        { key: "8B7_rCatCloud", frame: 1 },
      ],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "Lcloud",
      frames: [
        { key: "8B7_lCatCloud", frame: 0 },
        { key: "8B7_lCatCloud", frame: 1 },
      ],
      frameRate: 1,
      repeat: -1,
    });
  }
}
