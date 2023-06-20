import Phaser from "phaser";
import ButtonPressHandlers from '../ButtonPressHandlers';
import eventsCenter from "../EventsCenter";

export default class Yipee extends Phaser.Scene {
  constructor() {
    console.log("constructor start");
    super({
      active: false,
      visible: false,
      key: "Yipee",
    });
    this.started = false;
    // this.boundary;
    // this.cursor;

    //inputs
    //i wrote down a bunch of stuff for input- so im going to make an array for the little analog limbs so the navigation is easier. the even numbers are the ones that are the buttons, the rest are not visible
    //each analog limb is going to have some variables within to indicate whether they are highlighted, selected, or neither
    //gotta figure out how to set up the analog limbs but that's another story i can figure out later
    //what i set up so far was the input keys for the controller but i haven't gotten to testing them yet.
    //6/21  make the analog limbs and set them up and test the input
    //by set them up i mean make their variables- maybe a class? java does it so why not lol
    //wow maybe this is easier than i thought- since its a 2d array i can make them vert/horiz based on even or odd row #. selection will be wayyyy more easy than i thought it'd be 
    this.left;
    this.right;
    this.up;
    this.down;
    this.select;
    // this.curRow;
    // this.curCol;
    this.buttonHandlers = new ButtonPressHandlers();


    console.log("constructor end");
  }
  preload() {
   console.log("preload start");
   this.load.image("background", new URL('../Team Notateam/YipeeAssets/Ybg.png', import.meta.url).href);
   this.load.image("box", new URL('../Team Notateam/YipeeAssets/box.png', import.meta.url).href);
  console.log("preload end");
  }
  create() {
    console.log("create start");
    this.add.image(540, 360, "background");
    this.createKeys();


    // this.boundary = this.physics.add.sprite(1080-270, 720-180, "box" );
    // this.makeAnims();
    // this.boundary.setVisible = true;




    console.log("create end");
  }
  update() {
    if(this.started){
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      if(this.gameOver && !this.sent){
        this.globalState.timerMessage('stop_timer')
        this.globalState.sendMessage(this.victory)
        this.sent = true
      }
    }
    
  }

  // input(i){


  // }

  createKeys(){
    //inputs
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.select = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    //for the selection the little analog limbs will change outline to indicate highlight and selection will change fill color

  }

//  keyInputs(){
// if()


//   }
//inputs- 1-4 are movement, 5 is selection
//  updateInput(i){
// switch(i){
//   case 1:

//     break;
//   case 2:

//     break;
//   case 3:

//     break;
//   case 4:
    
//     break;
//   case 5:

//     break;
// }

// }
  startGamePad() {
      if (this.input.gamepad.total) {
          this.gamePad = this.input.gamepad.pad1;
          this.initGamePad();
          console.log(this.gamePad);
      }
    }

  initGamePad() {
      this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => {if (this.biteCount < 6) this.chewing()});
  }
  
  makeAnims() {
    console.log('reachme 00');
  }
  

}
