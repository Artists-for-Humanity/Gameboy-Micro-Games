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
        this.load.image(this.load.image('jump', new URL("./assets/Jump.png",
            import.meta.url).href));
        this.load.spritesheet("ball", new URL("./assets/diamond.png",
            import.meta.url).href, {
            frameWidth: 46,
            frameHeight: 38
        });


    }


    create() {
        this.graphics = this.add.graphics({
            lineStyle: {
                width: 4,
                color: 0x00000
            },
            fillStyle: {
                color: 0x1110ba
            }
        });
        this.player = this.physics.add.image(540, 10, 'ground');
        this.player.setGravityY(500);
        this.blue = this.add.sprite(100, 100, "ball");
        // this.lines =
        // new Phaser.Geom.Line(700, 200, 700, 400);
        // this.lines.add
        // this.plat = this.physics.add.group();
        // this.plat2 = this.physics.add.group();
        // this.makeCircle('ground', 900, 30, this.plat);
        // this.makeCircle('ground',1300, 10, this.plat2);
        // this.makeCircle('ground', 800, 30, this.plat)
        // this.plat.create(1000,500,'ground').setScale(2).refreshBody();


        this.points = {
            x: 540,
            y: 500
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        // this.physics.add.collider(this.player, this.plat2, this.loseState, null, this);

        const circle = new Phaser.Geom.Circle(540, 500, 220);
        const circle2 = new Phaser.Geom.Circle(540, 500, 220);

        this.groupS = this.physics.add.group();
        this.groupB = this.physics.add.group();
        for (var i = 0; i < 11; i++) {
            this.groupS.create(0, 0, 'ball')
        }
        for (var i = 0; i < 5; i++) {
            this.groupB.create(0, 0, 'ball');
        }

        this.loseText = this.add.image(540, 360, 'lose').setVisible(false);
        this.winText = this.add.image(540, 360, 'win').setVisible(false);
        this.hole = this.physics.add.image(540, 500, 'ground').setVisible(true);
        this.physics.add.collider(this.player, this.hole, this.winState, null, this);
        this.physics.add.collider(this.player, this.groupS, this.loseState, null, this);
        this.physics.add.collider(this.player, this.groupB, this.loseState, null, this);



        Phaser.Actions.PlaceOnCircle(this.groupS.getChildren(), circle);
        Phaser.Actions.PlaceOnCircle(this.groupB.getChildren(), circle2);

        this.physics.pause();
        this.JumpImg = this.add.image(505, 360, 'jump').setScale(1.3);
        this.startGameDelay = this.time.delayedCall(2300, this.startGame, null, this);
        console.log('reachme 00');
        this.createAnimation();








    }

    update() {
        this.blue.anims.play('walk');
        console.log('reachme 02')
        // this.graphics.clear();


        //  Phaser.Geom.Line.RotateAroundPoint(this.lines, this.points, 0.02);

        //     this.graphics.strokeLineShape(this.lines);

        //     this.graphics.fillPointShape(this.points, 10);
        Phaser.Actions.RotateAroundDistance(this.groupS.getChildren(), this.points, 0.02, 200)
        Phaser.Actions.RotateAroundDistance(this.groupB.getChildren(), this.points, 0.02, 70)

        // Phaser.Actions.RotateAroundDistance(this.plat2.getChildren(),this.points,0.02,60)



        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        }
        Phaser.Actions.Call(this.groupB.getChildren(), child => {
            child.anims.play('walk');
        });

        
    }

    makeCircle(texture, radius, points, pointGroup) {
        let deg = 360 / points;
        let sum = 0;
        for (var i = 0; i < points; i++) {
            if (sum / 360 > 1) break;
            else {
                let radianDeg = this.degrees_to_radians(sum);
                let xPos = radius * Math.sin(radianDeg);
                let yPos = radius * Math.cos(radianDeg);
                pointGroup.create(xPos, yPos, texture).setScale(1).refreshBody();
            }
            sum += deg;
        }
    }
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
    loseState() {
        this.physics.pause();
        this.loseText.setVisible(true);

    }
    winState() {
        this.physics.pause();
        this.winText.setVisible(true);
        this.hole.destroy();
    }
    startGame() {
        this.JumpImg.destroy();
        this.physics.resume();

    }

    createAnimation() {
        console.log('reachme 01');
        this.anims.create({
            key: 'walk',
            frames: [{
                    key: 'ball',
                    frame: 0
                },
                {
                    key: 'ball',
                    frame: 1
                },
                {
                    key: 'ball',
                    frame: 2
                }
            ],
            frameRate: 12,
            repeat: -1
        });
        console.log('reachme 03');

    }
}