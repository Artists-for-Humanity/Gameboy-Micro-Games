import gameDataBase from "./Database/GameDataBase";
let hsv = [];
let i = 0;
export default class HiScoreScene extends Phaser.Scene {
  gameData;
  names = [];
  scores = [];
  isPrinted = false;
  tintedTitle = null;
  tintedText = null;
  tintedScore = null;
  textObj1 = null;
  constructor() {
    super({
      active: false,
      visible: false,
      key: "HiScoreScene",
    });
  }
  preload() {
    this.load.spritesheet(
      "numbers",
      new URL("../globalAssets/numsheet.png", import.meta.url).href,
      { frameWidth: 77, frameHeight: 122 }
    );
  }
  create() {
    // this.background = this.add.image(
    //   this.game.config.width / 2,
    //   this.game.config.height / 2,
    //   "background"
    // );
    
    this.action = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    if (Phaser.Input.Keyboard.JustDown(this.action)) {
      location.reload();
    }
    hsv = Phaser.Display.Color.HSVColorWheel();

    this.gameData = gameDataBase.getTopScores();

    this.createLists();
    this.displayLists();
    this.resetLists();
  }

  textCallBack(data) {
    data.tint.topLeft = hsv[Math.floor(i)].color;
    data.tint.topRight = hsv[359 - Math.floor(i)].color;
    data.tint.bottomLeft = hsv[359 - Math.floor(i)].color;
    data.tint.bottomRight = hsv[Math.floor(i)].color;

    i += 0.05;

    if (i >= hsv.length) {
      i = 0;
    }

    return data;
  }
  displayLists() {
    this.tintedTitle = this.add.text(
      this.game.config.width / 4.4,
      75,
      "LEADERBOARD",
      {
        fontSize: "76px",
        fontStyle: "bold",
        align: "center",
      }
    );

    this.tintedText = this.add.text(
      this.game.config.width / 4.4,
      200,
      this.names[0],
      {
        fontSize: "48px",
        fontStyle: "bold",
        align: "center",
      }
    );

    this.names.forEach((item, index) => {
      if (index != 0) {
        this.tintedScore = this.add.text(
          this.game.config.width / 3.7,
          (index + 1) * 50 + 200,
          this.names[index],
          {
            fontSize: "40px",
            fontStyle: "bold",
            align: "center",
          }
        );
        this.tintedScore = this.add.text(
          this.game.config.width - 325,
          (index + 1) * 50 + 200,
          this.scores[index],
          {
            fontSize: "40px",
            fontStyle: "bold",
            align: "center",
          }
        );
      }
    });
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
      if (place >= 10) {
        this.names.push(place + ". " + item.name);
      } else {
        this.names.push("0" + place + ". " + item.name);
      }
      this.scores.push(item.score);
    });
  }
  // this.numbas = this.add.image(300, 400, 'numberChar')
  //this.object.setFrame(frameNumb);
}
