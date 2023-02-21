import gameDataBase from "./Database/GameDataBase";
import ButtonPressHandlers from "./ButtonPressHandlers";
export default class HiScoreScene extends Phaser.Scene {
  gameData;
  constructor() {
    super({
      active: false,
      visible: true,
      key: "HiScoreScene",
    });
    this.names = [];
    this.scores = [];
    this.place = 1;
    this.letter = 0;
    this.dataSet = 0;
    this.inti = [];
    this.ones;
    this.tens;
    this.huns;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
    this.bobberTimer = 0;
    this.bobDir = false;
  }
  preload() {
    this.load.image(
      "Hs_ListBG",
      new URL("../scripts/globalAssets/LeaderboardListBg.png", import.meta.url)
        .href
    );
    this.load.image(
      "Hs_BG",
      new URL("../scripts/globalAssets/LeaderboardBg.png", import.meta.url).href
    );
    this.load.image(
      "Hs_Back",
      new URL("../scripts/globalAssets/BackButton_Large.png", import.meta.url)
        .href
    );
    this.load.image(
      "Hs_Retry",
      new URL(
        "../scripts/globalAssets/PlayAgainButton_Large.png",
        import.meta.url
      ).href
    );
    this.load.image(
      "pointer",
      new URL("gameAssets/finger.png", import.meta.url).href
    );

    this.load.spritesheet(
      "lScores",
      new URL(
        "../scripts/TeamInflation/assets/Lowest/numbers.png",
        import.meta.url
      ).href,
      { frameWidth: 313, frameHeight: 350 }
    );
    this.load.spritesheet(
      "alphaSheet",
      new URL("../scripts/Team Notateam/assets/alphaSheet.png", import.meta.url)
        .href,
      {
        frameHeight: 236,
        frameWidth: 209,
      }
    );
  }
  create() {
    this.add.image(540, 360, "Hs_BG");
    var n = 0;
    this.gameData = gameDataBase.getTopScores();
    this.createLists();
    this.displayList();
    this.back = this.add.image(530, 550, "Hs_Back");
    this.pointer = this.add.image(530, 450, "pointer").setRotation(Math.PI / 2);
  }

  update() {
    this.buttonHandlers.update();
    if (!this.gamePad) {
      this.startGamePad();
    }
    this.buttonHandlers.update();
    this.bouyantMotion(this.pointer, 1, 2);
    
  }
  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
    }
  }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
    }
  }
  initGamePad() {
    this.buttonHandlers.addPad(
      () => this.gamePad.buttons[0].pressed,
      () => location.reload()
    );
  }
  initGamePad() {
    this.buttonHandlers.addPad(
      () => this.gamePad.buttons[0].pressed,
      () => this.resetScoreScene()

    );
  }
 

  resetLists() {
    this.gameData.forEach((item, index) => {
      let place = index + 1;
      this.names.pop();
      this.scores.pop();
    });
  }

  createLists() {


    this.gameData.forEach((item, index) => {
      let place = index + 1;
      // console.log("Place: " + place);
      this.names.push(item.name);
      this.scores.push(item.score);
    });
  }
  displayList() {
    for (var n = 0; n < this.names.length; ) {
      this.ones = this.physics.add.sprite(
        700 + 50,
        200 + 50 * this.dataSet,
        "lScores"
      );
      this.ones.setScale(0.1, 0.1);
      this.tens = this.physics.add.sprite(
        700,
        200 + 50 * this.dataSet,
        "lScores"
      );
      this.tens.setScale(0.1, 0.1);
      this.setScore(this.scores[n]);

      // this.huns = this.physics.add.sprite(700 - 82, 200 + 60 * this.dataSet, 'lScores');
      // var tempNum = 0;

      for (let l = 0; l < 3; l++) {
        // tempNum++;

        // name
        this.add
          // .sprite(200 + 40 * l, 200 + 60 * this.dataSet, "alphaSheet")
          // .setScale(0.3);
          .image(250 + 45 * l, 200 + 50 * this.dataSet, "alphaSheet")
          .setFrame(this.names[n][l])
          .setScale(0.2);
      }
      this.inti = [];
      this.dataSet++;
      n++;
    }
  }

  setScore(score) {
    // if (score < 0) {
    //   score = 0;
    // }
    let o = score % 10;
    let h = Math.floor(score / 100);
    let t = Math.floor((score - h * 100) / 10);

    this.ones.setFrame(o);
    if (score >= 10) this.tens.setFrame(t);
    // if (score >= 100)
    //   this.huns.setFrame(h);
  }

  parseNumber(val) {
    // represents the number in the hundreds place
    let hun = Math.floor(val / 100);
    // represents the number in the tens place
    let ten = Math.floor((val - hun * 100) / 10);
    // represents the number in the ones place
    let one = val % 10;

    this.inti.push(hun);
    this.inti.push(ten);
    this.inti.push(one);
  }
resetScoreScene(){
  this.names = [];
  this.scores = [];
  this.place = 1;
  this.letter = 0;
  this.dataSet = 0;
  this.inti = [];
  this.scene.start('MainMenu');
}

  bouyantMotion(obj, amount, speed) {
    this.bobberTimer += speed;
    if (this.bobberTimer % 100 === 0) {
      this.bobDir = !this.bobDir;
    }
    this.bobDir ? (obj.y += amount) : (obj.y -= amount);
  }
}
