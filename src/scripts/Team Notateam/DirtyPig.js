import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';
import phaserJuice from '../phaserJuice.js';
export default class DirtyPig extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "DirtyPig",
    });

    // Game Object Declarations
    this.triesToWin = 4;
    this.pig;
    this.startScreen;
    this.timedEvent;
    this.playerScore = 0;
    this.timer = 0;
    this.victory = false;
    this.gameOver = false;
    // this.sent = false;
    this.started = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }

  preload() {
    this.load.image(
      "grass-fense-background",
      new URL('./assets/DirtyPigAssets/grass-fense-background.png', import.meta.url).href
    );
    
    // this.load.image( 
    //   "Dirty Pig Run",
    // new URL("./assets/DirtyPigAssets/Dirty Pig Run.png", import.meta.url).href
    // );
  
   
   
    

    this.load.image(
      "Mud",
      new URL("./assets/DirtyPigAssets/Mud.png", import.meta.url).href
    );

    this.load.image(
      "Pig's Food",
      new URL("./assets/DirtyPigAssets/Pig's Food.png", import.meta.url).href
    );

    this.load.image(
      "Cleaner",
      new URL("./assets/DirtyPigAssets/Cleaner.png", import.meta.url).href
    );

    this.load.spritesheet('Pig', new URL("./assets/DirtyPigAssets/DirtyPigRun.png", import.meta.url).href, { frameWidth: 340, frameHeight: 256 });
   
  }

  create() {
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "grass-fense-background"
    );

    this.pig = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "Pig"
    ).setScale(.5);

    this.add.image(1000, 500, "Mud").setScale(2);

    this.add.image(940, 150, "Pig's Food");
    
    this.add.image(
    this.game.config.width /2, 
    this.game.config.height / 2,
     "Cleaner"
    ).setScale(.3);
   
    //set pig movement to the left
    // this.pig.body.setVelocityX(-0);

    this.flightPattern = Math.floor(1)

    
    

    

    // this.gameOverScreen = this.add.image(
    //   this.game.config.width / 2,
    //   this.game.config.height / 2,
    //   "DO3_gameOverScreen"
    // );

    // this.gameOverScreen.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.timedEvent = this.time.delayedCall(1000, this.onEvent, [], this);

    eventsCenter.on('start_game', () => { this.started = true; this.globalState.timerMessage('start_timer'); });

    this.juice = new phaserJuice(this);

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('Pig', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
  });
  }


  update() {
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();

      // this.time.delayedCall(10, this.dropTrash, [], this);
    }

    if (this.gameOver && !this.sent) {
      eventsCenter.emit("stop_timer");
      eventsCenter.emit("game-end", this.victory);
      this.sent = true;
    }

  
    if(this.triesToWin === 4){
      this.timer += -0.04;
      this.pig.x = Math.sin(this.timer) * 200 + 500;
      this.pig.y = Math.cos(this.timer) *  150 + 360;
    }

    this.pig.rotation += .04;
    this.pig.anims.play('run', true);
 
    
  }
  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    // this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.moveTrash(-1));
    // this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.moveTrash(1));
    // this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.moveTrash(0));
  }

  gamestart() {
    this.pig.body
    this.flightPattern = Math.floor(Math.random() * 2);
    this.pig.body.setCircle(32).setOffset(32, 32);
    this.gamestart = true;
  }
 
  pigmovement() {
    if(this.triesToWin === 4){
      this.timer += .1;
      this.pig.x = Math.sin(this.timer) * 320 + 540;
      this.pig.y = Math.cos(this.timer) *  150 + 360;
    }
  }



  

 
}
