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
      "player",
      new URL("../8Bitties/assets/TugOWar/imageholder.png", import.meta.url)
        .href
    );
    this.load.image(
      "npc",
      new URL("../8Bitties/assets/TugOWar/imageholder.png", import.meta.url)
        .href
    );
    this.load.image(
      "rope",
      new URL("../8Bitties/assets/TugOWar/ropeHolder.png", import.meta.url).href
    );
  }

  create() {
    this.pull = this.add.image(540, 360, "pull").setDepth(1);
    this.grass = this.add.image(540, 360, "background").setDepth(-10);
    this.mud = this.add.sprite(540, 560, "mud").setDepth(-9);
    this.progressBar = this.add.image(540, 75, "rope");
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.dash = this.physics.add.image(75, 540, "player");
    this.greenzone = this.physics.add.image(75, 360, "player");
    this.player = this.add.sprite(300, 560, "player");
    this.npc = this.add.sprite(780, 560, "npc");
  }

  update() {
    console.log(this.progNum);
    if (424 > this.dash.y > 296) {
      this.moveProgress();
    } else {
      this.progressBar.x -= 1;
      this.progNum -= 1;
    }
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
      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        this.dash.y -= 35;
      }
    }
  }

  gameStart() {
    this.rope = this.add.sprite(540, 460, "rope");
    this.meter = this.add.image(75, 360, "rope");
    this.gamestarted = true;
  }
  moveProgress() {
    if (this.progressBar.x < 690) {
      this.progressBar.x += 2;
      this.progNum += 2;
    }
    if (this.progNum >= 150) {
      console.log("you: W");
    }
  }
}
