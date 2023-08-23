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
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.fruits = new Array(4);
    this.fruitsIn = false;
    this.touchDown = 0;
    this.fallingFruit = 0;
    this.Basket;
    this.buttonHandlers = new ButtonPressHandlers();
    this.started = false;
  }
  preload() {
    this.load.image(
      "8B7_BG",
      new URL("./assets/fruitBaskets/background.png", import.meta.url).href
    );
    this.load.image(
      "8B7_CLOUDS",
      new URL("./assets/fruitBaskets/clouds.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B7_lCatCloud",
      new URL("./assets/fruitBaskets/catcloud1.png", import.meta.url).href,
      {
        frameWidth: 430 / 2,
        frameHeight: 112,
      }
    );
    this.load.spritesheet(
      "8B7_rCatCloud",
      new URL("./assets/fruitBaskets/catclouds2.png", import.meta.url).href,
      {
        frameWidth: 430 / 2,
        frameHeight: 112,
      }
    );
    this.load.spritesheet(
      "8B7_FRUITS",
      new URL("./assets/fruitBaskets/fruits.png", import.meta.url).href,
      {
        frameWidth: 99,
        frameHeight: 112,
      }
    );
    this.load.spritesheet(
      "8B7_baskets",
      new URL("./assets/fruitBaskets/basket.png", import.meta.url).href,
      {
        frameWidth: 488 / 2,
        frameHeight: 153,
      }
    );
    this.load.audio(
      '8B7_Splat',
      new URL('./assets/fruitBaskets/splat.wav', import.meta.url).href
    );
    this.load.audio(
      '8B7_FruitIn',
      new URL('./assets/fruitBaskets/FruitIn.wav', import.meta.url).href
    );
    
      
  }
  create() {
    this.makeSounds();
    this.gameBools()
    this.makeAnims();
    this.addBaseAssets();
    this.cloudAnims();
    this.spawnFruits();
    this.basket = this.physics.add.sprite(w / 2, h * 0.875, "8B7_baskets");
    this.basket.body.setSize( 200,90,);

    eventsCenter.on("start_game", () => {
      this.started = true;
      this.globalState.timerMessage("start_timer");
    });
  }

  update() {
    console.log("update is running");
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      this.spawnFruits();
      this.fruitsAction();
    }

    if (this.gameOver && !this.sent) {
      eventsCenter.emit("stop_timer");
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    }
  }
  winCon() {
    this.fruitsIn = false;
    this.gameOver = true;
    this.victory = true; 
  }
  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }
  initGamePad() {
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === -1,
      () => this.moveBasket(-1)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === 1,
      () => this.moveBasket(1)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === 0,
      () => this.moveBasket(0)
    );
  }
  moveBasket(x) {
    if (x === -1) {
      this.basket.setVelocityX(-350);
    }
    if (x === 1) {
      this.basket.setVelocityX(350);
    }
    if (x === 0) {
      this.basket.setVelocityX(0);
    }
  }
  fruitsAction() {
    if ((this.gameOver === false) & (this.fruitsIn === true)) {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.basket.body,
          this.fruits[this.fallingFruit].body
        )
      ) {
        this.basketSound.play({
          volume: 1.5,
        })
        this.nextFruit();
      }
      this.fruits[this.fallingFruit].visible = true;
      if (this.fruits[this.fallingFruit].y < 680) {
        this.fruits[this.fallingFruit].y += 5;

      } else {
        this.splatSound.play({
          volume: 1.5,
        });
        this.defeted();
      }
    }
  }
  nextFruit() {
    console.log('touchdown')
    this.touchDown += 1;
    if (this.touchDown === 4) {
      this.fruits[this.fallingFruit].visible = false;
      this.winCon();
    }else{
    this.basket.anims.play('wobble')
    this.fallingFruit += 1;
    this.fruits[this.fallingFruit - 1].destroy();}
  }
  defeted() {
    this.victory = false;
    this.gameOver = true;
  }
  spawnFruits() {
    if (this.fruitsIn === false) {
      for (let i = 0; i < this.fruits.length; i++) {
        this.frameNumber = Math.floor(Math.random() * 4);
        const Xpostion = Math.floor(Phaser.Math.Between(180, 920));
        this.fruits[i] = this.physics.add
          .sprite(Xpostion, 120, "8B7_FRUITS")
          .setFrame(this.frameNumber);
        this.fruits[i].visible = false;
        this.fruits[i].body.setSize(79, 77), true;
      }
      this.fruitsIn = true;
    }
  }
  addBaseAssets() {
    this.add.image(w / 2, h / 2, "8B7_BG");
    this.add.image(w / 2, h * 0.12, "8B7_CLOUDS");
    this.leftCloud = this.add.sprite(w * 0.25, h * 0.25, "8B7_lCatCloud");
    this.leftCloud.flipX = true;
    this.rightCloud = this.add.sprite(w * 0.75, h * 0.25, "8B7_rCatCloud");
  }
  cloudAnims() {
    this.leftCloud.anims.play("Lcloud", true);
    this.time.delayedCall(
      500,
      () => {
        this.rightCloud.anims.play("Rcloud", true);
      },
      [],
      this
    );
  }
  gameBools(){
    this.gameOver = false;
    this.victory = true;
    this.sent = false;
    this.fruits = new Array(4);
    this.fruitsIn = false;
    this.touchDown = 0;
    this.fallingFruit = 0;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null
    this.started = false;
  }
  makeAnims() {
    this.anims.create({
      key: "wobble",
      frames: [
        { key: "8B7_baskets", frame: 0 },
        { key: "8B7_baskets", frame: 1 },
      ],
      frameRate: 5,
      repeat: 0,
      yoyo: true, 
    });
    this.anims.create({
      key: "FruitChoice",
      frames: [
        { key: "8B7_FRUITS", frame: 0 },
        { key: "8B7_FRUITS", frame: 1 },
        { key: "8B7_FRUITS", frame: 2 },
        { key: "8B7_FRUITS", frame: 3 },
      ],
      frameRate: 0,
      repeat: 0,
    });

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
  makeSounds(){
    this.basketSound = this.sound.add('8B7_FruitIn');
    this.splatSound = this.sound.add('8B7_Splat');
  }
}
