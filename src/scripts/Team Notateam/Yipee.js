import Phaser from "phaser";
import ButtonPressHandlers from '../ButtonPressHandlers';
import eventsCenter from "../EventsCenter";

export default class Yipee extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "Yipee",
    });
  }
  preload() {
   
  }
  create() {
    this.makeAnims();
   
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
  
  makeAnims() {
    console.log('reachme 00');
  }
  

}
