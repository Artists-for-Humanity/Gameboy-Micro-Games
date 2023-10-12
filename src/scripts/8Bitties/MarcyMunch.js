import Phaser from "phaser";
import ButtonPressHandlers from "../ButtonPressHandlers";
import eventsCenter from "../EventsCenter";

export default class Chew extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "MarcyMunch",
    });
    this.victory = false;
    this.gameOver = false;
    this.keyInt = 0;
    this.biteCount = 0;
    this.chewInt = 0;
    this.marcy;
    this.frameNum = 0;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null
  }
  preload() {
    this.load.spritesheet(
      "8B1_meat",
      new URL("../8Bitties/assets/Chew/marcy_meat.png", import.meta.url).href,
      {
        frameHeight: 509,
        frameWidth: 253,
      }
    );
    this.load.spritesheet(
      "8B1_marcy",
      new URL("../8Bitties/assets/Chew/marcy.png", import.meta.url).href,
      {
        frameHeight: 610,
        frameWidth: 688,
      }
    );
    this.load.spritesheet(
      "8B1_marcyTail",
      new URL("../8Bitties/assets/Chew/marcy_tail.png", import.meta.url).href,
      {
        frameHeight: 610,
        frameWidth: 688,
      }
    );
    this.load.image(
      "8B1_bg",
      new URL("../8Bitties/assets/Chew/Marcy_Munch_BG.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B1_table",
      new URL("../8Bitties/assets/Chew/Marcy_Munch_Table.png", import.meta.url)
        .href
    );
    this.load.spritesheet(
      "8B1_candle",
      new URL("../8Bitties/assets/Chew/candle.png", import.meta.url).href,
      {
        frameHeight: 124,
        frameWidth: 43,
      }
    );
    this.load.audio(
      "chomp",
      new URL("../8Bitties/assets/Chew/chomp.mp3", import.meta.url).href
    );
    this.load.audio(
      "bark",
      new URL("../8Bitties/assets/Chew/bark.mp3", import.meta.url).href
    );
  }
  create() {
    this.setMarcy();
    this.makeSounds();
    this.bg = this.add.image(540, 360, "8B1_bg");
    this.table = this.add.image(750, 630, "8B1_table");
    this.candle = this.add.sprite(580, 570, "8B1_candle");
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.makeAnims();
    this.candle.anims.play("lit");

    this.tail = this.add.sprite(340, 420, "8B1_marcyTail", 0);
    this.marcy = this.add.sprite(340, 420, "8B1_marcy", this.frameNum);
    this.drumStick = this.add.sprite(750, 300, "8B1_meat", 0);
    this.tail.anims.play("wag", true);

    eventsCenter.on("start_game", () => {
      this.started = true;
      this.globalState.timerMessage("start_timer");
    });
  }
  update() {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      if (this.gameOver && !this.sent) {
        this.globalState.timerMessage("stop_timer");
        this.globalState.sendMessage(this.victory);
        this.sent = true;
      }
    }
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
      () => this.gamePad.buttons[0].pressed,
      () => {
        if (this.biteCount < 6) this.chewing();
      }
    );
  }
  setMarcy() {
    this.victory = false;
    this.gameOver = false;
    this.keyInt = 0;
    this.biteCount = 0;
    this.chewInt = 0;
    this.marcy;
    this.frameNum = 0;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
    this.sent = false;
  }
  makeAnims() {
    this.anims.create({
      key: "lit",
      frames: [
        { key: "8B1_candle", frame: 0 },
        { key: "8B1_candle", frame: 1 },
        { key: "8B1_candle", frame: 2 },
      ],
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: "wag",
      frames: [
        { key: "8B1_marcyTail", frame: 0 },
        { key: "8B1_marcyTail", frame: 1 },
        { key: "8B1_marcyTail", frame: 2 },
        { key: "8B1_marcyTail", frame: 3 },
      ],
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "lick",
      frames: [
        { key: "8B1_marcy", frame: 2 },
        { key: "8B1_marcy", frame: 3 },
        { key: "8B1_marcy", frame: 4 },
      ],
      frameRate: 6,
      repeat: -1,
      yoyo: true,
    });
  }
  chewing() {
    this.keyInt += 1;
    if (this.keyInt === 1) {
      this.chewInt += 1;
      this.keyInt = 0;
      this.frameSwap();
    }
    if (this.chewInt === 4) {
      this.chewInt = 0;
      this.biteCount += 1;
      this.chompsound.play({
        volume: .3,
      }

      )
      this.meatStick();
    }
    if (this.biteCount === 6) {
      this.victory === true;
      this.gameOver = true;
    }
  }
  meatStick() {
    this.drumStick.setFrame(this.biteCount);
    if (this.biteCount === 6) {
      this.marcy.play("lick");
      this.victory = true;
      this.barksound.play({
        volume: .5,
      });
      //this.gameOver = true;
    }
  }
  frameSwap() {
    if (this.frameNum === 0) {
      this.frameNum = 1;
    } else {
      this.frameNum = 0;
    }

    this.marcy.setFrame(this.frameNum);
  }
  makeSounds() {
    this.chompsound = this.sound.add('chomp');
    this.barksound = this.sound.add('bark');
  }
}
