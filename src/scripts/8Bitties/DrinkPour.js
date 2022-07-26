import Phaser from "phaser";
const X = 440
const Y = 720/2
const W = 216
const H = 319
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

  }
  preload(){
    this.load.image('juice', new URL('./assets/drink pour/liquid.png', import.meta.url).href)
    this.load.image('glass', new URL('./assets/drink pour/glass.png', import.meta.url).href)
  }

  create(){
    //add juice and glass
    this.juice = this.add.image(X, Y, 'juice');
    this.juice.setOrigin(0)
    this.glass = this.add.image(X, Y, 'glass')
    this.glass.setOrigin(0).setDepth(1);
    //add juice mask
    this.juicemask = this.make.graphics();
    this.juicemask.fillStyle(0xffffff);
    this.juicemask.beginPath();
    this.juicemask.fillRect(X, Y, W, H)
    //this.juicemask.fillRect(216, 319)
    const mask = this.juicemask.createGeometryMask();
    mask.setInvertAlpha(true)
    this.juice.setMask(mask);
    this.glass_group = this.add.container()
    this.glass_group.add(this.juice)
    this.glass_group.add(this.glass)
    //keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(){
    if(this.cursors.space.isDown){
      if(this.fill_value > 0){
        this.fill_value-=8
        this.maskdraw();
      }
    }
    if(this.fill_value < 80 && this.fill_value >= 0){
      this.game_won = true
      console.log(this.game_won)
    }

    else{
      this.game_won = false
      console.log(this.game_won)
      // overflow
    }

    
  }


  maskdraw(){
    this.juicemask.clear()
    this.juicemask.fillRect(X, Y, W, this.fill_value)
  }
  //play "pour" animation popup

  //space bar functionality

  //when space is pressed, the mask will become smaller

  //set certain y value of mask to run win function
  //play win popup

  //set above certain y value of mask to run lose function
  //play lose popup

  //win function

  //lose function
}
