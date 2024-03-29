import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from '../ButtonPressHandlers';

export default class TugOWar extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "TugOWar",
    });
    // Game Object Decla
    this.gamestart = false;
    this.pull;
    this.mud;
    this.progressBar;
    this.dash;
    this.player;
    this.npc;
    this.rope;
    this.meter;
    this.dash;
    this.gameStarted = false;
    this.youlose;
    this.loseScale = 0;
    this.LoseTimer = 0;
    this.youwin;
    this.winTimer = 0;
    this.winScale = 0;
    this.imageCreated = false;
    this.dashPos = 50;
    this.victory = false;
    this.lose = false;
    this.gameOver = false;
    this.slip = false;
    this.playerRopePile;
    this.npcRopePile;
    this.started;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  preload() {
    this.load.image(
      "8B6_ropePile",
      new URL("../8Bitties/assets/TugOWar/tow_pile.png", import.meta.url).href
    );
    this.load.image(
      "8B6_background",
      new URL("../8Bitties/assets/TugOWar/tugOwarBG.png", import.meta.url).href
    );
    this.load.image(
      "8B6_rope",
      new URL("../8Bitties/assets/TugOWar/tow_rope_crop.png", import.meta.url)
        .href
    );
    this.load.image(
      "8B6_safe",
      new URL("../8Bitties/assets/TugOWar/safe_text.png", import.meta.url).href
    );
    this.load.image(
      "8B6_lose",
      new URL("../8Bitties/assets/TugOWar/fail_text.png", import.meta.url).href
    );
    this.load.image(
      "8B6_meter",
      new URL("../8Bitties/assets/TugOWar/meter.png", import.meta.url).href
    );
    this.load.image(
      "8B6_dash",
      new URL("../8Bitties/assets/TugOWar/pointer.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B6_player",
      new URL("../8Bitties/assets/TugOWar/tow_player.png", import.meta.url)
        .href,
      {
        frameWidth: 149.5,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "8B6_mud",
      new URL("../8Bitties/assets/TugOWar/mudidlesprite.png", import.meta.url)
        .href,
      {
        frameWidth: 663,
        frameHeight: 237,
      }
    );
    this.load.audio(
      '8B6_tugNoise',
      new URL('../8Bitties/assets/TugOWar/rope tugging.wav', import.meta.url).href
    );
    this.load.audio(
      '8B6_slipNoise',
      new URL('../8Bitties/assets/TugOWar/slip.wav', import.meta.url).href
    );
    this.load.audio(
      '8B6_splatNoise',
      new URL('../8Bitties/assets/TugOWar/splatOn mud.wav', import.meta.url).href
    );
  }

  create() {
    this.resetTow();
    this.createSounds();
    this.createAnimations();
    this.grass = this.add.image(540, 360, "8B6_background").setDepth(-10);
    this.mud = this.add.sprite(540, 620, "8B6_mud").setDepth(-9);
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.rope = this.add.image(510, 580, "8B6_rope").setDepth(1);

    this.meter = this.add.image(75, 360, "8B6_meter");
    this.dash = this.add.image(90, 360, "8B6_dash");
    this.graphics = this.make.graphics();
    this.graphics.fillRect(295, 550, 440, 60);
    this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
    this.rope.setMask(this.mask);

    this.graphics2 = this.make.graphics();
    this.graphics2.fillRect(295, 550, 440, 60);
    this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics2);
    this.rope.setMask(this.mask);
    this.rope.setScale(0.4);
    this.playerRopePile = this.add
      .image(270, 560, "8B6_ropePile")
      .setScale(0.4);
    this.playerRopePile.visible = false;

    this.npcRopePile = this.add.image(780, 560, "8B6_ropePile").setScale(0.4);
    this.npcRopePile.flipX = true;
    this.npcRopePile.visible = false;

    this.gameStart();

    eventsCenter.on("start_game", () => {
      this.started = true;
      this.globalState.timerMessage("start_timer");
    });
  }
  update() {
    this.endgameCheck();

    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      this.ropePile();
      this.startDashMovement();
      // this.playerPull();
    }
    if (this.gameOver && !this.sent) {
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
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
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.playerPull(); });
  }

  scalePull() {
    if (this.pullScale <= 1) {
      this.pullTimer += 1;
      this.pullScale += 0.25 / this.pullTimer;
      this.pull.setScale(this.pullScale);
    } else if (this.pullTimer === 31) {
      this.pull.destroy();
      this.gameStart();
      this.pullTimer = 0;
    }
  }
  startDashMovement() {
    if ((this.gameOver === false) & this.gameStarted) {
      if (this.dash.y < 600) {
        this.dash.y += 3;
        this.rope.x += 2.5;
        if (this.npc.x <= 760) {
          this.npc.x += 2.5;
        }
        if (this.rope.x >= 510) {
          this.player.x += 2.5;
        }
      }
    }
  }

  playerPull() {
    if ((this.gameOver === false) & this.gameStarted) {
      if (this.dash.y > 140) {
        // if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        this.dash.y -= 48 / 1.25;
        this.rope.x -= 40 / 1.25;
        if (this.player.x >= 270) {
          this.player.x -= 40 / 1.25;
        }
        if (this.rope.x <= 510) {
          this.npc.x -= 40 / 1.25;
        }
      }
      // }
    }
  }
  gameStart() {
    this.gameStarted = true;
    this.mud.anims.play("8B6_mud");
    this.player = this.add
      .sprite(270, 560, "8B6_player")
      .setDepth(2)
      .play("pulling");
    this.player.anims.play("pulling");
    this.npc = this.add.sprite(760, 560, "8B6_player").setDepth(2);
    this.npc.flipX = true;
    this.npc.anims.play("pulling");
  }

  createAnimations() {
    this.anims.create({
      key: "pulling",
      frames: [
        { key: "8B6_player", frame: 0 },
        { key: "8B6_player", frame: 1 },
      ],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "fail",
      frames: [
        { key: "8B6_player", frame: 2 },
        { key: "8B6_player", frame: 3 },
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "8B6_mud",
      frames: [
        { key: "8B6_mud", frame: 0 },
        { key: "8B6_mud", frame: 1 },
        { key: "8B6_mud", frame: 2 },
        { key: "8B6_mud", frame: 2 },
        { key: "8B6_mud", frame: 3 },
        { key: "8B6_mud", frame: 4 },
        { key: "8B6_mud", frame: 5 },
        { key: "8B6_mud", frame: 6 },
        { key: "8B6_mud", frame: 7 },
        { key: "8B6_mud", frame: 8 },
        { key: "8B6_mud", frame: 9 },
        { key: "8B6_mud", frame: 10 },
        { key: "8B6_mud", frame: 11 },
        { key: "8B6_mud", frame: 12 },
        { key: "8B6_mud", frame: 13 },
        { key: "8B6_mud", frame: 14 },
        { key: "8B6_mud", frame: 15 },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }
  winOrLose() {
    if (this.rope.x > 680) {
      this.lose = true;
      this.started = false;
      eventsCenter.emit("stop_timer");
      console.log("8B6_lose");
    }
    if (this.rope.x <= 325) {
      this.victory = true;
      this.started = false;
      eventsCenter.emit("stop_timer");
      console.log("8B6_win");
    }
  }
  youLose() {
    if (this.imageCreated === false) {
      this.youlose = this.add.image(540, 360, "8B6_lose").setDepth(100);
      this.imageCreated = true;
    }
    if (this.loseScale <= 1) {
      this.LoseTimer += 1;
      this.loseScale += 0.2 / this.LoseTimer;
      this.youlose.setScale(this.loseScale);
    } else this.gameOver = true;
  }
  youWin() {
    if (this.imageCreated === false) {
      this.youwin = this.add.image(540, 360, "8B6_safe").setDepth(100);
      this.imageCreated = true;
    }
    if (this.winScale <= 1) {
      this.winTimer += 1;
      this.winScale += 0.2 / this.winTimer;
      this.youwin.setScale(this.winScale);
    } else this.gameOver = true;
  }
  endgameCheck() {
    this.winOrLose();
    if (this.victory === true) {
      this.youWin();
      if (this.slip != true) {
        this.npc.anims.play("fail", true);
        this.slip = true;
      }
    }
    if (this.lose === true) {
      this.youLose();
      if (this.slip != true) {
        this.player.anims.play("fail", true);
        this.slip = true;
        this.slipSound.play({
          volume:1
        });
        this.setTimeout(() => {
         this.splatSound.play({
          volume:1, 
         })
        }, 200);
      }
    }
  }
  ropePile() {
    if (this.rope.x < 510) {
      this.playerRopePile.visible = true;
      this.npcRopePile.visible = false;
      return;
    }
    if (this.rope.x > 510) {
      this.playerRopePile.visible = false;
      this.npcRopePile.visible = true;
      return;
    }
  }
  createSounds(){
    this.slipSound = this.sound.add('8B6_slipNoise');
    this.splatSound = this.sound.add('8B6_splatNoise');
    this.tugSound = this.soound.add('8B6_tugNoise');
  }
  resetTow(){
    this.gamestart = false;
    this.gameStarted = false;
    this.loseScale = 0;
    this.LoseTimer = 0;
    this.winTimer = 0;
    this.winScale = 0;
    this.imageCreated = false;
    this.dashPos = 50;
    this.victory = false;
    this.lose = false;
    this.gameOver = false;
    this.slip = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
}
