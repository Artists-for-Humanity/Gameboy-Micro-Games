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
        this.buttons = [];
        this.selectedButtonIndex = 0;
        // TODO swap buttonValues order
        this.buttonValues = [2, 4, 12, 16, 24, /*28, 49, 60, 62, 64*/];
        // IMPORTANT! Make sure that buttonPosition, selectedValues, and buttons (after addButtons) have the same length!
        this.buttonPositions = Phaser.Utils.Array.Shuffle([[280,620], [280, 360], [780,360], [780,620], [540, 469]])
        this.selectedValues = [];
        this.gameOver = false;
        this.answerSheet = ['Button09', 'Button08', 'Button07', 'Button06', 'Button05'];
        //this.selectedValues = Phaser.Utils.Array.Shuffle(this.selectedValues)
    }

    preload() {
        this.load.image("background", new URL("./assets/NGbackground.png", import.meta.url).href);
        this.load.image("Button00", new URL("./assets/Button00.png", import.meta.url).href);
        this.load.image("Button01", new URL("./assets/Button01.png", import.meta.url).href);
        this.load.image("Button02", new URL("./assets/Button02.png", import.meta.url).href);
        this.load.image("Button03", new URL("./assets/Button03.png", import.meta.url).href);
        this.load.image("Button04", new URL("./assets/Button04.png", import.meta.url).href);
        this.load.image("Button05", new URL("./assets/Button05.png", import.meta.url).href);
        this.load.image("Button06", new URL("./assets/Button06.png", import.meta.url).href);
        this.load.image("Button07", new URL("./assets/Button07.png", import.meta.url).href);
        this.load.image("Button08", new URL("./assets/Button08.png", import.meta.url).href);
        this.load.image("Button09", new URL("./assets/Button09.png", import.meta.url).href);

        this.load.image("cursorimage", new URL("./assets/cursorimage.png", import.meta.url).href);
        this.load.image("Instructions", new URL("./assets/Instructionsim.png", import.meta.url).href);

    }

    create() {
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.gameWidth = this.game.config.width;
        this.gameHeight = this.game.config.height;

        this.add.image(this.gameWidth / 2, this.gameHeight / 2, "background");
        
        this.image = this.add.image(this.gameWidth - 540, this.gameHeight - 560, "Instructions").setScale(0.6, 0.5);
   

        this.buttons.push(this.equation00);
        this.buttons.push(this.equation01);
        this.buttons.push(this.equation02);
        this.buttons.push(this.equation03);
        this.buttons.push(this.equation04);

        this.addImgToButtons();
        this.buttonSelector = this.add.image(0.68, 0.5, "cursorimage").setScale(0.07, 0.07);
        this.userInput();
        this.selectButton(0);
       
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.equation00.off('selected');
            this.equation01.off('selected');
            this.equation02.off('selected');
            this.equation03.off('selected');
            this.equation04.off('selected');
        })
    }
    
    addImgToButtons(){

        for (let i = 0; i < this.buttonPositions.length; i++) {
            this.buttons[i] =  this.add.image(this.buttonPositions[i][0], this.buttonPositions[i][1], this.answerSheet[i]).setScale(0.68, 0.5);
            this.buttons[i].setInteractive();
        }
        
    }

    selectButton(index)
	{
		
        const currentButton = this.buttons[this.selectedButtonIndex]
        currentButton.setTint(0xffffff)
        const button = this.buttons[index]
        button.setTint(0x66ff7f)
        this.buttonSelector.x = button.x
        this.buttonSelector.y = button.y + 50
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
        this.selectButton(index);

    }

	confirmSelection()
	{
		
        const button = this.buttons[this.selectedButtonIndex]
        button.emit('selected')
	}

    update() {
        
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

    checkList(){
        console.log(this.selectedValues)
        let result = true;
        for (let i = 0; i < this.selectedValues.length; i++) {
            if (this.selectedValues[i] != this.buttonValues[i]) {
                result = false
                break;
            }
        }
        if (result) {
            console.log("You won!")
        }
        else {
            console.log("You lost!")
        }
    }

    userInput() {

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].on('selected', () => {
                this.selectedValues.push(this.buttonValues[i]);
                if (this.selectedValues.length === this.answerSheet.length) this.checkList();
            }) 
            
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

// add math logic, for winning and losing conditions  
