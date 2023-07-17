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
    this.gameOver= false;
    this.started = false;
    this.victory = false;
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
    this.catWord;
    console.log("constructor end");
  }
  preload() {
   console.log("preload start");
   this.load.image("background", new URL('YipeeAssets/sky.png ', import.meta.url).href);
   this.load.image("cat", new URL('YipeeAssets/orangeCat.png', import.meta.url).href); 
   this.load.spritesheet("up", new URL('YipeeAssets/upLimb.png', import.meta.url).href,{ frameWidth:169, frameHeight:42 });
   this.load.spritesheet("right", new URL('YipeeAssets/rightLimb.png', import.meta.url).href,{ frameWidth:42, frameHeight:169});
   this.load.spritesheet("center", new URL('YipeeAssets/centerLimb.png', import.meta.url).href,{ frameWidth:159, frameHeight:41});
   this.load.image("catEmpty", new URL('YipeeAssets/c-t.png', import.meta.url).href); 
   this.load.image("catFull", new URL('YipeeAssets/cat.png', import.meta.url).href); 
   this.load.image("fillBlank", new URL('YipeeAssets/fillTheBlank.png', import.meta.url).href); 
   console.log("preload end");
  }

  create() {
    console.log("create start");
    this.started= true;
    this.add.image(540, 360, "background");
    this.add.image(w/5,l-30-295/2, "cat");
    console.log(l-30-295/2);
    this.add.image(w/2,l/10,"fillBlank");
    this.catWord = this.physics.add.sprite(w/2, l/3,"catEmpty");
    this.createKeys();
    this.initArr();
    console.log("create end");
  }
  update() {
    console.log("update start");
    if(this.started){
    this.buttonHandlers.update();
    this.updateColor();
    if (!this.gamePad) this.startGamePad();
    if(this.gameOver && !this.sent){
      this.globalState.timerMessage('stop_timer')
      this.globalState.sendMessage(this.victory)
      this.sent = true;
    }
  }
  }
  initArr(){
    this.arr =[["","",""], ["","",""], ["","",""], ["","",""], ["","",""] ];
    for(let i=0; i<5;i++){
      for (let j=0; j<3;j++){
        //stat sel nosel
        let b = this.arr[i][j];
        if (i%2===0&&j===1){//h
          switch(i){
            case 0:
              this.arr[i][j] = {};
              this.arr[i][j].limb = this.physics.add.sprite(w-120-679/8,l-60-21-169*2, "up", 0);
              this.arr[i][j].isHovering = "n";
              this.arr[i][j].stat = "nosel";
              break;
            case 2:
              this.arr[i][j] = {};      
              this.arr[i][j].limb = this.physics.add.sprite(w-120-679/8,l-60-21-169, "center", 0);
              this.arr[i][j].isHovering = "n";
              this.arr[i][j].stat = "nosel";
              break;
            case 4:
              this.arr[i][j] = {};
              this.arr[i][j].limb= this.physics.add.sprite(w-120-679/8,l-60-21, "up", 0);
              this.arr[i][j].limb.flipY = true;
              this.arr[i][j].isHovering = "n";
              this.arr[i][j].stat = "nosel";
              break; 
          }
        }
        else if (i%2===1&&j%2===0){
          switch(j){
            case 0:
              if (i===1){
                this.arr[i][j] = {};
                this.arr[i][j].limb = this.physics.add.sprite(w-120-679/4, l-60-21-169*2+169/2, "right", 0);
                this.arr[i][j].limb.flipX = true;
                this.arr[i][j].isHovering = "n";
                this.arr[i][j].stat = "nosel";
              } else{
                this.arr[i][j] = {};
                this.arr[i][j].limb = this.physics.add.sprite(w-120-679/4, l-60-21-169/2, "right", 0);
                this.arr[i][j].limb.flipX = true;
                this.arr[i][j].isHovering = "n";
                this.arr[i][j].stat = "nosel";
              }
              break;
            case 2:
              if (i===1){
                this.arr[i][j] = {};
                this.arr[i][j].limb = this.physics.add.sprite(w-120,l-60-21-169*2+169/2, "right", 0);
                this.arr[i][j].isHovering = "n";
                this.arr[i][j].stat = "nosel";
              } else {
                this.arr[i][j] = {};
                this.arr[i][j].limb = this.physics.add.sprite(w-120,l-60-21-169/2, "right", 0);
                this.arr[i][j].isHovering = "n";
                this.arr[i][j].stat = "nosel";
              }
              break;
          }
        }
      }
    }
  }
  createKeys(){
    //inputs
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.select = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
 keyInputs(){
  if (Phaser.Input.Keyboard.JustDown(this.up)) this.updateSelection(1);
  if (Phaser.Input.Keyboard.JustDown(this.down)) this.updateSelection(2);
  if (Phaser.Input.Keyboard.JustDown(this.left)) this.updateSelection(3);
  if (Phaser.Input.Keyboard.JustDown(this.right)) this.updateSelection(4);
  if (Phaser.Input.Keyboard.JustDown(this.select)) this.click(this.cursor.r, this.cursor.c);
  }

  winUpdate(){
    if( this.arr[0][1].stat ==="sel"&&this.arr[1][0].stat ==="sel"
    &&this.arr[1][2].stat ==="sel"&&this.arr[2][1].stat ==="sel"
    &&this.arr[3][0].stat ==="sel"&&this.arr[3][2].stat ==="sel"
    &&this.arr[4][1].stat ==="nosel"){
      this.catWord.setFrame("catFull");
      this.gameOver = true;
      this.victory = true;
    }
  }
  //inputs- 1-4 are movement
 updateInput(i) {
  let rLim = this.arr.length-1;
  let cLim = this.arr[0].length-1;
  if (this.arr[this.cursor.r][this.cursor.c].stat!=undefined){
    this.arr[this.cursor.r][this.cursor.c].isHovering = "n";
  }
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
        // if ((this.cursor.r===1&&this.cursor.c===1)||
        //   (this.cursor.r===3&&this.cursor.c===1)||
        //   (this.cursor.r===2&&this.cursor.c===0)||
        //   (this.cursor.r===2&&this.cursor.c===2)){
        //   this.cursor.r+=1;
        // }
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
    console.log("row: " + this.cursor.r +"\ncolumn: " + this.cursor.c);
    if (this.arr[this.cursor.r][this.cursor.c].stat!=undefined){
      this.arr[this.cursor.r][this.cursor.c].isHovering = "y";
      console.log(this.arr[this.cursor.r][this.cursor.c]);
     }else{
      console.log(this.arr[this.cursor.r][this.cursor.c]);
    }
    this.winUpdate();
  }
  click(row,col){
    console.log("clicky click ehhehehehe...");
    if (this.arr[row][col].stat!=undefined){
      if (this.arr[row][col].stat==="nosel"){
        this.arr[row][col].stat="sel";
      }else{
        this.arr[row][col].stat="nosel";
      }
    }
    console.log("sel or nosel: " + this.arr[row][col].stat);
    this.winUpdate();
  }
  updateColor(){
    for (let i= 0; i<this.arr.length; i++){
      for (let j=0; j<this.arr[0].length;j++){
        let box = this.arr[i][j]
        if (box.stat!=undefined){
          if (box.stat==="nosel"&&box.isHovering==="n"){
            box.limb.setFrame(0);
          } else if(box.stat==="nosel"&&box.isHovering==="y"){
            box.limb.setFrame(1);
          } else if(box.stat==="sel"&&box.isHovering==="n"){
            box.limb.setFrame(2);
          } else {
            box.limb.setFrame(3);
          }
        }
      }
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
  // makeAnims() {
  //   console.log('reachme 00');
  // }
}
// :)