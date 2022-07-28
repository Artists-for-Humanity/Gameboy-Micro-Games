import Phaser from "phaser";
const X = 440
const Y = 360
const W = 153
const H = 288
const FILL_LINE = 80

export default class DrinkPour extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "DrinkPour",
    });

    this.juice;
    this.juicemask;
    this.glass;
    this.fill_value = H;
    this.glass_group
    this.game_won = false
    this.pourScale = 0;
    this.gamestart = false;
    this.stopped = false;
    this.unpoured = true
    this.spillplay;

  }
  preload(){
    this.load.image('juice', new URL('./assets/drink pour/liquid.png', import.meta.url).href);
    // this.load.image('glass', new URL('./assets/drink pour/glass.png', import.meta.url).href);
    this.load.image('dottedline', new URL('./assets/drink pour/dotted.png', import.meta.url).href);
    this.load.image('pour', new URL('./assets/drink pour/pourtext.png', import.meta.url).href);
    this.load.image('background', new URL('./assets/drink pour/restaurantbg.png', import.meta.url).href);
    this.load.spritesheet('glass', new URL('./assets/drink pour/glass.png', import.meta.url).href,{
      frameWidth: 175,
      frameHeight: 311
    });
    this.load.spritesheet('spill', new URL('./assets/drink pour/lemonada.png', import.meta.url).href,{
      frameWidth: 185,
      frameHeight: 331
    });
    //load spritesheet for overflow
  }

  create(){
    //background
    this.add.image(540, 360, 'background')
    //create animation for overflow

    //add juice and glass
    this.juice = this.add.image(451, 366, 'juice');
    this.juice.setOrigin(0)
    this.glass = this.physics.add.sprite(X, Y, 'glass');
    this.glass.setOrigin(0)
    //add juice mask
    this.juicemask = this.make.graphics();
    this.juicemask.fillStyle(0xffffff);
    this.juicemask.beginPath();
    this.juicemask.fillRect(451, 366, 153, 288);
    //this.juicemask.fillRect(216, 319)
    const mask = this.juicemask.createGeometryMask();
    mask.setInvertAlpha(true);
    this.juice.setMask(mask);
    this.glass_group = this.add.container()
    this.glass_group.add(this.juice);
    this.glass_group.add(this.glass);
    //add dotted line
    this.dotted = this.add.image(525, 410, 'dottedline');

    //keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    //pour popup booleans
    this.timer = 1
    this.pour = this.add.image(540, Y, 'pour');
    this.pour.setScale(0);

    //lemonade spill anim
    this.anims.create({
      key: 'spill anim',
      frames: [{
        key: "spill",
        frame: 0
      },
      {
        key: "spill",
        frame: 1
      },    
      {
        key: "spill",
        frame: 2
      },    
      {
        key: "spill",
        frame: 3
      },
      {
        key: "spill",
        frame: 4
      },
      {
        key: "spill",
        frame: 5
      },
      {
        key: "spill",
        frame: 6
      },
      {
        key: "spill",
        frame: 7
      },
      {
        key: "spill",
        frame: 8
      },
      {
        key: "spill",
        frame: 9
      },
      {
        key: "spill",
        frame: 10
      },
      {
        key: "spill",
        frame: 11
      },
    ],
      frameRate: 10,
      repeat: 0
    });
  }

  update(){
    this.playPour();
    if(this.cursors.space.isDown && this.stopped == false){
      if(this.fill_value > 0 && this.gamestart){
        this.fill_value-=9
        this.maskdraw();
        this.unpoured = false
      }
    }

    if(this.cursors.space.isUp && this.fill_value <50 && this.fill_value >= 1) {
      this.gamestart = false;
      this.game_won = true;
    }

    if(!this.cursors.space.isDown && !this.unpoured){
          this.stopped = true
          console.log(this.game_won)
        }

    if(!this.unpoured && this.fill_value == 0) {
      this.gamestart = false;
      this.game_won = false;
      this.spillAnim();
      console.log("hello")
      console.log(this.game_won)
    }

    if(this.stopped){
      this.gamestart = false;
    }
    
  }

  

  maskdraw(){
    this.juicemask.clear()
    this.juicemask.fillRect(451, 366, 153, this.fill_value)
  }

  playPour(){
    if (this.pourScale <= 1) {
      this.gamestart = false;
      this.timer++;
      this.pourScale += 0.27 / this.timer;
      this.pour.setScale(this.pourScale);
      
    } else if (this.timer === 62) {
      this.pour.destroy();
      this.gamestart = true;
      this.timer = 0;
    }
  }

  spillAnim(){
    this.juice.setVisible(false);
    this.spillplay = this.glass.anims.play("spill anim", true);
  }

  spillOnce(){
    if (!this.spillplay) 
      this.spillAnim();
    }
  
}
