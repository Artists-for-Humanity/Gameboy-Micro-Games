export default class CircleGame extends Phaser.Scene {
    // Game Class Constructor
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'CircleGame',
        });

        
    

    }

    preload() {
        this.load.image(this.load.image('ground', new URL("./assets/FillerAssets/platform.png",
        import.meta.url).href));
    }


    create() {
        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } });

        this.lines =
        new Phaser.Geom.Line(700, 200, 700, 400)

        this.points = 
        { x: 400, y: 300 }
    }

    update() {  
        this.graphics.clear();

        
         Phaser.Geom.Line.RotateAroundPoint(this.lines, this.points, 0.02);
    
            this.graphics.strokeLineShape(this.lines);
    
            this.graphics.fillPointShape(this.points, 10);

}
}