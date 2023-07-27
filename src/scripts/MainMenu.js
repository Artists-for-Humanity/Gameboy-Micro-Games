import ButtonPressHandlers from './ButtonPressHandlers';
import phaserJuice from './phaserJuice';
import eventsCenter from './EventsCenter';
import HiScoreScene from './Hi-Score';
const X = 1080;
const Y = 720;

export default class MainMenu extends Phaser.Scene {
  // Game  Class Constructor
  constructor() {
    super({
      active: false,
      visible: false,
      key: 'MainMenu',
    });
    // console.log("Running Constructor");

    // an array of sprites
    this.btns = [];

    // array containing selected button animations
    this.animations = [];

    // Finger sprite
    this.fingerIcon;

    // corresponds to selected button index (i.g. when 0, 'PLAY' is highlighted)
    this.fingerPos = 0;

    // inputs
    this.left;
    this.right;
    this.action;
    this.buttonHandlers = new ButtonPressHandlers();

    this.sent = false;

    this.wobbleDir = false;
    this.alphaVal = false;
    this.wobbleTimer = 0;

    this.buttonHandlers;
    this.gamePad = null;
    this.pass = true;
    this.high = HiScoreScene;
  }

  preload() {
    // console.log('running main menu 00000');

    this.listOfGames = [
      'Emeowgency',
      'ColorLab',
      'MicroGame11',
      'Highest2Lowest',
      'FrogJump',
      'CircleJump',
      'BewteenSpace',
      'ColorPasscode',
      'HideFromCat',
      'HitTheButton',
      'TugOWar',
      'FlySwat',
      'DrinkPour',
    ];
    this.load.image('green1', new URL('gameAssets/greenGradiant.png', import.meta.url).href);
    this.load.image('green2', new URL('gameAssets/solidGreen.png', import.meta.url).href);
    this.load.image('bg1', new URL('globalAssets/title_screen.png', import.meta.url).href);
    this.load.spritesheet('play', new URL('gameAssets/play_btn.png', import.meta.url).href, {
      frameWidth: 239,
      frameHeight: 117,
    });
    this.load.spritesheet('score', new URL('gameAssets/score_btn.png', import.meta.url).href, {
      frameWidth: 239,
      frameHeight: 117,
    });
    this.load.image('finger', new URL('gameAssets/finger.png', import.meta.url).href);
    this.load.image('endless', new URL('gameAssets/EButton_Large.png', import.meta.url).href);
  }

  create() {
    this.resetMainMenu();
    this.add.image(X / 2, Y / 2, 'bg1');
    this.btns.push(this.physics.add.sprite(X / 8, Y * 0.9, 'play'));
    this.btns.push(this.physics.add.image((4 * X) / 8, Y * 0.9, 'endless').setScale(0.45));
    this.btns.push(this.physics.add.sprite((7 * X) / 8, Y * 0.9, 'score'));
    this.greenSlip = this.add.image(this.btns[0].x, this.btns[0].y, 'green2').setScale(0.4);

    this.fingerIcon = this.add
      .image(this.btns[0].x, this.btns[0].y - 117, 'finger')
      .setRotation(Math.PI / 2);

    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.juice = new phaserJuice(this);
  }

  update() {
    this.verticalWobble(this.fingerIcon, 0.8, 4);
    this.alterOppacity(this.greenSlip, 5 / 250);

    this.buttonHandlers.update();
    if (!this.gamePad) this.startGamePad();
    if (!this.gamePad) this.makeKeyboardKeys();
  }

  makeKeyboardKeys() {
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyBoardInputs();
  }
  keyBoardInputs() {
    if (Phaser.Input.Keyboard.JustDown(this.left)) this.updateSelection(-1);
    if (Phaser.Input.Keyboard.JustDown(this.right)) this.updateSelection(1);
    if (Phaser.Input.Keyboard.JustDown(this.space)) this.buttonEvents();
  }
  startGamePad() {
    if (this.input.gamepad.total) {
      this.gamePad = this.input.gamepad.pad1;
      this.initGamePad();
      // console.log(this.gamePad);
    }
  }

  initGamePad() {
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === -1,
      () => this.updateSelection(-1)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.leftStick.x === 1,
      () => this.updateSelection(1)
    );
    this.buttonHandlers.addPad(
      () => this.gamePad.buttons[0].pressed,
      () => {
        this.buttonEvents();
      }
    );
  }

  verticalWobble(obj, amount, speed) {
    this.wobbleTimer += speed;
    if (this.wobbleTimer % 100 === 0) {
      this.wobbleDir = !this.wobbleDir;
    }
    this.wobbleDir ? (obj.y += amount) : (obj.y -= amount);
  }

  updateSelection(input) {
    //left
    if (input === -1) {
      this.fingerPos === 0 ? (this.fingerPos = this.btns.length - 1) : this.fingerPos--;
    }
    //right
    if (input === 1) {
      this.fingerPos === this.btns.length - 1 ? (this.fingerPos = 0) : this.fingerPos++;
    }

    this.fingerIcon.x = this.btns[this.fingerPos].x;
    this.greenSlip.x = this.btns[this.fingerPos].x;
  }

  buttonEvents() {
    console.log(this.fingerPos);
    switch (this.fingerPos) {
      case 0: // Play
        this.playGame();
        // this.scene.start('MarcyMunch');
        break;
      case 1:
        // this.resetMainMenu();
        this.playEndless();
        break;
      case 2: // Scores
        // this.resetMainMenu();
        this.scene.stop('MainMenu');
        this.scene.start('HiScoreScene');

      default:
        break;
    }
  }
  playEndless() {
    if (!this.sent) {
      eventsCenter.emit('start-endless');
      this.sent = true;
    }
  }
  playGame() {
    if (!this.sent) {
      console.log('cutscreenrunning .... ');
      eventsCenter.emit('start-normal');
      //this.globalState.sendMessage(true)
      this.sent = true;
    }
  }

  resetMainMenu() {
    this.btns = [];
    this.opac = 0.5;
    this.animations = [];
    this.fingerPos = 0;
    this.left;
    // this.int = 0;
    this.right;
    // this.pass = true;
    this.action;
    this.buttonHandlers = new ButtonPressHandlers();
    this.sent = false;
    this.wobbleDir = false;
    this.wobbleTimer = 0;
    this.gamePad = null;
    // this.toggle = true;
    this.alphaVal = false;
    this.alphaTimer = false;
    this.sign = true;
  }
  alterOppacity(obj, speed) {
    if (this.sign === true) {
      obj.setAlpha(this.opac);
      this.opac -= speed;
      if (this.opac <= 0) {
        this.sign = false;
      }
    }
    if (this.sign === false) {
      obj.setAlpha(this.opac);
      this.opac += speed;
      if (this.opac >= 0.5) {
        this.sign = true;
      }
    }
  }
  animationBuilder() {
    this.animations.push(
      this.anims.create({
        key: 'play_btn',
        frames: 'play',
        frameRate: 12,
        repeat: -1,
        yoyo: true,
      })
    );

    this.animations.push(
      this.anims.create({
        key: 'score_btn',
        frames: 'score',
        frameRate: 12,
        repeat: -1,
        yoyo: true,
      })
    );

    this.animations.push(
      this.anims.create({
        key: 'score_btn',
        frames: 'score',
        frameRate: 12,
        repeat: -1,
        yoyo: true,
      })
    );
  }
}
