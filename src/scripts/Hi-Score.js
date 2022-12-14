import gameDataBase from "./Database/GameDataBase";
export default class HiScoreScene extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "HiScoreScene",
    });
    this.names = [];
    this.place = 1;
    this.letter = 0;
    this.dataSet = 0;
    this.inti = [];
  }
  preload() {
    this.load.spritesheet(
      "numbers",
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
    this.action = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.createLists();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.action)) location.reload();
    this.createLists();
  }

  createLists() {
    console.log("i should be starting");
    for (let n = 0; n < this.globalState.names.length - 1;) {
      for (let l = 0; l < 3; l++) {
        // name
        this.add
          .image(200 + 40 * l, 200 + 60 * this.dataSet, "alphaSheet")
          .setFrame(this.sampleData[this.dataSet][l])
          .setScale(0.2);
        // score
        // this.inti.push(this.parseNumber(this.scores[this.dataSet]));
        this.parseNumber(this.globalState.scores[this.dataSet][3]);
        this.add
          .image(700 + 40 * l, 200 + 60 * this.dataSet, "numbers")
          .setFrame(this.inti[l])
          .setScale(0.15);
        console.log(this.parseNumber(this.scores[this.dataSet]));
      }
      this.inti = [];
      this.dataSet++;
      n++;
    }
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
    console.log(
      "Hundreds: " +
      hun +
      "\nTens: " +
      ten +
      "\nOnes: " +
      one +
      "\nTotal: " +
      val
    );
    // return [hun, ten, one];
  }
}
