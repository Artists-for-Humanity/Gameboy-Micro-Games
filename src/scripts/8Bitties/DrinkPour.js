import Phaser from "phaser";
import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';

const X = 440;
const Y = 360;
const W = 153;
const H = 288;
const FILL_LINE = 80;

export default class DrinkPour extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "DrinkPour",
    });

    this.juice;
    this.juicemask;
    this.glass;
    this.fill_value = H;
    this.glass_group;
    this.gameLost = false;
    this.pourScale = 0;
    this.gameStart = false;
    this.stopped = false;
    this.unpoured = true;
    this.spillplay;
    this.overfill = false;
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
    this.press = false;
  }
  preload() {
    this.load.image(
      "8B3_dottedline",
      new URL("./assets/drink pour/dotted.png", import.meta.url).href
    );
    this.load.image(
      "8B3_background",

      new URL("./assets/drink pour/restaurantbg.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B3_glass",
      new URL("./assets/drink pour/glass.png", import.meta.url).href,
      {
        frameWidth: 175,
        frameHeight: 311,
      }
    );
    this.load.image(
      "8B3_juice",
      new URL("./assets/drink pour/liquid.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B3_spill",
      new URL("./assets/drink pour/lemonada.png", import.meta.url).href,
      {
        frameWidth: 185,
        frameHeight: 331,
      }
    );
    this.load.spritesheet(
      "8B3_pitcher",
      new URL("./assets/drink pour/pitchers.png", import.meta.url).href,
      {
        frameWidth: 391,
        frameHeight: 538,
      }
    );
    this.load.spritesheet(
      "8B3_idle pitcher",
      new URL("./assets/drink pour/lemonade_idle_sprites.png", import.meta.url)
        .href,
      {
        frameWidth: 391,
        frameHeight: 538,
      }
    );
    this.load.audio(
      'waterPouring', 
      new URL('./assets/drink pour/Pouring-Liquid.wav', import.meta.url).href
    );
    this.load.audio(
      'pitcherPlacement',
      new URL('./assets/drink pour/Putting-Down-Glass-Cup.wav', import.meta.url).href
    );
    this.load.audio(
      'water spilling', 
      new URL('./assets/drink pour/water spilling.wav', import.meta.url).href
    );
  }

  create() {
    // create scene animations
    this.drinkPourReset();
    this.animate();
    this.makeSounds();

    //background
    this.add.image(540, 360, "8B3_background");

    //add juice and glass
    this.glass = this.physics.add.sprite(X, Y, "8B3_glass");
    this.glass.setOrigin(0);
    this.juice = this.add.image(451, 366, "8B3_juice");
    this.juice.setOrigin(0);

    //add juice mask
    this.juicemask = this.make.graphics();
    this.juicemask.fillStyle(0xffffff);
    this.juicemask.beginPath();
    this.juicemask.fillRect(451, 366, 153, 288);
    const mask = this.juicemask.createGeometryMask();
    mask.setInvertAlpha(true);
    this.juice.setMask(mask);
    this.glass_group = this.add.container();
    this.glass_group.add(this.glass);
    this.glass_group.add(this.juice);

    //add dotted line
    this.dotted = this.add.image(525, 410, "8B3_dottedline");

    //keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    //pour popup booleans
    this.timer = 1;
    // this.pour = this.add.image(540, Y, "8B3_pour");
    // this.pour.setScale(0);

    //lemonade jug
    this.pitcher = this.add.sprite(200, 460, "8B3_pitcher");
    this.pitcher.anims.play("8B3_idle pitcher anim", true);
    this.pitcher.setScale(0.8);
    this.pitcher.setDepth(0);

    eventsCenter.on('start_game', () => { this.started = true; this.globalState.timerMessage('start_timer'); this.gameStart = true; });
  }

  update() {
    if (this.gameOver && !this.sent) {
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    };
    // console.log(this.gameOver);

    this.buttonHandlers.update();
    if (!this.gamePad) this.startGamePad();
    // this.playPour();
    if (this.press === true && this.stopped === false) {
      if (this.fill_value > 0 && this.gameStart) {
        this.fill_value -= 9;
        this.maskdraw();
        this.unpoured = false;
        this.pourAnim();
      }
      console.log(this.press);
    }
    if (
      this.fill_value <= 50 &&
      this.fill_value >= 1 &&
      !this.press &&
      this.gameStart
    ) {
      this.gameState();
    }
    if (
      this.press === false &&
      this.fill_value > 50 &&
      this.fill_value < 287 &&
      this.gameStart
    ) {
      this.gameLost = true;
      this.gameState();
    }
    if (!this.press && !this.unpoured) {
      this.stopped = true;
      this.pitcherReset();
    }
    if (this.fill_value === 0 && this.gameStart) {
      this.gameLost = true;
      this.overfill = true;
      this.gameStart = false;
      this.gameState();
      this.spillAnim();
      // console.log(fill_value);
    }
    if (this.gameOver && !this.sent) {
      eventsCenter.emit('game-end', this.victory);
      console.log('emission sent');
      this.sent = true;
    }
  }

  //dectects when button is pressed
  // pressed() {
  //   if (this.stopped === false) {
  //     if (this.fill_value > 0 && this.gameStart) {
  //       this.fill_value -= 9;
  //       this.maskdraw();
  //       this.unpoured = false;
  //       this.pourAnim();
  //     }
  //   }
  // }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }


  initGamePad() {
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.press = true; }
    );
    this.buttonHandlers.addPad(() => !this.gamePad.buttons[0].pressed, () => { this.press = false; }
    );

    // this.buttonHandlers.addPad(() => this.gamePad.buttons[0] === 0, () => {
    //   this.stopped = true;
    //   this.pitcherReset();
    // });
  }





  //checks whether you win or lose and displays it in the console
  gameState() {
    this.gameStart = false;
    if (!this.gameLost) {
      this.victory = true;
    }

    eventsCenter.emit('stop_timer');
    setTimeout(() => {
      this.gameOver = true;
    }, 1500);
  }

  //creates animations for the pitcher and spilled over cup
  animate() {
    //lemonade spill anim
    this.anims.create({
      key: "8B3_spill anim",
      frames: [
        { key: "8B3_spill", frame: 0 },
        { key: "8B3_spill", frame: 1 },
        { key: "8B3_spill", frame: 2 },
        { key: "8B3_spill", frame: 3 },
        { key: "8B3_spill", frame: 4 },
        { key: "8B3_spill", frame: 5 },
        { key: "8B3_spill", frame: 6 },
        { key: "8B3_spill", frame: 7 },
        { key: "8B3_spill", frame: 8 },
        { key: "8B3_spill", frame: 9 },
        { key: "8B3_spill", frame: 10 },
      ],
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "8B3_pitcher anim",
      frames: [
        { key: "8B3_pitcher", frame: 0 },
        { key: "8B3_pitcher", frame: 1 },
        { key: "8B3_pitcher", frame: 2 },
        { key: "8B3_pitcher", frame: 3 },
        { key: "8B3_pitcher", frame: 4 },
        { key: "8B3_pitcher", frame: 5 },
        { key: "8B3_pitcher", frame: 6 },
        { key: "8B3_pitcher", frame: 7 },
      ],
      frameRate: 13,
      repeat: 0,
    });
    this.anims.create({
      key: "8B3_idle pitcher anim",
      frames: [
        { key: "8B3_idle pitcher", frame: 0 },
        { key: "8B3_idle pitcher", frame: 1 },
        { key: "8B3_idle pitcher", frame: 2 },
        { key: "8B3_idle pitcher", frame: 3 },
        { key: "8B3_idle pitcher", frame: 4 },
        { key: "8B3_idle pitcher", frame: 5 },
        { key: "8B3_idle pitcher", frame: 6 },
        { key: "8B3_idle pitcher", frame: 7 },
      ],
      frameRate: 13,
      repeat: -1,
    });
  }

  //creates mask for juice/lemonade
  maskdraw() {
    this.juicemask.clear();
    this.juicemask.fillRect(451, 366, 153, this.fill_value);
  }

  //plays the "pour!" popup animation
  playPour() {
    if (this.pourScale <= 1) {
      this.timer++;
      this.pourScale += 0.27 / this.timer;
      this.pour.setScale(this.pourScale);
      this.pour.setDepth(1);
    } else if (this.timer === 62) {
      this.pour.destroy();
      this.gameStart = true;
      this.timer = 0;
    }
  }

  //plays the spilled over glass animation where the glass used to be and makes sure the juice is no longer visible
  spillAnim() {
    this.juice.setVisible(false);
    this.glass.setOrigin(0.03);
    this.glass.setY(354);
    this.spillplay = this.glass.anims.play("8B3_spill anim", true);
  }

  //plays the pitcher pouring animation
  pourAnim() {
    this.pitcher.setAngle(50);
    this.pitcher.setY(340);
    this.pitcher.setX(250);
    this.pitcher.anims.play("8B3_pitcher anim", true);
  }

  //sets position of the pitcher and plays animation to set the pitcher back down after the player stops pouring
  pitcherReset() {
    this.pitcher.setAngle(0);
    this.pitcher.setY(460);
    this.pitcher.setX(200);
    this.pitcher.anims.play("8B3_idle pitcher anim", true);
  }
  makeSounds(){
    this.spillingNoise = this.sound.add('water spilling');
    this.pouringNoise = this.sound.add('waterPouring') ;
    this.pitcherPlacementNoise = this.sound.add('pitcherPlacement');
  }
  drinkPourReset(){
    this.fill_value = H;
    this.gameLost = false;
    this.pourScale = 0;
    this.gameStart = false;
    this.stopped = false;
    this.unpoured = true;
    this.overfill = false;
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
    this.press = false;
  }
}
