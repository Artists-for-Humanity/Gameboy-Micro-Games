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
        this.load.image(this.load.image('ground', new URL("./assets/FillerAssets/star.png",
        import.meta.url).href));
        this.load.image(this.load.image('dude', new URL("./assets/FillerAssets/bomb.png",
        import.meta.url).href));
        this.load.image(this.load.image('lose', new URL("./assets/youlose.png",
        import.meta.url).href));
        this.load.image(this.load.image('win', new URL("./assets/youwin.png",
        import.meta.url).href));

    }


    create() {
        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0x00000 }, fillStyle: { color: 0x1110ba } });
        this.player = this.physics.add.image(540, 10, 'dude');
        this.player.setGravityY(500);
        // this.lines =
        // new Phaser.Geom.Line(700, 200, 700, 400);
        // this.lines.add
        this.plat = this.physics.add.group();
        this.plat2 = this.physics.add.group();
        this.makeCircle('ground', 900, 30, this.plat);
        this.makeCircle('ground',1300, 10, this.plat2);
        // this.makeCircle('ground', 800, 30, this.plat)
        // this.plat.create(1000,500,'ground').setScale(2).refreshBody();
        this.loseText = this.add.image(540,360, 'lose').setVisible(false);
        this.winText = this.add.image(540,360,'win').setVisible(false);
        this.hole = this.physics.add.image(540, 500, 'dude').setVisible(false);
        this.physics.add.collider(this.player, this.hole, this.winState, null, this);

        this.points = 
        { x: 540, y: 500 }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.plat,this.loseState, null, this);
        this.physics.add.collider(this.player, this.plat2, this.loseState, null, this);



    }

    update() {  
        // this.graphics.clear();

        
        //  Phaser.Geom.Line.RotateAroundPoint(this.lines, this.points, 0.02);
    
        //     this.graphics.strokeLineShape(this.lines);
    
        //     this.graphics.fillPointShape(this.points, 10);
        
        Phaser.Actions.RotateAroundDistance(this.plat.getChildren(),this.points,0.02,200)
        Phaser.Actions.RotateAroundDistance(this.plat2.getChildren(),this.points,0.02,90)

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        }


}

    makeCircle(texture, radius, points, pointGroup) {
        let deg = 360/points;
        let sum = 0;
        for(var i = 0; i < points; i++) {
            if(sum/360 > 1) break;
            else { 
                let radianDeg = this.degrees_to_radians(sum);
                let xPos = radius * Math.sin(radianDeg);
                let yPos = radius * Math.cos(radianDeg);
                pointGroup.create(xPos,yPos, texture).setScale(1).refreshBody();
            }
            sum += deg;        
        }
    }
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
    loseState() {
        this.physics.pause();
        this.loseText.setVisible(true);

    }
    winState() {
        this.physics.pause();
        this.winText.setVisible(true);
    }
}