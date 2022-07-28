export default class BewteenSpace extends Phaser.Scene {
    

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'BewteenSpace',
        });
  }

preload(){
    this.load.spritesheet(this.load.image('dude', new URL("./assets/FillerAssets/bomb.png",
        import.meta.url).href));
}

create() {
    this.player = this.physics.add.sprite(300,300, 'dude')
  


}

update() {
  
    
}


}


