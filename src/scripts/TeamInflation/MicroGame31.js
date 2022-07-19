export default class MicroGame31 extends Phaser.Scene {
    // Game Class Constructor
    
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'MicroGame31',
        });

        // Game Object Declarations
        this.myText;

    }

    preload() {
        this.load.image("background", new URL("./assets/NGbackground.png", import.meta.url).href);
        this.load.image("Button01", new URL("./assets/Button01.png", import.meta.url).href);
        this.load.image("Button02", new URL("./assets/Button02.png", import.meta.url).href);
        this.load.image("Button03", new URL("./assets/Button03.png", import.meta.url).href);
        this.load.image("Button04", new URL("./assets/Button04.png", import.meta.url).href);
        this.load.image("Button05", new URL("./assets/Button05.png", import.meta.url).href);

        
    }

    create() {
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        const { width, height } = this.scale
        const playButton = this.add.image(width * -910, height * -365, "Button01")
		//.setDisplaySize(150, 50)   
        this.add.image(gameWidth / 2, gameHeight / 2, "background");
        this.button = this.add.image(gameWidth - 910, gameHeight - 365, "Button01").setScale(0.68, 0.5);
        this.button.setInteractive();
        this.button = this.add.image(gameWidth - 980, gameHeight - 365, "Button02").setScale(0.68, 0.5);
        this.button.setInteractive();
        this.button = this.add.image(gameWidth - 910, gameHeight - 95, "Button03").setScale(0.68, 0.5);
        this.button.setInteractive();
        this.button = this.add.image(gameWidth - 900, gameHeight - 565, "Button04").setScale(0.68, 0.5);
        this.button.setInteractive();
        this.button = this.add.image(gameWidth - 600, gameHeight - 365, "Button05").setScale(0.68, 0.5);
        this.button.setInteractive();

               
        //this.setText();
    }

    update() {
        // 
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

        if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
		else if (spaceJustPressed)
		{
			this.confirmSelection()
		}
		//
		if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
		else if (spaceJustPressed)
		{
			this.confirmSelection()
		}
    }

    setText() {
        // this.myText = this.add.text(400, 360, '')
        // this.myText.setStyle({
        //     fontSize: '100px',
        //     fill: '#000000',
        //     align: 'center',
        // });
        // this.myText.setText('TeamInflation');
    }
}

// create buttons objects for selection 
// Add keyboard for user input
// add math logic, for winning and losing conditions  
