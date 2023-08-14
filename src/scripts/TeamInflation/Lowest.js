const X = 1080;
const Y = 720;
import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';

export default class Lowest extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Lowest',
    });
    // pointer graphic object
    this.pointer;
    // index of selected equation
    this.selected = 2;
    // the correct value to match from evaluated[]
    this.correct;
    // an array of containers, each one will contain each equation 
    this.equations = [];
    // an array of sprites
    this.box = [];
    // an array of each equation's first operand, or just the number to be displayed
    this.num1 = [];
    // tells us what operation to perform on each set of operands
    this.opcode = [];
    // the second set of operands, value will be 0 if the index represents a number rather than an equation
    this.num2 = [];
    // the resulting value of each equation, or a repeated number
    // should be used to compare value of each equation 
    this.evaluated = [];
    // input objects
    this.up;
    this.down;
    this.left;
    this.right;
    this.space;
    // game state booleans
    this.gameOver = false;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  preload() {
    this.load.image("TI_1background", new URL("./assets/Lowest/NGbackground.png",
      import.meta.url).href);
    this.load.image("TI_1cursorimage", new URL("./assets/Lowest/cursorimage.png",
      import.meta.url).href);
    this.load.image("TI_1lose", new URL("./assets/Lowest/xmark.png",
      import.meta.url).href);
    this.load.image("TI_1win", new URL("./assets/Lowest/checkmark.png",
      import.meta.url).href);

    this.load.spritesheet("TI_1frames", new URL("./assets/Lowest/frames.png",
      import.meta.url).href, {
      frameWidth: 1368 / 3,
      frameHeight: 329
    });
    this.load.spritesheet("TI_1numbers", new URL("./assets/Lowest/numbers.png",
      import.meta.url).href, {
      frameWidth: 313,
      frameHeight: 350
    });
    this.load.spritesheet("TI_1operations", new URL("./assets/Lowest/operations.png",
      import.meta.url).href, {
      frameWidth: 1408 / 4,
      frameHeight: 294
    });
    this.load.audio(
      'TI_1hover',
      new URL('./assets/Lowest/chooseHover.wav', import.meta.url).href
    );
    this.load.audio(
      'TI_1badChoice',
      new URL('./assets/Lowest/wrong_choise.mp3', import.meta.url).href
    );
  }
  create() {

    // SET INPUTS
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // CREATE GRAPHICS
    this.add.image(X / 2, Y / 2, "TI_1background");
    this.anims.create({
      key: 'TI_1box',
      frames: [{
        key: 'TI_1frames',
        frame: 0
      },
      {
        key: 'TI_1frames',
        frame: 1
      },
      {
        key: 'TI_1frames',
        frame: 2
      }
      ],
      frameRate: 3,
      repeat: -1
    });

    // SET GAME VALUES
    this.setNumbers();

    // DETERMINE CORRECT OPTIONS
    this.correct = Math.min(...this.evaluated);
    console.log("TI_1correct:" + this.correct);

    // POPULATE GRAPHICS
    this.fillBox(0, X * .25, Y * .2);
    this.fillBox(1, X * .75, Y * .2);
    this.fillBox(2, X * .5, Y * .5);
    this.fillBox(3, X * .25, Y * .8);
    this.fillBox(4, X * .75, Y * .8);

    // SET SELECTED STARTING BOX
    this.box[this.selected].anims.play('TI_1box');
    this.pointer = this.add.image(this.box[this.selected].x, this.box[this.selected].y + 80, 'TI_1cursorimage');
    this.pointer.setScale(.15);

    // WIN & LOSE CONDITIONS
    this.loseText = this.add.image(400, 220, "TI_1lose");
    this.loseText.setScrollFactor(0);
    this.loseText.setOrigin(0, 0);
    this.loseText.setVisible(false);

    this.winText = this.add.image(400, 220, "TI_1win");
    this.winText.setOrigin(0, 0);
    this.winText.setScrollFactor(0);
    this.winText.setVisible(false);

    eventsCenter.on('start_game', () => { eventsCenter.emit('start_timer'); this.started = true; });
    this.makeSounds();
  }
  update() {

    if (this.started) {
      if (!this.gameOver) {
        this.buttonHandlers.update();
        if (!this.gamePad) this.startGamePad();
        // each if-statement passes the direction pressed to movePointer()
        // if (Phaser.Input.Keyboard.JustDown(this.left)) {
        //     this.movePointer("l")
        // }
        // if (Phaser.Input.Keyboard.JustDown(this.right)) {
        //     this.movePointer("r")
        // }
        // if (Phaser.Input.Keyboard.JustDown(this.up)) {
        //     this.movePointer("u")
        // }
        // if (Phaser.Input.Keyboard.JustDown(this.down)) {
        //     this.movePointer("d")
        // }  
        // ON SELECTING CHOICE
        // if (Phaser.Input.Keyboard.JustDown(this.space)) {
        //     this.box[this.selected].anims.stop()
        //     // IF CORRECT CHOICE MADE
        //     if (this.evaluated[this.selected] === this.correct) {
        //         this.victory = true
        //         this.winText.setVisible(true);
        //     } else {
        //         console.log("Less good job")
        //         this.loseText.setVisible(true);
        //     }
        //     // END GAME
        //     this.gameOver = true
        // }
      } else if (!this.sent) {
        eventsCenter.emit('stop_timer');
        eventsCenter.emit('game-end', this.victory);
        console.log("OH SHIT OOPS");
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
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.7, () => this.userInput("l"));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.7, () => this.userInput("r"));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.7, () => this.userInput("d"));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.7, () => this.userInput("u"));
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.userInput("select"); });
  }
  // START HELPER FUNCTIONS
  // takes a number between 0 and 999 and returns an array with each digit separated
  parseNumber(val) {
    // represents the number in the hundreds place
    let hun = Math.floor(val / 100);
    // represents the number in the tens place
    let ten = Math.floor((val - (hun * 100)) / 10);
    // represents the number in the ones place
    let one = val % 10;

    console.log("Hundreds: " + hun + "\nTens: " + ten + "\nOnes: " + one + "\nTotal: " + val);

    return [hun, ten, one];
  }
  // creates a graphic for each equation
  fillBox(i, x, y) {
    // changes number placement within box if needed
    let placement = 0;

    // add container to store equation number images
    this.equations[i] = this.add.container(x, y);
    // add a sprite for box frame
    this.box[i] = this.physics.add.sprite(x, y, 'TI_1frames');
    this.box[i].setScale(1, 0.5);

    // if we're dealing with an equation, print the second operand and operation first
    if (this.opcode[i] !== 0) {
      placement = -1084 / 1.75;
      // add an operator
      this.equations[i].add(this.add.image(0, 0, 'TI_1operations', (this.opcode[i]) - 1));
      // add a second operand

      this.addNumbers(this.equations[i], this.num2[i], 1084 / 3.5, i, 2);
    }

    // add first operand (or single number) to equations
    this.addNumbers(this.equations[i], this.num1[i], placement, i, 1);

    // adjust equation position relative to its size within the box
    if (this.opcode[i] !== 0) {
      let smallcheck = 0;
      if (this.num1[i] < 10) {
        this.equations[i].x -= 30;
        smallcheck++;
      }
      if (this.num2[i] < 10) {
        this.equations[i].x += 30;
        smallcheck++;
      }
      switch (smallcheck) {
        case 1:
          this.box[i].setScale(.8, .5);
          break;
        case 2:
          this.box[i].setScale(.6, .5);
          break;
        default:
          break;
      }
    } else {
      if (this.num1[i] < 100 && this.num1[i] > 9) {
        this.equations[i].x -= 30;
      }
      this.box[i].setScale(.6, .5);
    }
    // containers can be rescaled conveniently
    this.equations[i].setScale(.2);
  }
  // Helper function that takes numbers parsed in parseNumber and adds them as images to a container
  addNumbers(equation, val, offset, index, operand) {
    let nums = this.parseNumber(val);
    let addset = 300;
    // only add first digit if number is greater than 99
    if (val > 99) {
      equation.add(this.add.image(-300 + offset, 0, 'TI_1numbers', nums[0]));
    }
    // only add second digit if number is greater than 9
    if (val > 9) {
      equation.add(this.add.image(0 + offset, 0, 'TI_1numbers', nums[1]));
    }
    // don't offset digit if number is less than 10, AND is the second operand OR sole number
    if (val < 10 && (operand === 2 || this.opcode[index] === 0)) {
      addset = 0;
    }
    equation.add(this.add.image(addset + offset, 0, 'TI_1numbers', nums[2]));
  }
  // sets values of num1, num2, opcode and evaluated arrays for use in equations
  setNumbers() {
    for (let i = 0; i < 5; i++) {
      this.opcode[i] = Math.round(Math.random() * 4);
      // if opcode is 0, no operation is needed, just the raw number
      if (this.opcode[i] === 0) {
        this.num1[i] = Math.round(Math.random() * 999);
        this.num2[i] = 0;
        this.evaluated[i] = this.num1[i];
      }
      // all other opcodes result in equations
      else {
        this.rollNumbers(i);
        this.equateNumbers(this.opcode[i], i);
      }
    }

  }
  // records the result of generated equations in this.evaluated[]
  equateNumbers(opcode, index) {
    switch (opcode) {
      case 1: // subtraction
        this.evaluated[index] = this.num1[index] - this.num2[index];
        console.log(this.num1[index] + " - " + this.num2[index] + " = " + this.evaluated[index] + ", OPCODE: " + this.opcode[index]);
        break;
      case 2: // division
        this.evaluated[index] = this.num1[index] / this.num2[index];
        console.log(this.num1[index] + " / " + this.num2[index] + " = " + this.evaluated[index] + ", OPCODE: " + this.opcode[index]);
        break;
      case 3: // addition
        this.evaluated[index] = this.num1[index] + this.num2[index];
        console.log(this.num1[index] + " + " + this.num2[index] + " = " + this.evaluated[index] + ", OPCODE: " + this.opcode[index]);
        break;
      case 4: // multiplication
        this.evaluated[index] = this.num1[index] * this.num2[index];
        console.log(this.num1[index] + " * " + this.num2[index] + " = " + this.evaluated[index] + ", OPCODE: " + this.opcode[index]);
        break;
      default: // default is addition
        this.evaluated[index] = this.num1[index] + this.num2[index];
        console.log(this.num1[index] + " + " + this.num2[index] + " = " + this.evaluated[index] + ", OPCODE: " + this.opcode[index]);
        break;
    }
  }
  // randomly generates numbers for equations
  rollNumbers(index) {
    this.num1[index] = Math.round(Math.random() * 99);
    // range for num2 is 1-99 to avoid division by 0
    this.num2[index] = Math.round(Math.random() * 98) + 1;
  }
  // used for making new selections
  userInput(dir) {
    if (dir === "select") {
      this.box[this.selected].anims.stop();
      // IF CORRECT CHOICE MADE
      if (this.evaluated[this.selected] === this.correct) {
        this.victory = true;
        this.winText.setVisible(true);
      } else {
        this.wrongAnswer.play({
          volume: .1, 
        })
        console.log("Less good job");
        this.loseText.setVisible(true);
      }
      // END GAME
      this.gameOver = true;
    } else {
      // stop current animation 
      this.box[this.selected].anims.stop();
      this.highlightSound.play({
        volume:.1 ,
      })
      switch (this.selected) {
        // moving from top left
        case 0:
          if (dir === "r") {
            this.selected = 1;
          } else if (dir === "d") {
            this.selected = 2;
          }
          break;
        // moving from top right
        case 1:
          if (dir === "l") {
            this.selected = 0;
          } else if (dir === "d") {
            this.selected = 2;
          }
          break;
        // moving from center
        case 2:
          if (dir === "l") {
            this.selected = 3;
          } else if (dir === "r") {
            this.selected = 1;
          } else if (dir === "u") {
            this.selected = 0;
          } else if (dir === "d") {
            this.selected = 4;
          }
          break;
        // moving from bottom left
        case 3:
          if (dir === "r") {
            this.selected = 4;
          } else if (dir === "u") {
            this.selected = 2;
          }
          break;
        // moving from bottom right
        case 4:
          if (dir === "l") {
            this.selected = 3;
          } else if (dir === "u") {
            this.selected = 2;
          }
          break;
        default:
          break;
      }
    }

    // set pointer to newly selected position, then play box animation for new selection
    this.pointer.setPosition(
      this.box[this.selected].x,
      this.box[this.selected].y + 80
    );
    this.box[this.selected].anims.play("TI_1box");
  }
  makeSounds(){
    this.highlightSound = this.sound.add( 'TI_1hover');
    this.wrongAnswer = this.sound.add('TI_1badChoice');
  }
}
