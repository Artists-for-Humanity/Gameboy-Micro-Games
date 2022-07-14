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
    this.redVialHovered;
    this.yellowVialHovered;
    this.blueVialHovered;

    this.cursors;
    this.arrow_placement;
    this.vial_placement;

    this.decreasing;

    this.left;
    this.right;

    // this.player = this.physics.add.sprite(480, 600, 'player');
  }
  preload() {
    this.load.image("empty beaker", new URL("../8Bitties/assets/colorlab/beakerempty.png", import.meta.url).href);
    this.load.image("green beaker", new URL("../8Bitties/assets/colorlab/beakergreen.png", import.meta.url).href);
    this.load.image("purple beaker", new URL("../8Bitties/assets/colorlab/beakerpurple.png", import.meta.url).href);
    this.load.image("orange beaker", new URL("../8Bitties/assets/colorlab/beakerorange.png", import.meta.url).href);
    this.load.image("empty vial", new URL("../8Bitties/assets/colorlab/emptyvial.png", import.meta.url).href);
    this.load.image("red vial", new URL("../8Bitties/assets/colorlab/vialred.png", import.meta.url).href);
    this.load.image("blue vial", new URL("../8Bitties/assets/colorlab/vialblue.png", import.meta.url).href);
    this.load.image("yellow vial", new URL("../8Bitties/assets/colorlab/vialyellow.png", import.meta.url).href);
    this.load.image("background", new URL("../8Bitties/assets/colorlab/sciencelabbg.png", import.meta.url).href);
    this.load.image("arrow", new URL("../8Bitties/assets/colorlab/arrow.png", import.meta.url).href);
    this.load.image("mix", new URL("../8Bitties/assets/colorlab/textbox.png", import.meta.url).href);
  }

  create() {
    // this.setText();
    this.background = this.add.image(490, 360, "background"); 
    
    this.mix = this.physics.add.sprite(490, 100, "mix").setScale(.75).setOrigin(.5);
    this.redVial = this.physics.add.sprite(653, 680, "red vial").setScale(.45).setOrigin(1);
    this.blueVial = this.physics.add.sprite(790, 680, "blue vial").setScale(.45).setOrigin(1);
    this.yellowVial = this.physics.add.sprite(927, 680, "yellow vial").setScale(.45).setOrigin(1);
    this.beaker = this.physics.add.sprite(400, 680, "empty beaker").setScale(.8).setOrigin(1);
    this.arrow = this.physics.add.sprite(653, 430, "arrow").setScale(.5).setOrigin(1);

    this.redVial.body.setAllowGravity(false);
    this.blueVial.body.setAllowGravity(false);
    this.yellowVial.body.setAllowGravity(false);
    this.beaker.body.setAllowGravity(false);
    this.arrow.body.setAllowGravity(false);
    this.mix.body.setAllowGravity(false);

    
    this.redVialHovered = false;
    this.yellowVialHovered = false;
    this.blueVialHovered = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.arrow_placement = 0;
    this.vial_placement = 0;
    this.timer = 1;

    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    this.decreasing = false;
    this.hovered = false;
    
  
    
  }

  update() {

    

  //changes arrow y on a timer
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
      
    
      
      var liftHeight = 613;
      var dropHeight = 680;
      switch(this.arrow_placement) {
        
        case 0: 
          this.arrow.x = this.redVial.x
          this.redVialHovered = true;
          this.blueVialHovered = false;
          this.yellowVialHovered = false;
          this.time.delayedCall(0, this.setVialHeight, [liftHeight, dropHeight, this.redVialHovered, this.yellowVialHovered, this.blueVialHovered, this.redVial, this.yellowVial, this.blueVial], this);
          return;
        case 1:
          this.arrow.x = this.blueVial.x
          this.redVialHovered = false;
          this.blueVialHovered = true;
          this.yellowVialHovered = false;
          this.time.delayedCall(0, this.setVialHeight, [liftHeight, dropHeight, this.blueVialHovered, this.redVialHovered, this.yellowVialHovered, this.blueVial, this.redVial, this.yellowVial], this);
          return;
        case 2:
          this.arrow.x = this.yellowVial.x
          this.redVialHovered = false;
          this.blueVialHovered = false;
          this.yellowVialHovered = true;
          this.time.delayedCall(0, this.setVialHeight, [liftHeight, dropHeight, this.yellowVialHovered, this.redVialHovered, this.blueVialHovered, this.yellowVial, this.redVial, this.blueVial], this);
          return;

        default: 0;
      }
     
      console.log(this.arrow_placement);
    

  }
   
  setVialHeight(liftHeight, dropHeight, vialHovered, vialNotHovered1, vialNotHovered2, vial1, vial2, vial3) {



    if (vialHovered) {
      console.log("red")
      vial1.setY(liftHeight)
      if (vialNotHovered1 === false) {
        vial2.setY(dropHeight);
      }
      if (vialNotHovered2 === false) {
        vial3.setY(dropHeight);
      }
    }

    // if (this.yellowVialHovered) {
    //   this.yellowVial.setY(liftHeight)
    //   if (this.redVialHovered === false) {
    //     this.redVial.setY(dropHeight);
    //   }
    //   if (this.blueVialHovered === false) {
    //     this.blueVial.setY(dropHeight);
    //   }
    // }

    // if (this.blueVialHovered) {
    //   this.blueVial.setY(liftHeight)
    //   if (this.redVialHovered === false) {
    //     this.redVial.setY(dropHeight);
    //   }
    //   if (this.yellowVialHovered === false) {
    //     this.yellowVial.setY(dropHeight);
    //   }
    // }
  }
}

  
  // vialLift(
    

  // )
  
//check arrow x position
//check vial x position
//check if theya re equal
//if equal, move vial y up 20 pixels
//if they are not equal, move vial back down (return) to original y value



// console.log(redVial)