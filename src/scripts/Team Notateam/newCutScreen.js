import Phaser from "phaser";
import eventsCenter from "../EventsCenter";
import fruitBasket from "../8Bitties/fruitBasket";
const X = 1080;
const Y = 720;
const L_END = X / 4;
const R_END = 3 * L_END;
const L_START = -L_END;
const R_START = 5 * L_END;

const listOfGames = [ 
  'PenguinSlide',
  'ColorPasscode',
  'FlySwat',
  'SockToss',
  'MarcyMunch',
  'ColorPasscode',
  'fruitBasket',
  'CircleJump',
  'Lowest',
  'FrogJump',
  // 'DrinkPour'(sound not working correctly),
  // 'Emeowgency'(broken),
  // 'ColorLab'(not finnished),
  'Cannon',
  'CarPump',
  'TrashSort',
  // 'HideFromCat'(no sounds yet),
  // 'HitTheButton'(no sounds yet),
  //'BetweenSpace',
  //'TugOWar',
  // 'WhereisWilly'(sound not implimented ),
  'GameOver',
];

export default class newCutScreen extends Phaser.Scene {
  // Game Class Constructor
  constructor() {
    super({
      active: false,
      visible: true,
      key: 'CutScreen',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
    });

    this.currentScene = 'MarcyMunch';
    this.roundNumber = 0;
    this.pass = 'neutral';
    this.gameOrder = new Array(listOfGames.length - 1);
    this.close_timer = 0;
    this.life_total = 5;
    this.closed = false;
    this.open = false;
    this.endless = false;
    this.lost = false;
    // this.score = -1;

    this.space;

    this.l_door;
    this.r_door;

    this.faceplate;
    this.numplate;
    this.ones;
    this.tens;
    this.huns;

    this.l_sockets;
    this.r_sockets;
    this.l_life;
    this.r_life;

    this.textPrompt;
  }

  preload() {
    this.load.spritesheet('gba', new URL('assets/gba.png', import.meta.url).href, {
      frameWidth: 252,
      frameHeight: 162,
    });
    this.load.spritesheet('loss', new URL('assets/loss_cat.png', import.meta.url).href, {
      frameWidth: 419,
      frameHeight: 162,
    });
    this.load.spritesheet('win', new URL('assets/win_cat.png', import.meta.url).href, {
      frameWidth: 419,
      frameHeight: 162,
    });
    this.load.spritesheet(
      'numbers',
      new URL('../globalAssets/numsheet.png', import.meta.url).href,
      { frameWidth: 77, frameHeight: 122 }
    );
    this.load.image('gba_socket', new URL('assets/gba_socket.png', import.meta.url).href);
    this.load.image('num_plate', new URL('assets/num_plate.png', import.meta.url).href);
    this.load.image('l_door', new URL('assets/l_door.png', import.meta.url).href);
    this.load.image('r_door', new URL('assets/r_door.png', import.meta.url).href);

    this.load.image('count!', new URL('../textPrompts/countpenguins.png', import.meta.url).href);
    this.load.image('toss!', new URL('../textPrompts/toss.png', import.meta.url).href);
    this.load.image('catch!', new URL('../textPrompts/Catch_Text.png', import.meta.url).href);
    this.load.image('pour!', new URL('../textPrompts/pourtext.png', import.meta.url).href);
    this.load.image('pull!', new URL('../textPrompts/pulltext.png', import.meta.url).href);
    this.load.image('sort!', new URL('../textPrompts/sort.png', import.meta.url).href);
    this.load.image('swat!', new URL('../textPrompts/swatText.png', import.meta.url).href);
    this.load.image('swat!', new URL('../textPrompts/swatText.png', import.meta.url).href);
    this.load.image('munch!', new URL('../textPrompts/munch.png', import.meta.url).href);
    this.load.image('jump!', new URL('../textPrompts/Jump.png', import.meta.url).href);
    this.load.image('pick the lowest!', new URL('../textPrompts/lowest.png', import.meta.url).href);
    this.load.image('cheese it!', new URL('../textPrompts/cheeseit.png', import.meta.url).href);
    this.load.image('memorize!', new URL('../textPrompts/memorize.png', import.meta.url).href);
    this.load.image('slap it!', new URL('../textPrompts/slapit.png', import.meta.url).href);
    this.load.image('mix!', new URL('../textPrompts/mix.png', import.meta.url).href);
    this.load.image('pump!', new URL('../textPrompts/pump.png', import.meta.url).href);
    this.load.image('dodge!', new URL('../textPrompts/dodge.png', import.meta.url).href);
    this.load.image('avoid!', new URL('../textPrompts/avoid.png', import.meta.url).href);
    this.load.image('add!', new URL('../textPrompts/add.png', import.meta.url).href);
    this.load.audio('open_doors', new URL('assets/open_doors.mp3', import.meta.url).href);
    this.load.audio('close_doors', new URL('assets/close_doors.mp3', import.meta.url).href);
    //this.load.audio('intro_jingle', new URL('../8Bitties/assets/jingle.wav', import.meta.url).href);
    this.load.audio('lose_game', new URL('../8Bitties/assets/losegame.wav', import.meta.url).href);
    this.load.audio('win_game', new URL('../8Bitties/assets/wingame.wav', import.meta.url).href);
  }

  create() {
    this.makeSounds();
    this.setCutScreen();
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.scene.run('MainMenu');
    this.scene.sendToBack('MainMenu');
    this.buildAnimations();
    this.buildObjects();
    this.setScore(this.globalState.scores);

    eventsCenter.on('game-end', this.closeDoor, this);
    eventsCenter.on(
      'start-normal',
      () => {
        this.closed = false;
        this.closeSound.play({
          volume: 0.3,
        });
        setTimeout(() => {
          if (this.scene.isActive('MainMenu')) this.scene.stop('MainMenu');
        });
      },
      2000
    );
    eventsCenter.on(
      'start-endless',
      () => {
        this.closeSound.play({
          volume: 0.3,
        });
        this.shuffleGameOrder();
        this.closed = false;
        setTimeout(() => {
          if (this.scene.isActive('MainMenu')) this.scene.stop('MainMenu');
        });
        this.endless = true;
      },
      2000
    );
  }
  update() {
    if (!this.closed) {
      this.close_timer++;
      this.close_doors();
    } else if (this.open) {
      this.close_timer++;
      this.open_doors();
    }
  }

  close_doors() {
    // If left door is not yet in closed position
    if (this.l_door.x < L_END) {
      this.l_close();
      this.r_close();
    } else {
      this.close_timer = 0;
      this.closecon();
      this.closed = true;
    }
  }
  open_doors() {
    if (this.l_door.x > L_START) {
      this.l_open();
      this.r_open();
    } else {
      this.close_timer = 0;
      this.faceplate.anims.stop();
      this.faceplate.setFrame(0);
      this.open = false;
      eventsCenter.emit('start_game');
      this.closed = true;
    }
  }
  l_close() {
    // If left door would overshoot closed position
    if (this.l_door.x + this.close_timer >= L_END) {
      // Move Door
      this.l_door.x = L_END;

      this.numplate.x = L_END;
      this.ones.x = L_END + 82;
      this.tens.x = L_END;
      this.huns.x = L_END - 82;

      //Move Life Objects
      this.l_sockets.children.iterate((child) => {
        child.x = L_END;
      });
      this.l_life.children.iterate((child) => {
        child.x = L_END;
      });
    } else {
      // Move Door
      this.l_door.x += this.close_timer;

      this.numplate.x += this.close_timer;
      this.ones.x += this.close_timer;
      this.tens.x += this.close_timer;
      this.huns.x += this.close_timer;

      // Move Life Objects
      this.l_sockets.children.iterate((child) => {
        child.x += this.close_timer;
      });
      this.l_life.children.iterate((child) => {
        child.x += this.close_timer;
      });
    }
  }
  l_open() {
    // code for right door based on code for left door
    if (this.l_door.x - this.close_timer <= L_START) {
      // Move Door
      this.l_door.x = L_START;

      this.numplate.x = L_START;
      this.ones.x = L_START + 82;
      this.tens.x = L_START;
      this.huns.x = L_START - 82;

      // Move Life Objects
      this.l_sockets.children.iterate((child) => {
        child.x = L_START;
      });
      this.l_life.children.iterate((child) => {
        child.x = L_START;
      });
    } else {
      // Move Door
      this.l_door.x -= this.close_timer;

      this.numplate.x -= this.close_timer;
      this.ones.x -= this.close_timer;
      this.tens.x -= this.close_timer;
      this.huns.x -= this.close_timer;

      // Move Life Objects
      this.l_sockets.children.iterate((child) => {
        child.x -= this.close_timer;
      });
      this.l_life.children.iterate((child) => {
        child.x -= this.close_timer;
      });
    }
  }
  r_close() {
    // code for right door based on code for left door
    if (this.r_door.x - this.close_timer <= R_END) {
      // Move Door
      this.r_door.x = R_END;
      this.faceplate.x = R_END;
      // Move Life Objects
      this.r_sockets.children.iterate((child) => {
        child.x = R_END;
      });
      this.r_life.children.iterate((child) => {
        child.x = R_END;
      });
    } else {
      // Move Door
      this.r_door.x -= this.close_timer;
      this.faceplate.x -= this.close_timer;
      // Move Life Objects
      this.r_sockets.children.iterate((child) => {
        child.x -= this.close_timer;
      });
      this.r_life.children.iterate((child) => {
        child.x -= this.close_timer;
      });
    }
  }
  r_open() {
    // If left door would overshoot closed position
    if (this.r_door.x + this.close_timer >= R_START) {
      // Move Door
      this.r_door.x = R_START;
      this.faceplate.x = R_START;
      //Move Life Objects
      this.r_sockets.children.iterate((child) => {
        child.x = R_START;
      });
      this.r_life.children.iterate((child) => {
        child.x = R_START;
      });
    } else {
      // Move Door
      this.r_door.x += this.close_timer;
      this.faceplate.x += this.close_timer;

      // Move Life Objects
      this.r_sockets.children.iterate((child) => {
        child.x += this.close_timer;
      });
      this.r_life.children.iterate((child) => {
        child.x += this.close_timer;
      });
    }
  }
  reduce_life() {
    switch (this.life_total) {
      case 1:
      case 2:
        this.r_disable(this.life_total);
        break;
      case 3:
      case 4:
        this.l_disable(this.life_total);
        break;
      default:
        return;
    }
  }
  l_disable(index) {
    this.l_life.getChildren()[4 - index].anims.play('blink');
  }
  r_disable(index) {
    this.r_life.getChildren()[2 - index].anims.play('blink');
  }
  setScore(score) {
    let o = score % 10;
    let h = Math.floor(score / 100);
    let t = Math.floor((score - h * 100) / 10);

    this.ones.setFrame(o + 1);
    if (score >= 10) this.tens.setFrame(t + 1);
    if (score >= 100) this.huns.setFrame(h + 1);
  }

  showGameResult() {
    if(this.currentScene == 'MainMenu')
    {
      this.globalState.scores = 0;
      setTimeout(() => {
        this.setScore(this.globalState.scores);
      }, 200);
    }
    if (!this.lost &&  this.currentScene !== 'MainMenu') {
      this.winGame.play({volume: 0.5});
      this.faceplate.anims.play('win1').once('animationcomplete', () => {
        this.faceplate.anims.play('win2');
      });
      this.globalState.scores++;
      setTimeout(() => {
        this.setScore(this.globalState.scores);
      }, 200);
    } else if(this.lost){
      this.loseGame.play({volume: 0.5});
      this.faceplate.anims.play('lose1').once('animationcomplete', () => {
        this.faceplate.anims.play('lose2');
        
      });
      this.life_total--;
      this.reduce_life();
    }
  }

  // Runs every time "doors" finish closing
  closecon() {
    // console.log("Before Running gameOrder is?: ", this.gameOrder)
    console.log('Round ', this.roundNumber);

    // if (this.currentScene === 'CircleJump') {
    //     eventsCenter.emit('end_circle');
    // }

    // Plays victory or loss animation and increments score accordingly
    this.showGameResult();

    // Stops and resets game timer
    this.resetTimer();

    // Ends the current game if we have started playing
    this.endCurrentScene();

    this.startNextScene();
  }

  endCurrentScene() {
    if (this.roundNumber > 0) {
      this.endCurrentGame();
    }
  }
  startNextScene() {
    // Life total is less than or equal to one, game ends.
    this.life_total > 1 ? this.setCurrentScene() : (this.currentScene = 'GameOver');

    if (
      this.currentScene !== 'GameOver' &&
      this.currentScene !== 'MainMenu' &&
      this.currentScene !== 'Hi-Score'
    ) {
      this.scene.run('Timer');
    } else {
      this.scene.stop('Timer');
      // console.log(this.globalState.scores);
    }
    // console.log(this.currentScene)

    this.scene.run(this.currentScene);
    console.log(this.currentScene + ' should be running...');

    this.scene.sendToBack('Timer');
    this.scene.sendToBack(this.currentScene);

    this.roundNumber++;

    // Plays prompt for next game
    setTimeout(() => {
      if (
        this.currentScene !== 'GameOver' &&
        this.currentScene !== 'MainMenu' &&
        this.currentScene !== 'Hi-Score'
      )
        this.textPrompt.setVisible(true);
      // Door opens after prompt
      this.openDoor();
    }, 2000);
  }

  endCurrentGame() {
    // console.log(this.currentScene);
    this.scene.stop(this.currentScene);
  }
  buildObjects() {
    // Build Doors
    this.l_door = this.add.image(L_START, Y / 2, 'l_door');
    this.r_door = this.add.image(R_START, Y / 2, 'r_door');
    this.buildFaceplates();
    this.buildLifeSockets();
  }
  buildFaceplates() {
    this.faceplate = this.physics.add.sprite(R_START, Y / 4, 'loss');
    this.numplate = this.physics.add.sprite(L_START, Y / 4, 'num_plate');
    this.numplate.setScale(2 / 3, 1);
    this.ones = this.physics.add.sprite(L_START + 82, Y / 4, 'numbers');
    this.tens = this.physics.add.sprite(L_START, Y / 4, 'numbers');
    this.huns = this.physics.add.sprite(L_START - 82, Y / 4, 'numbers');
  }
  buildLifeSockets() {
    this.l_sockets = this.physics.add.group({
      key: 'gba_socket',
      repeat: 1,
      setXY: { x: L_START, y: (5 * Y) / 6 - 185, stepY: 185 },
    });
    this.l_life = this.physics.add.group({
      key: 'gba_socket',
      repeat: 1,
      setXY: { x: L_START, y: (5 * Y) / 6 - 185, stepY: 185 },
    });
    this.r_sockets = this.physics.add.group({
      key: 'gba_socket',
      repeat: 1,
      setXY: { x: R_START, y: (5 * Y) / 6 - 185, stepY: 185 },
    });
    this.r_life = this.physics.add.group({
      key: 'gba_socket',
      repeat: 1,
      setXY: { x: R_START, y: (5 * Y) / 6 - 185, stepY: 185 },
    });
    this.l_sockets.setDepth(1);
    this.r_sockets.setDepth(1);
    this.l_life.setDepth(1);
    this.r_life.setDepth(1);
    this.l_life.children.iterate((child) => {
      child.anims.play('life');
    });
    this.r_life.children.iterate((child) => {
      child.anims.play('life');
    });
  }
  buildAnimations() {
    this.anims.create({
      key: 'life',
      frames: [
        { key: 'gba', frame: 0 },
        { key: 'gba', frame: 0 },
        { key: 'gba', frame: 1 },
        { key: 'gba', frame: 2 },
        { key: 'gba', frame: 2 },
        { key: 'gba', frame: 1 },
      ],
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'blink',
      frames: [{ key: 'gba', frame: 0 }, { key: 'gba_socket' }],
      frameRate: 6,
      repeat: 2,
    });
    this.anims.create({
      key: 'lose1',
      frames: [
        { key: 'loss', frame: 0 },
        { key: 'loss', frame: 1 },
        { key: 'loss', frame: 2 },
        { key: 'loss', frame: 3 },
      ],
      frameRate: 6,
    });
    this.anims.create({
      key: 'lose2',
      frames: [
        { key: 'loss', frame: 3 },
        { key: 'loss', frame: 4 },
        { key: 'loss', frame: 5 },
      ],
      frameRate: 6,
      repeat: -1,
      yoyo: true,
    });
    this.anims.create({
      key: 'win1',
      frames: [
        { key: 'win', frame: 0 },
        { key: 'win', frame: 1 },
        { key: 'win', frame: 2 },
        { key: 'win', frame: 3 },
      ],
      frameRate: 6,
    });
    this.anims.create({
      key: 'win2',
      frames: [
        { key: 'win', frame: 3 },
        { key: 'win', frame: 4 },
        { key: 'win', frame: 5 },
      ],
      frameRate: 6,
      repeat: -1,
      yoyo: true,
    });
  }

  closeDoor(victory) {
    this.lost = !victory;
    console.log('emission received');
    //this.faceplate.anims.stop()
    this.closeSound.play({
      volume: 0.3,
    });
    this.closed = false;
  }
  openDoor() {
    setTimeout(() => {
      this.textPrompt.setVisible(false);
      this.open = true;
      this.openSound.play({ volume: 0.3 });
    }, 2000);
  }
  resetTimer() {
    // Stop game timer
    eventsCenter.emit('stop_timer');
    // Reset game timer
    eventsCenter.emit('reset_timer');
  }
  setCurrentScene() {
    //will only run when endless is selected
    if (this.endless === true) {
      if (this.roundNumber === this.gameOrder.length) {
        this.pass = 'neutral';
        this.gameOrder = new Array(listOfGames.length - 1);
        this.shuffleGameOrder();
        this.roundNumber = 0;
        console.log('shuffling ...');
        // console.log('GameOrder:', this.gameOrder)
      } else {
        this.currentScene = listOfGames[this.gameOrder[this.roundNumber]];
        // console.log(this.currentScene, 'is the current scene')
      }
    } else {
      this.currentScene = listOfGames[this.roundNumber];
    }
    let s;
    switch (this.currentScene) {
      case 'PenguinSlide':
        s = 'count!';
        break;
      case 'fruitBasket':
        s = 'catch!';
        break;
      case 'Lowest':
        s = 'pick the lowest!';
        break;
      case 'FrogJump':
        s = 'jump!';
        break;
      case 'TugOWar':
        s = 'pull!';
        break;
      case 'DrinkPour':
        s = 'pour!';
        break;
      case 'FlySwat':
        s = 'swat!';
        break;
      case 'Emeowgency':
        s = 'catch!';
        break;
      case 'MarcyMunch':
        s = 'munch!';
        break;
      case 'SockToss':
        s = 'toss!';
        break;
      case 'ColorLab':
        s = 'mix!';
        break;
      case 'Cannon':
        s = 'add!';
        break;
      case 'CarPump':
        s = 'pump!';
        break;
      case 'TrashSort':
        s = 'sort!';
        break;
      case 'ColorPasscode':
        s = 'memorize!';
        break;
      case 'HideFromCat':
        s = 'cheese it!';
        break;
      case 'HitTheButton':
        s = 'slap it!';
        break;
      case 'CircleJump':
        s = 'avoid!';
        break;
      case 'BetweenSpace':
        s = 'dodge!';
        break;
      default:
        break;
    }
    this.textPrompt = this.add.image(X / 2, Y / 2, s);
    this.textPrompt.setVisible(false).setDepth(1);
  }
  setCutScreen() {
    this.currentScene = 'MainMenu';
    this.roundNumber = 0;
    this.close_timer = 0;
    this.life_total = 5;
    this.closed = true;
    this.open = false;
    this.lost = false;
    this.endless = true;
    this.gameOrder = new Array(listOfGames.length - 1);
    this.rand = 0;
    this.pass = 'neutral';
    this.endless = 0;
  }
  shuffleGameOrder() {
    for (let i = 0; i < this.gameOrder.length; i++) {
      this.rand = Math.floor(Math.random() * this.gameOrder.length);
      //cheking if this.rand has an equivilent value inside of game order
      for (let n = 0; n < this.gameOrder.length; n++) {
        //is it equal ? make door invalid and stop the cycling, else door is valid and n++;
        this.rand === this.gameOrder[n] ? (this.pass = 'invalid') : (this.pass = 'valid');
        if (this.pass === 'invalid') {
          break;
        }
      }
      if (this.pass === 'invalid') {
        i--;
        this.pass = 'neutral';
      }
      if (this.pass === 'valid') {
        // console.log('rnd', this.rand);
        this.gameOrder[i] = this.rand;
        this.pass = 'neutral';
      }
      // console.log('game number: ', this.gameOrder[i])
    }
  }
  makeSounds() {
    this.openSound = this.sound.add('open_doors');
    this.closeSound = this.sound.add('close_doors');
    //this.introJingle = this.sound.add('intro_jingle');
    this.winGame = this.sound.add('win_game');
    this.loseGame = this.sound.add('lose_game');
    console.log('hearme 00');
  }
}
