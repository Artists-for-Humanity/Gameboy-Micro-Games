export default class TugOWar extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "TugOWar",
    });
    this.gamestart = false;
    // Game Object Decla
    this.pullTimer = 0;
    this.pullScale = 0;
    this.pull;
    this.mud;
    this.progressBar;
    this.dash;
    this.player;
    this.npcs;
    this.rope;
    this.meter;
    this.dash;
    this.greenzone;
    this.gamestarted = false;
    this.progNum = 0;
    this.youlose;
    this.loseScale = 0;
    this.LoseTimer = 0;
    this.youwin;
    this.winTimer = 0;
    this.winScale = 0;
    this.imageCreated = false;
    this.loseDecrease = false;
  }
  preload() {
    this.load.image(
      "background",
      new URL("../8Bitties/assets/TugOWar/tugOwarBG.png", import.meta.url).href
    );
    this.load.image(
      "pull",
      new URL("../8Bitties/assets/TugOWar/imageholder.png", import.meta.url)
        .href
    );
    this.load.image(
      "mud",
      new URL("../8Bitties/assets/TugOWar/imageholder.png", import.meta.url)
        .href
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
        frameWidth: 44,
        frameHeight: 64,
      }
    );
  }

  create() {
    this.createAnimations();
    this.pull = this.add.image(540, 360, "pull").setDepth(1);
    this.grass = this.add.image(540, 360, "background").setDepth(-10);
    this.mud = this.add.sprite(540, 560, "mud").setDepth(-9);
    this.progressBar = this.add.image(540, 75, "rope");
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.rope = this.add.sprite(540, 580, "rope").setDepth(1);
    this.meter = this.add.image(75, 360, "meter");
    this.dash = this.physics.add.image(90, 540, "dash");
    this.graphics = this.make.graphics();
    this.graphics.fillRect(290, 40, 500, 60);
    this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
    this.progressBar.setMask(this.mask);
    this.greenzone = this.physics.add
      .image(75, 360, "greenzone")
      .setVisible(false);
    this.player = this.add
      .sprite(270, 560, "player")
      .setDepth(2)
      .play("pulling");
    this.npc = this.add.sprite(810, 560, "player").setDepth(2).play("pulling");
    this.npc.flipX = true;
  }

  update() {
    this.winOrLose();
    this.scalePull();
    this.startDashMovement();
  }

  scalePull() {
    if (this.pullScale <= 1.5) {
      this.pullTimer += 1;
      this.pullScale += 0.3 / this.pullTimer;
      this.pull.setScale(this.pullScale);
    } else if (this.pullTimer === 83) {
      this.pull.destroy();
      this.gameStart();
      this.pullTimer = 0;
    }
  }
  startDashMovement() {
    if (this.dash && this.gamestarted) {
      if (this.dash.y <= 552) {
        this.dash.y += 2;
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.spacebar) &
        (this.imageCreated === false)
      ) {
        this.dash.y -= 35;
      }
      if (this.dash.y > 264 && this.dash.y < 424) {
        this.moveProgress();
      }
    }
  }

  gameStart() {
    this.gamestarted = true;
  }
  moveProgress() {
    if (this.progressBar.x < 770) {
      this.progressBar.x += 5;
      this.progNum += 5;
    }
  }
  winOrLose() {
    if (this.progNum >= 230) {
      this.youWin();
    }
    if (this.progNum <= -220) {
      this.youLose();
    }
    if (
      this.progressBar.x > 250 &&
      this.gamestarted & (this.imageCreated === false)
    ) {
      this.progressBar.x -= 2;
      this.progNum -= 2;
    }
  }

  youLose() {
    console.log("mudsplash animation here");
    if (this.imageCreated === false) {
      this.youlose = this.add.image(540, 360, "lose").setDepth(100);
      this.imageCreated = true;
    }
    if (this.loseScale <= 1) {
      this.LoseTimer += 1;
      this.loseScale += 0.2 / this.LoseTimer;
      this.youlose.setScale(this.loseScale);
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
    }
  }
  createAnimations() {
    this.anims.create({
      key: "pulling",
      frames: [
        {
          key: "player",
          frame: 0,
        },
        {
          key: "player",
          frame: 1,
        },
      ],
      frameRate: 1,
      repeat: -1,
    });
  }
}
