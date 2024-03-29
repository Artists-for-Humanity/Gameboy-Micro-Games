import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
import ButtonPressHandlers from '../ButtonPressHandlers';

export default class FlySwat extends Phaser.Scene {
  constructor() {
    super({
      active: false,
      visible: false,
      key: "FlySwat",
    });
    this.swatter;
    this.fly;
    this.swatdown = false;
    this.deadFly;
    this.swatTimer = 2;
    this.swatTextTimer = 0;
    this.swatTextScale = 0;
    this.gamestart = false;
    this.flightPattern;
    this.swingCD = 100;
    this.swung = false;
    this.timer = 0;
    this.gameOver = false;
    this.dead = false;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.gameStartRan = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  preload() {
    this.load.image(
      "8B5_dead",
      new URL("../8Bitties/assets/FlySwat/deadfly.png", import.meta.url).href
    );
    this.load.image(
      "8B5_holder",
      new URL("../8Bitties/assets/FlySwat/imageholder.png", import.meta.url)
        .href
    );

    this.load.image(
      "8B5_kitchen",
      new URL("../8Bitties/assets/FlySwat/kitchenbg.png", import.meta.url).href
    );
    this.load.spritesheet(
      "8B5_fly",
      new URL("../8Bitties/assets/FlySwat/fly_sheet.png", import.meta.url).href,
      {
        frameWidth: 190,
        frameHeight: 128,
      }
    );
    this.load.spritesheet(
      "8B5_swatter",
      new URL(
        "../8Bitties/assets/FlySwat/flyswatter_sheet.png",
        import.meta.url
      ).href,
      {
        frameWidth: 322,
        frameHeight: 430,
      }
    );
    this.load.spritesheet(
      "8B5_explosion",
      new URL("../8Bitties/assets/FlySwat/boomSheet.png", import.meta.url).href,
      {
        frameWidth: 140,
        frameHeight: 130,
      }
    );
    this.load.audio(
      '8B5_Kaboom',
      new URL('../8Bitties/assets/FlySwat/explosion.mp3', import.meta.url).href,
    );

    this.load.audio(
      '8B5_Slap',
      new URL('../8Bitties/assets/FlySwat/slap.mp3', import.meta.url).href
    );
  }

  create() {
    this.setFlySwat();
    this.createSounds();
    this.makeAnimations();
    this.kitchen = this.add.image(540, 360, "8B5_kitchen").setDepth(-4);
    this.createKeys();
    eventsCenter.on('start_game', () => { this.started = true; this.globalState.timerMessage('start_timer'); });
    this.gameStart();
    this.swatter.body.collideWorldBounds = true;
  }

  update() {
    if (!this.dead) this.moveFly();
    if (this.started) {
      this.buttonHandlers.update();
      if (!this.gamePad) this.startGamePad();
      //this.playSwatText();

      this.moveSwatter();
      this.swing();
      if (this.gameOver && !this.sent) {
        eventsCenter.emit('stop_timer');
        eventsCenter.emit("game-end", this.victory);
        this.sent = true;
      }
    }
    //this.animateDeadFly();
  }

  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -0.5, () => this.moveSwatter(-1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === -1, () => this.moveSwatter(-11));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.moveSwatter(1));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 1, () => this.moveSwatter(11));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.5, () => this.moveSwatter(-2));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 1, () => this.moveSwatter(-22));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.5, () => this.moveSwatter(2));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === -1, () => this.moveSwatter(22));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 0, () => this.moveSwatter(4));
    this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.moveSwatter(3));
    this.buttonHandlers.addPad(() => this.gamePad.buttons[0].pressed, () => { this.swat(); });
  }

  swat() {
    
    if (!this.swung) {
      this.swatter.anims.play("8B5_down", true);
      this.swung = true;
        
      this.slapNoise.play({
          volume:.3,
        });

      if (
        Phaser.Geom.Intersects.CircleToRectangle(
          this.fly.body,
          this.swatter.body
        )
      ) {
        this.killFly();
        this.victory = true;
        setTimeout(() => {
          this.gameOver = true;
        }, 1500);
      }
      this.time.delayedCall(500, () => { this.swung = false; });
    }
  }

  gameStart() {
    this.flightPattern = Math.floor(Math.random() * 2);
    this.fly = this.physics.add.sprite(540, 360, "8B5_fly");
    this.fly.anims.play("8B5_flying", true);
    this.fly.body.setCircle(32).setOffset(32, 32);
    this.swatter = this.physics.add.sprite(500, 450, "8B5_swatter");
    this.swatter.body.setSize(128, 160).setOffset(128, 32);
    this.gamestart = true;
  }
  playSwatText() {
    if (!this.gameStartRan) {
      //this.swat.destroy();
      this.gameStart();
      this.gameStartRan = true;
    }
  }
  killFly() {
    this.kaboomNoise.play(
      {
        volume: 1,
      }
    )
    this.fly.anims.play("8B5_crash");
    this.dead = true;
  }

  moveFly() {
    if (this.fly) {
      this.timer += 0.1;
      if (this.flightPattern === 1) {
        this.fly.x = Math.sin(this.timer / 2) * 320 + 540;
        this.fly.y = Math.sin(this.timer) * 128 + 360;
      }
      if (this.flightPattern === 0) {
        this.fly.x = Math.cos(this.timer) * 160 + 540;
        this.fly.y = Math.sin(this.timer) * 160 + 320;
      }
    }
  }
  makeAnimations() {
    this.anims.create({
      key: "8B5_flying",
      frames: [
        { key: "8B5_fly", frame: 0 },
        { key: "8B5_fly", frame: 1 },
        { key: "8B5_fly", frame: 2 },
        { key: "8B5_fly", frame: 3 },
        { key: "8B5_fly", frame: 4 },
        { key: "8B5_fly", frame: 5 },
        { key: "8B5_fly", frame: 6 },
      ],
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: "8B5_up",
      frames: [{ key: "8B5_swatter", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "8B5_down",
      frames: [{ key: "8B5_swatter", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "8B5_crash",
      frames: [
        { key: "8B5_explosion", frame: 0 },
        { key: "8B5_explosion", frame: 1 },
        { key: "8B5_explosion", frame: 2 },
        { key: "8B5_explosion", frame: 3 },
        { key: "8B5_explosion", frame: 4 },
        { key: "8B5_explosion", frame: 5 },
        { key: "8B5_explosion", frame: 6 },
        { key: "8B5_explosion", frame: 7 },
        { key: "8B5_explosion", frame: 8 },
        { key: "8B5_explosion", frame: 9 },
        { key: "8B5_explosion", frame: 12 },
        { key: "8B5_explosion", frame: 13 },
        { key: "8B5_explosion", frame: 14 },
        { key: "8B5_explosion", frame: 15 },
        { key: "8B5_explosion", frame: 16 },
        { key: "8B5_explosion", frame: 17 },
        { key: "8B5_explosion", frame: 18 },
        { key: "8B5_explosion", frame: 19 },
        { key: "8B5_explosion", frame: 20 },
      ],
      frameRate: 10,
      repeat: 0,
    });
  }
  swing() {
    if (this.swatter && !this.gameOver) {
     
      if (this.swung === true) {
        this.swingCD -= 10;
      }
      
      

      if (this.swingCD <= 0) {
        
        this.swatter.anims.play("8B5_up", true);
        this.swatter.on('animationcomplete', () => {
          this.swung = false;
          
        });
        this.swingCD = 100;
      }
    }
  }
  createKeys() {
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }
  moveSwatter(x) {
    if (this.swatter) {
      if (x === 2) {
        this.swatter.setVelocityY(-400);
      }
      if (x === 22) {
        this.swatter.setVelocityY(-800);
      }
      if (x === -2) {
        this.swatter.setVelocityY(400);
      }
      if (x === -22) {
        this.swatter.setVelocityY(800);
      }
      if (x === -1) {
        this.swatter.setVelocityX(-400);
      }
      if (x === -11) {
        this.swatter.setVelocityX(-800);
      }
      if (x === 1) {
        this.swatter.setVelocityX(400);
      }
      if (x === 11) {
        this.swatter.setVelocityX(800);
      }
      if (x === 3) {
        this.swatter.setVelocityX(0);
      }
      if (x === 4) {
        this.swatter.setVelocityY(0);
      }
    }
  }
  setFlySwat(){
    this.swatdown = false;
    this.swatTimer = 2;
    this.swatTextTimer = 0;
    this.swatTextScale = 0;
    this.gamestart = false;
    this.swingCD = 100;
    this.swung = false;
    this.timer = 0;
    this.gameOver = false;
    this.dead = false;
    this.victory = false;
    this.sent = false;
    this.started = false;
    this.gameStartRan = false;
    this.buttonHandlers = new ButtonPressHandlers();
    this.gamePad = null;
  }
  createSounds(){
    this.kaboomNoise = this.sound.add('8B5_Kaboom');
    this.slapNoise = this.sound.add('8B5_Slap');
  }
}
