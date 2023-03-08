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
  }
  preload() {
    this.load.image(
      "8B7_BG",
      new URL(
        "./assets/fruitBaskets/background.png", import.meta.url).href
    );
    this.load.image(
      "8B7_clouds",
      new URL(
        "./assets/fruitBaskets/clouds.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B7_LcatCloud",
      new URL(
        "./assets/fruitBaskets/catcloud1.png", import.meta.url).href,
      {
        frameWidth: 430/2,
        frameHeight: 112,
      }
    );
  }
  create() {
    this.add.image(w/2, h/2, '8B7_BG');
  }
  update() {
    //
  }
}
