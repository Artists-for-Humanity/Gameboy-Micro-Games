import Phaser from 'phaser';
import eventsCenter from '../EventsCenter';
import ButtonPressHandlers from '../ButtonPressHandlers';



export default class CatMaze extends Phaser.Scene {
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'CatMaze',
        });

        this.sent = false;
        this.timerStopped = false;
        //this.gamestart = false;
        this.started = false;
        this.gameOver = false;
        this.victory = false;
        this.buttonHandlers = new ButtonPressHandlers();
        this.gamePad = null;
        this.count = 0;

        this.player;
        this.enemy;
        this.star;
        this.void1;
        this.void2;
        this.void3;
        this.void4;
        this.void5;
        this.void6;
        this.void7;
        this.void8;
        this.space1;
        this.space2;
        this.space3;
        this.space4;

    }

    preload() {
        this.load.image('background', new URL("./MazeAssets/MazeBackground.png", import.meta.url).href);
        this.load.image('player', new URL('./MazeAssets/MazeCat.png', import.meta.url).href);
        this.load.image('enemy', new URL('./MazeAssets/MazeDog.png', import.meta.url).href);
        this.load.image('star', new URL('./MazeAssets/MazeStar.png', import.meta.url).href);
        this.load.image('void1', new URL('./MazeAssets/MazeVoid1.png', import.meta.url).href);
        this.load.image('void2', new URL('./MazeAssets/MazeVoid2.png', import.meta.url).href);
        this.load.image('void3', new URL('./MazeAssets/MazeVoid3.png', import.meta.url).href);
        this.load.image('void4', new URL('./MazeAssets/MazeVoid4.png', import.meta.url).href);
        this.load.image('void5', new URL('./MazeAssets/MazeVoid5.png', import.meta.url).href);
        this.load.image('void6', new URL('./MazeAssets/MazeVoid6.png', import.meta.url).href);
        this.load.image('void7', new URL('./MazeAssets/MazeVoid7.png', import.meta.url).href);
        this.load.image('void8', new URL('./MazeAssets/MazeVoid8.png', import.meta.url).href);
        this.load.image('space1', new URL('./MazeAssets/MazeSpace1.png', import.meta.url).href);
        this.load.image('space2', new URL('./MazeAssets/MazeSpace2.png', import.meta.url).href);
        this.load.image('space3', new URL('./MazeAssets/MazeSpace3.png', import.meta.url).href);
        this.load.image('space4', new URL('./MazeAssets/MazeSpace4.png', import.meta.url).href);



    }

    create() {
        console.log('The width of the game is: ' + this.game.config.width);

        eventsCenter.on('start_game', () => {
            this.started = true; 
            eventsCenter.emit('start_timer');
            this.globalState.timerMessage('start_timer'); 
          });

          //this.gameStart();

        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');

        this.player = this.physics.add.sprite(120, 400, 'player');
        this.enemy = this.physics.add.sprite(-1700, 400, 'enemy');
        this.star = this.physics.add.sprite(405, 650, 'star');
        
        
        this.walls = this.physics.add.staticGroup();
        this.walls.create(320, 470, 'void1') //across spawn
        this.walls.create(536, 169, 'void2') //above space4
        this.walls.create(751, 319, 'void3') //right of space4 
        this.walls.create(910, 314, 'void4') //across void3
        this.walls.create(990, 459, 'void5') //touching void6 
        this.walls.create(1070, 300, 'void6') //right
        this.walls.create(250, 714, 'void7') //bottom
        this.walls.create(600, .05, 'void8') //top
        this.walls.create(80, 138, 'space1') //top left
        this.walls.create(80, 690, 'space2') //bottom left
        this.walls.create(780, 676, 'space3') //bottom right
        this.walls.create(533, 385, 'space4') //middle

        
        this.player.setCollideWorldBounds(true);
        // This will work because we need null as the fourth parameter.
    
        this.physics.add.collider(this.player, this.walls, this.gameLost, null, this);
        // this.physics.add.collider(this.player, this.enemy, this.gameLost, null, this);

        this.physics.add.overlap(this.player, this.star, this.collectStar, null, this);

    }

    

    

    update() {
      // this.enemyFollows();

      this.buttonHandlers.update();
        if (!this.gamePad) {
                this.startGamePad();
            }
        if (this.started) {
            this.buttonHandlers.update();
            if (!this.gamePad) this.startGamePad(); 
        }
     
        

        if (this.gameOver && !this.sent) {
          eventsCenter.emit('stop_timer');
          eventsCenter.emit("game-end", this.victory);
          this.sent = true;
        };
    }


    startGamePad() {
        if (this.input.gamepad.total) {
      console.log('reachme 02');

            this.gamePad = this.input.gamepad.pad1;
            this.initGamePad();
            console.log(this.gamePad);
        }
    }


    initGamePad() {
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x < -.5, () => this.movePlayer(-1));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x > 0.5, () => this.movePlayer(1));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y > 0.5, () => this.movePlayer(-2));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y < -0.5, () => this.movePlayer(2));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.x === 0, () => this.movePlayer(0));
        this.buttonHandlers.addPad(() => this.gamePad.leftStick.y === 0, () => this.movePlayer(3));
      }


    movePlayer(x) {

        if (x === 2) {
          this.player.setVelocityY(-350);
        }
        if (x === -2) {
          this.player.setVelocityY(350);
        }
        if (x === -1) {
          this.player.setVelocityX(-350);
        }
        if (x === 1) {
          this.player.setVelocityX(350);
        }
        if (x === 0){
          this.player.setVelocityY(0);
          this.player.setVelocityX(0);
        }
    }


     enemyFollows (sec) {
      this.enemy.setVelocity(1);
      this.physics.moveToObject(this.enemy, this.player, 330);
    }

    gameLost () {
      this.gameOver = true;
      console.log('You Lose!')
    }
    

    collectStar (player, star) {
      this.star.setVisible(false); 
      this.victory = true;
      this.gameOver = true;
      console.log('You Win!')
    }        

}
