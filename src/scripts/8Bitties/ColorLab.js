export default class ColorLab extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: "ColorLab",
    });
    this.gamestart = false;
    // Game Object Declaration
    this.timer;
    this.catchScale = 0;
    this.mix;
    this.background;
    this.redVial;
    this.blueVial;
    this.yellowVial;
    this.beaker;
    this.arrow;
    this.cursors;
    this.arrow_placement;

    this.decreasing;

    this.left
    this.right

    // this.player = this.physics.add.sprite(480, 600, 'player');
  }
  preload() {
    this.load.image("empty beaker", new URL("../8Bitties/assets/beakerempty.png", import.meta.url).href);
    this.load.image("green beaker", new URL("../8Bitties/assets/beakergreen.png", import.meta.url).href);
    this.load.image("purple beaker", new URL("../8Bitties/assets/beakerpurple.png", import.meta.url).href);
    this.load.image("orange beaker", new URL("../8Bitties/assets/beakerorange.png", import.meta.url).href);
    this.load.image("empty vial", new URL("../8Bitties/assets/emptyvial.png", import.meta.url).href);
    this.load.image("red vial", new URL("../8Bitties/assets/vialred.png", import.meta.url).href);
    this.load.image("blue vial", new URL("../8Bitties/assets/vialblue.png", import.meta.url).href);
    this.load.image("yellow vial", new URL("../8Bitties/assets/vialyellow.png", import.meta.url).href);
    this.load.image("background", new URL("../8Bitties/assets/sciencelabbg.png", import.meta.url).href);
    this.load.image("arrow", new URL("../8Bitties/assets/arrow.png", import.meta.url).href);
  }

  create() {
    // this.setText();
    this.background = this.add.image(490, 360, "background"); 
    
  

    this.redVial = this.physics.add.sprite(653, 680, "red vial").setScale(.45).setOrigin(1);
    this.blueVial = this.physics.add.sprite(790, 680, "blue vial").setScale(.45).setOrigin(1);
    this.yellowVial = this.physics.add.sprite(927, 680, "yellow vial").setScale(.45).setOrigin(1);
    this.beaker = this.physics.add.sprite(400, 680, "empty beaker").setScale(.8).setOrigin(1);
    this.arrow = this.physics.add.sprite(653, 480, "arrow").setScale(.5).setOrigin(1);

    this.redVial.body.setAllowGravity(false);
    this.blueVial.body.setAllowGravity(false);
    this.yellowVial.body.setAllowGravity(false);
    this.beaker.body.setAllowGravity(false);
    this.arrow.body.setAllowGravity(false);

    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.arrow_placement = 0;
    // this.mix = this.add.image(490, 360, "mix");
    this.timer = 1;

    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    this.decreasing = false;


  }

  update() {
  
    if(this.timer > 50){
      this.decreasing = true
    }
    if(this.timer < 1){
      this.decreasing = false
    }
     
    if(this.decreasing){
      this.timer--
      this.arrow.y++
    }
    else{
      this.timer++
      this.arrow.y--
    }

      if(Phaser.Input.Keyboard.JustDown(this.left) && this.arrow_placement > 0){
        this.arrow_placement--;
      }
      else if(Phaser.Input.Keyboard.JustDown(this.right) && this.arrow_placement < 2) {
        this.arrow_placement++;
      }
    


    switch(this.arrow_placement){
      case 0: 
        this.arrow.x = this.redVial.x
        return;
      case 1:
        this.arrow.x = this.blueVial.x
        return;
      case 2:
        this.arrow.x = this.yellowVial.x
        return;

      default: return;
    }
  }
  gameStart() {
    this.grass = this.add.image(490, 360, "grass");
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
  


}