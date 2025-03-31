import Phaser from 'phaser';

export default class StoryPanelScene extends Phaser.Scene {
    constructor() {
        super('StoryPanelScene');
    }

    preload() {
        // Load button image (or use a text button)

        this.load.image('bajin', 'baji.png');
        // Optional: Load sound for button click
        this.load.image('master', 'master.png');

    }

    create() {
        // Add background or styling
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        
        this.background = this.add.tileSprite(
            0, 0,           // Top-left corner
            gameWidth,      // Match screen width
            gameHeight,     // Match screen height
            'bajin'           // Texture key
        )
        .setOrigin(0, 0);   // Align to top-left
        
        // Adjust tiling scale to prevent stretching
        this.background.setTileScale(
            gameWidth / 1200,   // Scale X
            gameHeight / 2000    // Scale Y
        );




        const panel = this.add.rectangle(50, 550, 500, 300, 0x333333 , 0.9)
        .setOrigin(0.5);
        this.potion = this.add.image(260, 500, 'master').setScale(0.8);
    // 3. Add your text - CHANGE THIS TEXT TO WHAT YOU WANT


    const fullText = 'The great dragon BAJIN has awakaned,And even more unfortunate it has threatened to destroy our town of ASAKUSA, I have chose you Sanjay!! Go find it and exterminate the vile beast';
    
    // Create an initially empty text object
    const text = this.add.text(150, 500, '', {
        font: '18px Arial',
        color: '#ffffff',
        align: 'center',
        wordWrap: {
            width: 250  // Maximum width in pixels before wrapping
        },
        align: 'left'
    }).setOrigin(0.5);

    // Start the typewriter effect
    this.typewriteText(text, fullText, 30);
    const button = this.add.text(120, 620, 'Continue', {
        fontFamily: 'Arial',  // Not 'font'
        fontSize: '32px',
        color: '#ffffff',     // Text color
        backgroundColor: '#050505', // Background color (shorter hex)
        padding: { 
            left: 20, 
            right: 20, 
            top: 10, 
            bottom: 10 
        },
        borderRadius: 65      // Number (not string)
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerover', () => {
        button.setBackgroundColor('#333333'); // Hover color
    })
    .on('pointerout', () => {
        button.setBackgroundColor('#050505'); // Default color
    })
    .on('pointerdown', () => {
   
            // Transition to GameScene
            this.cameras.main.fadeOut(500, 0, 0, 0); // Fade out effect
            
            // After fade completes, switch scene
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('tanyaradzwaScene');
            });
        // Your button action here
    });
       
    }

    typewriteText(textObj, content, speed) {
        let i = 0;
        textObj.setText(''); // Start empty
        
        // Create cursor separately
        const cursor = this.add.text(0, 0, '|', { 
            font: '18px Arial',
            color: '#ffffff'
        }).setVisible(false);
        
        const timer = this.time.addEvent({
            delay: speed,
            repeat: content.length - 1,
            callback: () => {
                textObj.setText(content.substring(0, i + 1));
                cursor.setPosition(textObj.getBottomRight().x + 5, textObj.y);
                cursor.setVisible(true);
                i++;
                
                // Blink cursor effect
                this.tweens.add({
                    targets: cursor,
                    alpha: 0,
                    duration: 400,
                    yoyo: true,
                    repeat: -1
                });
            },
            callbackScope: this
        });
        
        // When complete
        this.time.delayedCall(
            (content.length * speed) + 1000, // After typing + 1 second
            () => {
                cursor.destroy(); // Remove cursor
                // Optional: Add any completion effects here
            }
        );
    }
}