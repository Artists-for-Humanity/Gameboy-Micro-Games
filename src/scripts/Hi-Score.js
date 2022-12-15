import gameDataBase from "./Database/GameDataBase";
import ButtonPressHandlers from './ButtonPressHandlers';
export default class HiScoreScene extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: true,
      key: "HiScoreScene",
    });
    this.names = [];
    this.place = 1;
    this.letter = 0;
    this.dataSet = 0;
    this.inti = [];
    this.ones;
    this.tens;
    this.huns;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;

  }
  preload() {
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
    // this.action = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.SPACE
    // );
    this.createLists();
    if (this.globalState.scores > 0) {
      this.setScore(this.globalState.scores);
    }
    // console.log(this.globalState.names);
  }

  update() {
    // if (Phaser.Input.Keyboard.JustDown(this.action)) location.reload();
    this.buttonHandlers.update();
    if (!this.gamePad) {
      this.startGamePad();
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
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => location.reload());
  }

  createLists() {
    if (this.globalState.names != []) {
      // console.log(this.dataSet);
      console.log(this.globalState.names.length);
      for (let n = 0; n < this.globalState.names.length - 2;) {
        // this.add
        //   .image(700, 200 + 60 * this.dataSet, "lScores")
        //   .setFrame(this.globalState.scores)
        //   .setScale(0.1);

        this.ones = this.physics.add.sprite(700 + 50, 200 + 60 * this.dataSet, 'lScores');
        this.ones.setScale(0.1, 0.1);
        this.tens = this.physics.add.sprite(700, 200 + 60 * this.dataSet, 'lScores');
        this.tens.setScale(0.1, 0.1);
        // this.huns = this.physics.add.sprite(700 - 82, 200 + 60 * this.dataSet, 'lScores');
        for (let l = 0; l < 3; l++) {
          // name
          this.add
            // .sprite(200 + 40 * l, 200 + 60 * this.dataSet, "alphaSheet")
            // .setScale(0.3);
            .image(200 + 40 * l, 200 + 60 * this.dataSet, "alphaSheet")
            .setFrame(this.globalState.names[l])
            .setScale(0.2);
          // score
          // this.inti.push(this.parseNumber(this.scores[this.dataSet]));
          // this.parseNumber(this.globalState.scores[this.dataSet][3]);
          // this.add
          //   .image(700 + 40 * l, 200 + 60 * this.dataSet, "numbers")
          //   .setFrame(this.inti[l])
          //   .setScale(0.15);
          // console.log(this.parseNumber(this.scores[this.dataSet]));
        }
        this.inti = [];
        this.dataSet++;
        n++;
      }
    }
  }

  setScore(score) {
    if (score < 0) {
      score = 0;
    }
    console.log(score);
    let o = score % 10;
    let h = Math.floor(score / 100);
    let t = Math.floor((score - (h * 100)) / 10);

    this.ones.setFrame(o);
    if (score >= 10)
      this.tens.setFrame(t);
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
