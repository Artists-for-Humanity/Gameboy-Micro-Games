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
        this.gameTime = 20;
        this.activeTime = false;
        this.currentTime = 0;
        this.text;
        this.winState = false;


        // an array of containers, each one will contain each equation 
        this.equations = [];
        // an array of sprites
        this.box = [];
        // an array of each equation's first operand, or just the number to be displayed
        this.num1 = []
        // tells us what operation to perform on each set of operands
        this.opcode = []
        // the second set of operands, value will be 0 if the index represents a number rather than an equation
        this.num2 = []
        // the resulting value of each equation, or a repeated number
        // should be used to compare value of each equation 
        this.evaluated = []
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

        this.load.spritesheet("frames", new URL("./assets/frames.png", import.meta.url).href,
        {   frameWidth: 1368/3, frameHeight: 329});
        this.load.spritesheet("numbers", new URL("./assets/numbers.png", import.meta.url).href,
        {frameWidth: 313 , frameHeight: 350});
        this.load.spritesheet("operations", new URL("./assets/operations.png", import.meta.url).href,
        {frameWidth: 1408/4 , frameHeight: 294 });

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

        this.anims.create({
            key: 'box',
            frames: [
                {key: 'frames', frame: 0},
                {key: 'frames', frame: 1},
                {key: 'frames', frame: 2}
            ],
            frameRate: 3,
            repeat: -1
        })

        this.setNumbers()

        this.fillBox(0, 1080/4, 720/2)

    
    }

    parseNumber(val){
        // represents the number in the hundreds place
        let hun = Math.floor(val/100) 
        // represents the number in the tens place
        let ten = Math.floor((val - (hun * 100))/ 10)
        // represents the number in the ones place
        let one = val % 10

        console.log("Hundreds: " + hun +"\nTens: "+ ten + "\nOnes: " + one + "\nTotal: "+ val)

        let hto = [hun, ten, one]

        return hto
    }


    // creates a visual button for each equation
    fillBox(i, x, y){
        let placement = 0
        // example code that shows how to add containers to this.equations[]
        this.equations[i] = this.add.container(x, y)
        this.box[i] = this.physics.add.sprite(x, y, 'frames')
        this.box[i].setScale(1, 0.5)

        if(this.opcode[i] !== 0){
            placement = -1084/1.75
            // add an operator
            this.equations[i].add(this.add.image(0, 0, 'operations', this.opcode[i]))
            // add a second operand

            this.addNumbers(this.equations[i], this.num2[i], 1084/3.5, i, 2)
        }
        
        // add first operand to equations
        this.addNumbers(this.equations[i], this.num1[i], placement, i, 1)
        

        // containers can be rescaled conveniently
        this.equations[i].setScale(.2)
    }

    // Helper function that takes numbers parsed in parseNumber and adds them as images to a container
    addNumbers(equation, val, offset, index, operand){
        let nums = this.parseNumber(val)
        let addset = 300

        if(index === 0 && nums[0] !== 0){
            equation.add(this.add.image(-300+ offset, 0, 'numbers', nums[0]))
        }
        if(nums[1] !== 0){
            equation.add(this.add.image(0+ offset, 0, 'numbers', nums[1]))
        }
        if(val < 10 && operand === 2){
            addset = 0
        }
        equation.add(this.add.image(addset+ offset, 0, 'numbers', nums[2]))
    }

    // sets values of num1, num2, opcode and evaluated arrays for use in equations
    setNumbers(){
        for(let i = 0; i < 5; i++){
            this.opcode[i] = Math.round(Math.random()*4)
            // if opcode is 0, no operation is needed, just the raw number
            if(this.opcode[i] === 0){
                this.num1[i] = Math.round(Math.random()*999)
                this.num2[i] = 0
                this.evaluated[i] = this.num1[i]
            }
            // all other opcodes result in equations
            else{
                this.rollNumbers(i)
                this.equateNumbers(this.opcode[i], i)
            }
        }

    }

    // records the result of generated equations in this.evaluated[]
    equateNumbers(opcode, index){
        switch(opcode){
            case 1: // addition
                this.evaluated[index] = this.num1[index]+this.num2[index]
                console.log(this.num1[index]+" + " + this.num2[index] + " = " + this.evaluated[index]+ ", OPCODE: " + this.opcode[index])
                break;
            case 2: // subtraction
                this.evaluated[index] = this.num1[index]-this.num2[index]
                console.log(this.num1[index]+" - " + this.num2[index] + " = " + this.evaluated[index]+ ", OPCODE: " + this.opcode[index])
                break;
            case 3: // multiplication
                this.evaluated[index] = this.num1[index]*this.num2[index]
                console.log(this.num1[index]+" * " + this.num2[index] + " = " + this.evaluated[index]+ ", OPCODE: " + this.opcode[index])
                break;
            case 4: // division
                this.evaluated[index] = this.num1[index]/this.num2[index]
                console.log(this.num1[index]+" / " + this.num2[index] + " = " + this.evaluated[index]+ ", OPCODE: " + this.opcode[index])
                break;
            default: // default is addition
                this.evaluated[index] = this.num1[index]+this.num2[index]
                console.log(this.num1[index]+" + " + this.num2[index] + " = " + this.evaluated[index] + ", OPCODE: " + this.opcode[index])
                break;
        }
    }

    // randomly generates numbers for equations
    rollNumbers(index){
        this.num1[index] = Math.round(Math.random()*99)
        // range for num2 is 1-99 to avoid division by 0
        this.num2[index] = Math.round(Math.random()*98) + 1
    }


    update(time, delta) {
        
        if (!this.gameOver && this.gameTime > 0) {
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
            
            if ( (this.gameOver || this.gameTime <= 0)  && !this.winState) { 
                this.youLostImg.setVisible(true)
                this.gameOver = true; 
                }
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
            this.gameOver = true;
            this.winState = true;
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

    // gameIsOver(){
    //     if (this.gameTime === 0) {
    //         this.gameOver = true;
    //     }
    //     if (this.gameOver) {

    //         this.youLostImg.setVisible(true)

    //     }
    // }
    setScoreText() {
        this.text.setText('Time: ' + this.gameTime)
    }
       
    setText(){}
}

