import gameDataBase from "./Database/GameDataBase";
export default class HiScoreScene extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "HiScoreScene",
    });
    this.names = [];
    this.sampleData = [
      [19, 0, 12],
      [1, 14, 1],
      [12, 0, 19],
    ];
    this.place = 1;
    this.letter = 0;
    this.dataSet = 0;
    this.scores = [[240],[63],[7]];
  }
  preload() {
    this.load.spritesheet(
      "numbers",
      new URL("../scripts/globalAssets/numsheet.png", import.meta.url).href,
      { frameWidth: 77, frameHeight: 122 }
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
    this.action = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.createLists();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.action)) location.reload();
  }

  createLists() {
    // console.log("i should be starting");
    for (let n = 0; n < 3;) {
      for (let l = 0; l < 3; l++) {
        // name
        this.add
          .image(200 + 40 * l, 200 + 60 * this.dataSet, "alphaSheet")
          .setFrame(this.sampleData[this.dataSet][l])
          .setScale(0.2);
        // score
        this.add.image(700 + 40* l, 200+60*this.dataSet, 'numsheet' )
      }
      this.dataSet++;
        n++;
    }
  }
}
