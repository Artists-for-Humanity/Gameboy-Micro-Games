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
    this.cursor;
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
    // this.boundary = this.physics.add.sprite(1080-270, 720-180, "box" );
    this.buttonHandlers = new ButtonPressHandlers();    
    // this.makeAnims();
    
    this.boundary.setVisible = true;
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
  
  // makeAnims() {
  //   console.log('reachme 00');
  // }
  

}
