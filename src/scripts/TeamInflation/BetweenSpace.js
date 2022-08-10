export default class BetweenSpace extends Phaser.Scene {
    

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'BetweenSpace',
        });
  }

        preload(){
    this.load.spritesheet(this.load.image('background', new URL("./assets/spacePH.png",
        import.meta.url).href));
        this.load.spritesheet(this.load.image('rocket', new URL("./assets/rocketPH.png",
        import.meta.url).href));
        this.load.spritesheet(this.load.image('asteroid', new URL("./assets/asteroidspritesheet.png",
        import.meta.url).href));
        
    }

    create(){
    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, "background");
    this.player = this.physics.add.sprite(300,300, "rocket")
    this.asteroid = this.physics.add.sprite(400,400,'asteroid')
    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'walk',
        frames: [
            {key: 'frogs', frame: 0},
            {key: 'frogs', frame: 1},
            {key: 'frogs', frame: 2}
        ],
        frameRate: 12,
        repeat: -1
    });
    }

    update() {
        if (this.cursors.up.isDown) {
            this.player.y -= 5;
          }
          if (this.cursors.down.isDown) {
            this.player.y += 5;
          }
          if (this.cursors.left.isDown) {
            this.player.x -= 5;
          }
          if (this.cursors.right.isDown) {
            this.player.x += 5;
          }
        }
    }

    


