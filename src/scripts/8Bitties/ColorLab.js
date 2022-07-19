import WebFontFile from '../../scripts/WebFontFile'

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

    this.prompts = ['Mix Purple', 'Mix Orange', 'Mix Green'];
    this.promptText;

    this.cursors;
    this.arrow_placement;
    this.vial_placement;

    this.decreasing;

    this.left;
    this.right;

    this.enter;
    this.vialNotEmpty;
    this.tryOne;
    this.tryTwo;
    this.beakerColor;

    //gamestart is the period of time where you are told to mix. gamestart will change to another property once the player starts mixing.
    this.gamestart;

    // this.player = this.physics.add.sprite(480, 600, 'player');
  }
  preload() {
    this.load.addFile(new WebFontFile(this.load, 'Russo One'))

    this.load.image("empty beaker", new URL("../8Bitties/assets/colorlab/beakerempty.png",
      import.meta.url).href);
    // this.load.image("green beaker", new URL("../8Bitties/assets/colorlab/beakergreen.png",
    //   import.meta.url).href);
    // this.load.image("purple beaker", new URL("../8Bitties/assets/colorlab/beakerpurple.png",
    //   import.meta.url).href);
    // this.load.image("orange beaker", new URL("../8Bitties/assets/colorlab/beakerorange.png",
    //   import.meta.url).href);
    // this.load.image("empty vial", new URL("../8Bitties/assets/colorlab/emptyvial.png",
    //   import.meta.url).href);
    this.load.spritesheet("red vial", new URL("../8Bitties/assets/colorlab/redvialsprites.png",
      import.meta.url).href, {
      frameWidth: 270,
      frameHeight: 367
    });
    this.load.spritesheet("blue vial", new URL("../8Bitties/assets/colorlab/bluevialsprites.png",
      import.meta.url).href, {
      frameWidth: 270,
      frameHeight: 367
    });
    this.load.spritesheet("yellow vial", new URL("../8Bitties/assets/colorlab/yellowvialsprites.png",
      import.meta.url).href, {
      frameWidth: 270,
      frameHeight: 367
    });
    //beaker sprites
    this.load.spritesheet("red beaker", new URL("../8Bitties/assets/colorlab/beakerred.png",
      import.meta.url).href, {
      frameWidth: 463,
      frameHeight: 558
    });
    this.load.spritesheet("blue beaker", new URL("../8Bitties/assets/colorlab/beakerblue.png",
      import.meta.url).href, {
      frameWidth: 463,
      frameHeight: 558
    });
    this.load.spritesheet("yellow beaker", new URL("../8Bitties/assets/colorlab/beakeryellow.png",
      import.meta.url).href, {
      frameWidth: 463,
      frameHeight: 558
    });

    this.load.spritesheet("purple beaker", new URL("../8Bitties/assets/colorlab/beakerpurplefull.png",
      import.meta.url).href, {
      frameWidth: 463,
      frameHeight: 558
    });
    this.load.spritesheet("green beaker", new URL("../8Bitties/assets/colorlab/beakergreenfull.png",
      import.meta.url).href, {
      frameWidth: 463,
      frameHeight: 558
    });
    this.load.spritesheet("orange beaker", new URL("../8Bitties/assets/colorlab/beakerorangefull.png",
      import.meta.url).href, {
      frameWidth: 463,
      frameHeight: 558
    });
    this.load.spritesheet("empty vial", new URL("../8Bitties/assets/colorlab/emptyvial.png",
      import.meta.url).href, {
      frameWidth: 270,
      frameHeight: 368
    });

    this.load.image("red vial pour", new URL("../8Bitties/assets/colorlab/vialredpour.png",
      import.meta.url).href);
    this.load.image("background", new URL("../8Bitties/assets/colorlab/sciencelabbg.png",
      import.meta.url).href);
    this.load.image("arrow", new URL("../8Bitties/assets/colorlab/arrow.png",
      import.meta.url).href);
    this.load.image("prompt box", new URL("../8Bitties/assets/colorlab/textbox.png",
      import.meta.url).href);

  }

  create() {
    // this.setText();

    this.background = this.add.image(540, 360, "background");
    this.gamestart = true;

    this.mix = this.physics.add.sprite(490, 100, "prompt box").setScale(.75).setOrigin(.5);
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

    this.finalColor = this.prompts[Phaser.Math.Between(0, 2)]
    this.promptText = this.add.text(490, 100, this.finalColor, {
      fontFamily: 'Russo One',
      fontSize: '58px',
    }).setOrigin(.5);

      //red vial
    this.anims.create({
      key: "red vial anim",
      frames: [{
        key: "red vial",
        frame: 0
      },
      {
        key: "red vial",
        frame: 1
      },
      {
        key: "red vial",
        frame: 2
      },
      {
        key: "red vial",
        frame: 3
      },
      {
        key: "red vial",
        frame: 4
      },
      {
        key: "red vial",
        frame: 5
      },
      ],
      frameRate: 8,
      repeat: -1
    });
    //blue vial
    this.anims.create({
      key: "blue vial anim",
      frames: [{
        key: "blue vial",
        frame: 0
      },
      {
        key: "blue vial",
        frame: 1
      },
      {
        key: "blue vial",
        frame: 2
      },
      {
        key: "blue vial",
        frame: 3
      },
      {
        key: "blue vial",
        frame: 4
      },
      {
        key: "blue vial",
        frame: 5
      },
      ],
      frameRate: 8,
      repeat: -1
    });
    //yellow vial
    this.anims.create({
      key: "yellow vial anim",
      frames: [{
        key: "yellow vial",
        frame: 0
      },
      {
        key: "yellow vial",
        frame: 1
      },
      {
        key: "yellow vial",
        frame: 2
      },
      {
        key: "yellow vial",
        frame: 3
      },
      {
        key: "yellow vial",
        frame: 4
      },
      {
        key: "yellow vial",
        frame: 5
      },
      ],
      frameRate: 8,
      repeat: -1
    });
    //empty vial
    this.anims.create({
      key: 'emptyvial anim',
      frames: [{ 
        key: "empty vial",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });
    //red beaker
    this.anims.create({
      key: 'redbeaker anim',
      frames: [{ 
        key: "red beaker",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });
    //blue beaker
    this.anims.create({
      key: 'bluebeaker anim',
      frames: [{ 
        key: "blue beaker",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });
    //yellow beaker
    this.anims.create({
      key: 'yellowbeaker anim',
      frames: [{ 
        key: "yellow beaker",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });
    //purple beaker
    this.anims.create({
      key: 'purplebeaker anim',
      frames: [{ 
        key: "purple beaker",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });
    //green beaker
    this.anims.create({
      key: 'greenbeaker anim',
      frames: [{ 
        key: "green beaker",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });
    //orange beaker
    this.anims.create({
      key: 'orangebeaker anim',
      frames: [{ 
        key: "orange beaker",
        frame: 0
      }],
      frameRate: 10,
      repeat: -1
    });


    this.redVialHovered = false;
    this.yellowVialHovered = false;
    this.blueVialHovered = false;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.arrow_placement = 0;
    this.vial_placement = 0;
    this.timer = 1;

    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.enterPressed = false;
    this.vialNotEmpty = true;

    this.decreasing = false;
    this.hovered = false;

    this.tryOne = true;
    this.tryTwo = false;

    this.beakerColor = "";


    this.redVialNotEmpty = true;
    this.blueVialNotEmpty = true;
    this.yellowVialNotEmpty = true;


  }

  update() {

    // if (this.gamestart) {
    this.playAnims();
    // }

    //changes arrow y on a timer
    if (this.timer > 50) {
      this.decreasing = true
    }
    if (this.timer < 1) {
      this.decreasing = false
    }

    if (this.decreasing) {
      this.timer--
      this.arrow.y++
    } else {
      this.timer++
      this.arrow.y--
    }

    if (Phaser.Input.Keyboard.JustDown(this.left) && this.arrow_placement > 0) {
      this.arrow_placement--;
    } else if (Phaser.Input.Keyboard.JustDown(this.right) && this.arrow_placement < 2) {
      this.arrow_placement++;
    }



    var liftHeight = 613;
    var dropHeight = 680;
    switch (this.arrow_placement) {

      case 0:
        this.arrow.x = this.redVial.x
        this.redVialHovered = true;
        this.blueVialHovered = false;
        this.yellowVialHovered = false;
        this.enterPressed = Phaser.Input.Keyboard.JustDown(this.enter)
        this.vialPouring()
        this.time.delayedCall(0, this.setVialHeight, [liftHeight, dropHeight, this.redVialHovered, this.yellowVialHovered, this.blueVialHovered, this.redVial, this.yellowVial, this.blueVial], this);
        this.playAnims;
        this.enterPressed = false;
        return;
      case 1:
        this.arrow.x = this.blueVial.x
        this.redVialHovered = false;
        this.blueVialHovered = true;
        this.yellowVialHovered = false;
        this.enterPressed = Phaser.Input.Keyboard.JustDown(this.enter)

        this.vialPouring();
        this.time.delayedCall(0, this.setVialHeight, [liftHeight, dropHeight, this.blueVialHovered, this.redVialHovered, this.yellowVialHovered, this.blueVial, this.redVial, this.yellowVial], this);
        this.playAnims;
        this.enterPressed = false;
        return;
      case 2:
        this.arrow.x = this.yellowVial.x
        this.redVialHovered = false;
        this.blueVialHovered = false;
        this.yellowVialHovered = true;
        this.enterPressed = Phaser.Input.Keyboard.JustDown(this.enter)
        this.vialPouring();
        this.time.delayedCall(0, this.setVialHeight, [liftHeight, dropHeight, this.yellowVialHovered, this.redVialHovered, this.blueVialHovered, this.yellowVial, this.redVial, this.blueVial], this);
        this.playAnims;
        this.enterPressed = false;
        return;

      default:
        0;
    }

  }

  setVialHeight(liftHeight, dropHeight, vialHovered, vialNotHovered1, vialNotHovered2, vial1, vial2, vial3) {
    if (vialHovered) {
      vial1.setY(liftHeight)
      if (vialNotHovered1 === false) {
        vial2.setY(dropHeight);
      }
      if (vialNotHovered2 === false) {
        vial3.setY(dropHeight);
      }
    }
  }

  vialPouring() {
    // check if vialEmptied is false.
    // if not, get the current color of the hovered vial.
    // then, stop animation, empty current hovered vial.
    // set vialEmptied to true.
    // move the current color to the main jar.
    // check if color in jar is legal by calling a helper function checkWin().
    // 
    if (this.tryOne) {
      if (this.redVialHovered && this.enterPressed && this.redVialNotEmpty) {
        this.beaker.anims.play('redbeaker anim')
        this.beakerColor = 'red';
        this.redVialNotEmpty = false;
        this.redVial.anims.play('emptyvial anim', true)
        this.checkWin()
        this.tryOne = false;
        this.tryTwo = true;
      }
      if (this.blueVialHovered && this.enterPressed && this.blueVialNotEmpty) {
        this.beaker.anims.play('bluebeaker anim')
        this.beakerColor = 'blue';
        this.blueVialNotEmpty = false;
        this.blueVial.anims.play('emptyvial anim', true)
        this.checkWin()
        this.tryOne = false;
        this.tryTwo = true;
      }
      if (this.yellowVialHovered && this.enterPressed && this.yellowVialNotEmpty) {
        this.beaker.anims.play('yellowbeaker anim')
        this.beakerColor = 'yellow';
        this.yellowVialNotEmpty = false;
        this.yellowVial.anims.play('emptyvial anim', true)
        this.checkWin()
        this.tryOne = false;
        this.tryTwo = true;
      }
      

    }
    if (this.tryTwo) {
      if (this.redVialHovered && this.enterPressed && this.redVialNotEmpty) {
        this.beakerColor === "yellow" ? this.beaker.anims.play("orangebeaker anim") : this.beaker.anims.play("purplebeaker anim");
        this.redVialNotEmpty = false;
        this.beakerColor = "Mix Orange"
        this.redVial.anims.play('emptyvial anim')
        
        this.checkWin()
      }
      if (this.blueVialHovered && this.enterPressed && this.blueVialNotEmpty) {
        this.beakerColor === "red" ? this.beaker.anims.play("purplebeaker anim") : this.beaker.anims.play("greenbeaker anim");
        this.blueVialNotEmpty = false;
        this.beakerColor = "Mix Purple"
        this.blueVial.anims.play('emptyvial anim')
        this.checkWin()
      }
      if (this.yellowVialHovered && this.enterPressed && this.yellowVialNotEmpty) {
        this.beakerColor === "blue" ? this.beaker.anims.play("greenbeaker anim") : this.beaker.anims.play("orangebeaker anim");
        this.yellowVialNotEmpty = false;
        this.beakerColor = "Mix Green"
        this.yellowVial.anims.play('emptyvial anim')
        this.checkWin()
      }
    }

  }

  checkWin() {
    // check if user enter the color on the first try, and the second try
    if (this.tryOne) {
      if (this.beakerColor === 'red' && this.finalColor === 'Mix Green') {
        console.log('You lost!')
        this.youWin = false;
        // you lost
      }
      if (this.beakerColor === 'blue' && this.finalColor === 'Mix Orange') {
        console.log('You lost!')
        
      }
        
      if (this.beakerColor === 'yellow' && this.finalColor === 'Mix Purple') {
        console.log('You lost!')
        
      }
    }
    
    if (this.tryTwo && this.beakerColor != this.finalColor) {
      console.log('Beaker second try:', this.beakerColor, 'final color:', this.finalColor)
      console.log('You lost!')
      
      // you lost
    }
    return false;
  }

  playAnims() {
    if (this.redVialNotEmpty) this.redVial.anims.play("red vial anim", true);
    if (this.blueVialNotEmpty) this.blueVial.anims.play("blue vial anim", true);
    if (this.yellowVialNotEmpty) this.yellowVial.anims.play("yellow vial anim", true);
  }
}

// youLose(){
  
// }

// youWin(){

// }

