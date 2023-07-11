import Phaser from "phaser";
import ButtonPressHandlers from '../ButtonPressHandlers';
import eventsCenter from "../EventsCenter";

let l = 720;
let w = 1080;

export default class Yipee extends Phaser.Scene {
  constructor() {
    console.log("constructor start");
    super(
      {
        active: false,
        visible: false,
        key: "Yipee",
      }
    );
    this.started = false;
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
    this.arr;
    this.cursor = {
      r: 0,
      c: 0,
    };
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
    this.started= true;
    this.add.image(540, 360, "background");
    this.createKeys();
    this.initArr();
    this.disArray();
    // this.boundary = this.physics.add.sprite(1080-270, 720-180, "box" );
    // this.makeAnims();
    // this.boundary.setVisible = true;
    console.log("create end");
  }
  update() {
    //if(this.started){
    this.buttonHandlers.update();
    if (!this.gamePad) this.startGamePad();
    if(this.gameOver && !this.sent){
      this.globalState.timerMessage('stop_timer')
      this.globalState.sendMessage(this.victory)
      this.sent = true
    }
    //add ? : for the hover highlight thingy
    this.buttonHandlers.update();
    //}
  }
  initArr(){
    this.arr =[["","",""], ["","",""], ["","",""], ["","",""], ["","",""] ];
    for(let i=0; i<5;i++){
      for (let j=0; j<3;j++){
        //status--> 2= on, 1=hover, 0= off,
        if (i%2===0&&j%2===1){//h
          this.arr[i][j]= {
            status: 0,
            orien: "h",
            box: this.add.rectangle(w/2, l/2, 100, 50, 0xcdb4db) ,
            outline: this.add.rectangle(w/2, l/2, 100, 50, 0xa2d2ff, false)
          }
        }
        else if (i%2===1&&j%2===0){
          this.arr[i][j]= {
          status: 0,
          orien: "v",
          box: this.add.rectangle(w/2,l/2, 50, 100, 0xcdb4db) ,
          outline: this.add.rectangle(w/2, l/2, 50, 100, 0xa2d2ff, false)
          }
        }
      }
    }
  }
  
  disArray(){
    let shortLen = 50;
    let longLen = 100;
    let origin = {
      x: w*(2.4/3),
      y: l*(1.5/3)
    }
    let location = {
      x: origin.x,
      y: origin.y
    }
    location.x+=shortLen+longLen/2;
    location.y+=shortLen/2;
    this.arr[0][1].box.x=location.x;
    this.arr[0][1].box.y=location.y;
    for (let i = 1; i<5;i+=2){
      let col = 0;
      location.y+= shortLen/2+longLen/2;
      location.x-= longLen/2+shortLen/2;
      this.arr[i][col].box.x= location.x;
      this.arr[i][col].box.y= location.y;
      location.x+=shortLen/2+longLen+shortLen/2;
      col+=2;
      this.arr[i][col].box.x= location.x
      this.arr[i][col].box.y= location.y;
      location.x -=shortLen/2+longLen/2;
      location.y+=longLen/2+shortLen/2;
      col-=1;
      this.arr[i+1][col].box.x= location.x;
      this.arr[i+1][col].box.y= location.y;
    }
  }
  createKeys(){
    //inputs
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.select = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //for the selection the little analog limbs will change outline to indicate highlight and selection will change fill color

  }

 keyInputs(){
  if (Phaser.Input.Keyboard.JustDown(this.up)) this.updateSelection(1);
  if (Phaser.Input.Keyboard.JustDown(this.down)) this.updateSelection(2);
  if (Phaser.Input.Keyboard.JustDown(this.left)) this.updateSelection(3);
  if (Phaser.Input.Keyboard.JustDown(this.right)) this.updateSelection(4);
  if (Phaser.Input.Keyboard.JustDown(this.select)) this.click(this.cursor.r, this.cursor.c);
  }
  //inputs- 1-4 are movement
 updateInput(i) {
  let rLim = this.arr.length-1;
  let cLim = this.arr[0].length-1;
    switch(i){
      case 1:
        if (this.cursor.r===0){
          this.cursor.r =rLim;
        }else{
          this.cursor.r-=1;
        }
        console.log("up");
        break;
      case 2:
        if (this.cursor.r===rLim){
          this.cursor.r =0;
        }else{
          this.cursor.r+=1;
        }
        if ((this.cursor.r===1&&this.cursor.c===1)||
          (this.cursor.r===3&&this.cursor.c===1)||
          (this.cursor.r===2&&this.cursor.c===0)||
          (this.cursor.r===2&&this.cursor.c===2)){
          this.cursor.r+=1;
        }
        console.log("down");
        break;
      case 3:
        if (this.cursor.c===0){
          this.cursor.c =cLim;
        }else{
          this.cursor.c-=1;
        }
        if((this.cursor.r===1&&this.cursor.c===1)||
        (this.cursor.r===3&&this.cursor.c===1)){
          this.cursor.c-=1;
        }
        console.log("left");
        break;
      case 4:
        if (this.cursor.c===cLim){
          this.cursor.c =0;
        }else{
          this.cursor.c+=1;
        }
        if((this.cursor.r===1&&this.cursor.c===1)||
        (this.cursor.r===3&&this.cursor.c===1)){
          this.cursor.c+=1;
        }
        console.log("right");
        break;
    }
    console.log("row: " + this.cursor.r );
    console.log("column: " + this.cursor.c);
  }

  click(row,col){
    console.log("clicky click ehhehehehe...");
    if (this.arr[row][col]!=null){
      this.arr[row][col].status = 2;
    }else{
      this.arr[row][col].status = 0;
    }
  }

  startGamePad(){
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y===-1, 
      () => this.updateInput(1));
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.y===1,
      () => this.updateInput(2));
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x===-1, 
      () => this.updateInput(3));
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x===1, 
      () => this.updateInput(4));
    this.buttonHandlers.addPad(
      () => this.gamePad.buttons[0].pressed, 
      () => this.click(this.cursor.r, this.cursor.c));
  }
  makeAnims() {
    console.log('reachme 00');
  }
  // trapezoid (num){
  //   var faceDown = [
  //     new Phaser.Math.Vector2(25,50),   // Top-left point
  //     new Phaser.Math.Vector2(75,50),   // Top-right point
  //     new Phaser.Math.Vector2(100,0),   // Bottom-right point
  //     new Phaser.Math.Vector2(0,0)    // Bottom-left point
  // ];
  // }
}