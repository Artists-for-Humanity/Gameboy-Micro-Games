export default class BewteenSpace extends Phaser.Scene {
    

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'BewteenSpace',
        });
  }

preload(){
    this.load.spritesheet(this.load.image('background', new URL("./assets/spacePH.png",
        import.meta.url).href));
        this.load.spritesheet(this.load.image('rocket', new URL("./assets/rocketPH.png",
        import.meta.url).href));
}

create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.gameWidth = this.game.config.width;
    this.gameHeight = this.game.config.height;

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');
    this.player = this.physics.add.sprite(300,300, "rocket")
    


}

update() {
  
    
}


}


