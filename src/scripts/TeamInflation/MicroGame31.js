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
        this.buttons = []
        this.selectedButtonIndex = 0


    }

    preload() {
        this.load.image("background", new URL("./assets/NGbackground.png", import.meta.url).href);
        this.load.image("Button01", new URL("./assets/Button01.png", import.meta.url).href);
        this.load.image("Button02", new URL("./assets/Button02.png", import.meta.url).href);
        this.load.image("Button03", new URL("./assets/Button03.png", import.meta.url).href);
        this.load.image("Button04", new URL("./assets/Button04.png", import.meta.url).href);
        this.load.image("Button05", new URL("./assets/Button05.png", import.meta.url).href);
        this.load.image("cursorimage", new URL("./assets/cursorimage.png", import.meta.url).href);
        this.load.image("Instructions", new URL("./assets/Instructionsim.png", import.meta.url).href);

    }

    create() {

        this.cursors = this.input.keyboard.createCursorKeys();

        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        // const { width, height } = this.scale
        // const playButton = this.add.image(gameWidth * -910, gameHeight * -365, "Button01")
		// .setDisplaySize(150, 50)   
        this.add.image(gameWidth / 2, gameHeight / 2, "background");
        this.equation1 = this.add.image(gameWidth - 540, gameHeight - 260, "Button01").setScale(0.68, 0.5);
        this.equation1.setInteractive();
        this.equation2 = this.add.image(gameWidth - 800, gameHeight - 100, "Button02").setScale(0.68, 0.5);
        this.equation2.setInteractive();
        this.equation3 = this.add.image(gameWidth - 800, gameHeight - 360, "Button03").setScale(0.68, 0.5);
        this.equation3.setInteractive();
        this.equation4 = this.add.image(gameWidth - 300, gameHeight - 360, "Button04").setScale(0.68, 0.5);
        this.equation4.setInteractive();
        this.equation5 = this.add.image(gameWidth - 300, gameHeight - 100, "Button05").setScale(0.68, 0.5);
        this.equation5.setInteractive();
        this.image = this.add.image(gameWidth - 540, gameHeight - 560, "Instructions").setScale(0.6, 0.5);

        this.buttonSelector = this.add.image(0.68, 0.5, "cursorimage").setScale(0.03, 0.03);
        
           

        this.buttons.push(this.equation1);
        this.buttons.push(this.equation2);
        this.buttons.push(this.equation3);
        this.buttons.push(this.equation4);
        this.buttons.push(this.equation5);


        this.selectButton(0)
       
        this.equation1.on('selected', () => {
            console.log('8x3 was selected')
        })   
        this.equation2.on('selected', () => {
            console.log('12 was selected')
        })   
        this.equation3.on('selected', () => {
            console.log('56+6 was selected')
        })   
        this.equation4.on('selected', () => {
            console.log('64 was selected')
        })   
        this.equation5.on('selected', () => {
            console.log('4x4 was selected')
        })   

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.equation1.off('selected')
            this.equation2.off('selected')
            this.equation3.off('selected')
            this.equation4.off('selected')
            this.equation5.off('selected')
        })
    }

    selectButton(index)
	{
		// TODO
        const currentButton = this.buttons[this.selectedButtonIndex]
        currentButton.setTint(0xffffff)
        const button = this.buttons[index]
        button.setTint(0x66ff7f)
        this.buttonSelector.x = button.x
        this.buttonSelector.y = button.y + 50
        console.log(this.buttonSelector)
        this.selectedButtonIndex = index
	}

	selectNextButton(change = 1)
	{
		let index = this.selectedButtonIndex + change
        if (index >= this.buttons.length)
        {
            index = 0
        }
        else if (index < 0)
        {
            index = this.buttons.length - 1
        }
        this.selectButton(index)

    }

	confirmSelection()
	{
		// TODO
        const button = this.buttons[this.selectedButtonIndex]
        button.emit('selected')
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
