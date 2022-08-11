import eventsCenter from "../EventsCenter";
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
    this.pullTimer = 0;
    this.pullScale = 0;
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
    this.timer = 150;
    this.victory = false;
    this.lose = false;
    this.gameOver = false;
  }
  preload() {
    this.load.image(
      "background",
      new URL("../8Bitties/assets/TugOWar/tugOwarBG.png", import.meta.url).href
    );
    this.load.image(
      "pull",
      new URL("../8Bitties/assets/TugOWar/pulltext.png", import.meta.url).href
    );
    this.load.image(
      "rope",
      new URL("../8Bitties/assets/TugOWar/rope.png", import.meta.url).href
    );
    this.load.image(
      "safe",
      new URL("../8Bitties/assets/TugOWar/safe_text.png", import.meta.url).href
    );
    this.load.image(
      "lose",
      new URL("../8Bitties/assets/TugOWar/fail_text.png", import.meta.url).href
    );
    this.load.image(
      "meter",
      new URL("../8Bitties/assets/TugOWar/meter.png", import.meta.url).href
    );
    this.load.image(
      "dash",
      new URL("../8Bitties/assets/TugOWar/pointer.png", import.meta.url).href
    );
    this.load.spritesheet(
      "player",
      new URL("../8Bitties/assets/TugOWar/playerFrames.png", import.meta.url)
        .href,
      {
        frameWidth: 88,
        frameHeight: 128,
      }
    );
    this.load.image(
      "bar",
      new URL("../8Bitties/assets/TugOWar/progress_bar.png", import.meta.url)
        .href
    );
    this.load.spritesheet(
      "mud",
      new URL("../8Bitties/assets/TugOWar/mudidlesprite.png", import.meta.url)
        .href,
      {
        frameWidth: 663,
        frameHeight: 237,
      }
    );
  }

  create() {
    this.createAnimations();
    this.pull = this.add.image(540, 360, "pull").setDepth(1);
    this.grass = this.add.image(540, 360, "background").setDepth(-10);
    this.mud = this.add.sprite(540, 620, "mud").setDepth(-9);
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.rope = this.add.sprite(540, 580, "rope").setDepth(1);
    this.meter = this.add.image(75, 360, "meter");
    this.dash = this.add.image(90, 360, "dash");
    this.graphics = this.make.graphics();
    this.graphics.fillRect(295, 550, 440, 60);
    this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
    this.rope.setMask(this.mask);
  }
  update() {
    if (this.timer !== 0 && this.gameStarted) this.timer--;
    this.winOrLose();
    if (this.lose === true) this.youLose();
    if (this.victory === true) this.youWin();
    this.scalePull();
    this.startDashMovement();
    this.playerPull();
    if (this.gameOver && !this.sent) {
      eventsCenter.emit("game-end", this.victory);
      console.log("victory = " + this.victory);
      console.log("emission sent");
      this.sent = true;
    }
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
      }
    }
  }

  gameStart() {
    this.gameStarted = true;
    this.mud.anims.play("mud");
    this.player = this.add
      .sprite(270, 560, "player")
      .setDepth(2)
      .play("pulling");
    this.player.anims.play("pulling");
    this.npc = this.add.sprite(780, 560, "player").setDepth(2);
    this.npc.flipX = true;
    this.npc.anims.play("pulling");
  }

  playerPull() {
    if ((this.gameOver === false) & this.gameStarted) {
      if (this.dash.y > 140) {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
          this.dash.y -= 48;
          this.rope.x -= 40;
        }
      }
    }
  }
  createAnimations() {
    this.anims.create({
      key: "pulling",
      frames: [
        { key: "player", frame: 0 },
        { key: "player", frame: 1 },
      ],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "mud",
      frames: [
        { key: "mud", frame: 0 },
        { key: "mud", frame: 1 },
        { key: "mud", frame: 2 },
        { key: "mud", frame: 2 },
        { key: "mud", frame: 3 },
        { key: "mud", frame: 4 },
        { key: "mud", frame: 5 },
        { key: "mud", frame: 6 },
        { key: "mud", frame: 7 },
        { key: "mud", frame: 8 },
        { key: "mud", frame: 9 },
        { key: "mud", frame: 10 },
        { key: "mud", frame: 11 },
        { key: "mud", frame: 12 },
        { key: "mud", frame: 13 },
        { key: "mud", frame: 14 },
        { key: "mud", frame: 15 },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }
  winOrLose() {
    if ((this.timer === 0) & (this.rope.x > 380)) {
      this.lose = true;
      console.log("lose");
    }
    if ((this.timer === 0) & (this.rope.x < 380)) {
      this.victory = true;
      console.log("win");
    }
  }
  youLose() {
    if (this.imageCreated === false) {
      this.youlose = this.add.image(540, 360, "lose").setDepth(100);
      this.imageCreated = true;
    }
    if (this.loseScale <= 1) {
      this.LoseTimer += 1;
      this.loseScale += 0.2 / this.LoseTimer;
      this.youlose.setScale(this.loseScale);
      this.gameOver = true;
    }
  }
  youWin() {
    if (this.imageCreated === false) {
      this.youwin = this.add.image(540, 360, "safe").setDepth(100);
      this.imageCreated = true;
    }
    if (this.winScale <= 1) {
      this.winTimer += 1;
      this.winScale += 0.2 / this.winTimer;
      this.youwin.setScale(this.winScale);
      this.gameOver = true;
    }
  }
}
