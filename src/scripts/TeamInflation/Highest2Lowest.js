export default class MicroGame31 extends Phaser.Scene {
   

    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Highest2Lowest',
        });


        this.myText;
        this.buttons = [];
        this.selectedButtonIndex = 0;
        this.buttonValues = [64, 62, 60, 49, 28, 24, 16, 12, 4, 2];
        this.pickedButtonValue = [];
        // IMPORTANT! Make sure that buttonPosition, selectedValues, and buttons (after addButtons) have the same length!
        this.buttonPositions = Phaser.Utils.Array.Shuffle([
            [280, 620],
            [280, 360],
            [780, 360],
            [780, 620],
            [540, 469]
        ])
        this.selectedValues = [];
        this.gameOver = false;
        this.buttonImgNames = ['Button00', 'Button01', 'Button02', 'Button03', 'Button04','Button05', 'Button06', 'Button07', 'Button08', 'Button09'];
        this.answerSheet; 
        this.gameTime = 50;
        this.activeTime = false;
        this.currentTime = 0;
        this.text;
        
    }

    preload() {
        this.load.image("background", new URL("./assets/NGbackground.png",
            import.meta.url).href);
        this.load.image("Button00", new URL("./assets/Button00.png",
            import.meta.url).href);
        this.load.image("Button01", new URL("./assets/Button01.png",
            import.meta.url).href);
        this.load.image("Button02", new URL("./assets/Button02.png",
            import.meta.url).href);
        this.load.image("Button03", new URL("./assets/Button03.png",
            import.meta.url).href);
        this.load.image("Button04", new URL("./assets/Button04.png",
            import.meta.url).href);
        this.load.image("Button05", new URL("./assets/Button05.png",
            import.meta.url).href);
        this.load.image("Button06", new URL("./assets/Button06.png",
            import.meta.url).href);
        this.load.image("Button07", new URL("./assets/Button07.png",
            import.meta.url).href);
        this.load.image("Button08", new URL("./assets/Button08.png",
            import.meta.url).href);
        this.load.image("Button09", new URL("./assets/Button09.png",
            import.meta.url).href);

        this.load.image("cursorimage", new URL("./assets/cursorimage.png",
            import.meta.url).href);
        this.load.image("Instructions", new URL("./assets/Instructionsim.png",
            import.meta.url).href);
        
        this.load.image("loseimage", new URL("./assets/youlose.png",
            import.meta.url).href);
        this.load.image("winimage", new URL("./assets/youwin.png",
            import.meta.url).href);
        

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
        this.youLostImg = this.add.image(600, 480, "loseimage").setScale(1, 1).setVisible(false);
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

    update(time, delta) {
        
        if (!this.gameOver) {
            
        this.currentTime += delta;
        
        this.timer()

        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)


        if (upJustPressed) {
            this.selectNextButton(-1)
        } else if (downJustPressed) {
            this.selectNextButton(1)
        } else if (spaceJustPressed) {
            this.confirmSelection()
            const currentValue = this.selectedValues[this.selectedValues.length-1]
            const anwserValue = this.answerSheet[this.selectedValues.length - 1]
            
            this.gameOver = !(currentValue === anwserValue);
            if (this.selectedValues.length === this.pickedButtonValue.length) {
                this.checkList()
            }
        }
        this.gameIsOver()
        }
    }

    addImgToButtons() {

        for (let i = 0; i < this.buttonPositions.length; i++) {  
            let randomIndex = Phaser.Math.Between(0, this.buttonImgNames.length - 1)
            this.pickedButtonValue[i] = this.buttonValues.splice(randomIndex, 1)[0]
            this.buttons[i] = this.add.image(this.buttonPositions[i][0], this.buttonPositions[i][1], this.buttonImgNames.splice(randomIndex, 1)[0]).setScale(0.68, 0.5);
            this.buttons[i].setInteractive();
            
        }


        this.answerSheet = [...this.pickedButtonValue];
        this.answerSheet = this.answerSheet.sort((a,b)=>b-a)

    }

    selectButton(index) {

        const currentButton = this.buttons[this.selectedButtonIndex]
        currentButton.setTint(0xffffff)
        const button = this.buttons[index]
        button.setTint(0x66ff7f)
        this.buttonSelector.x = button.x
        this.buttonSelector.y = button.y + 50
        this.selectedButtonIndex = index
    }

    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change
        if (index >= this.buttons.length) {
            index = 0
        } else if (index < 0) {
            index = this.buttons.length - 1
        }
        this.selectButton(index);

    }

    confirmSelection() {

        const button = this.buttons[this.selectedButtonIndex]
        button.emit('selected')
    }


    checkList() {
        let result = true;
        for (let i = 0; i < this.selectedValues.length; i++) {

            if (this.selectedValues[i] != this.answerSheet[i]) {
                result = false
                break;
            }
        }
        if (result) {
            this.add.image(600, 480, "winimage");
        } else {
            this.gameOver = true;
        }
    }

    userInput() {

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].on('selected', () => {
                this.selectedValues.push(this.pickedButtonValue[i]);
            })
        }
    }
       
    timer() {
        if (this.activeTime === false) {

            this.gameTime -= 1;
            this.activeTime = true;
            this.currentTime = 0;
        }
        if (this.activeTime === true && this.currentTime > 1000) {
            this.currentTime -= 1000;
            this.activeTime = false;
        }
    }

    resetGame() {
        this.score = 0;
        this.gameTime = 50;
        this.gameOver = false;
    }

    gameIsOver(){
        if (this.gameTime === 0) {
            this.gameOver = true;
        }
        if (this.gameOver) {
            this.youLostImg.setVisible(true)

        }
    }
    setScoreText() {
        this.text.setText('Time: ' + this.gameTime)
    }
       
    setText(){}
}

