import Phaser from 'phaser';

export default class tanyaradzwaScene extends Phaser.Scene {
    constructor() {
        super('tanyaradzwaScene');
    }

    preload() {
        // Load button image (or use a text button)

        this.load.image('millitary', 'town.jpg');
        // Optional: Load sound for button click
        this.load.image('tanya', 'tanya.png');

    }

    create() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const imgWidth = 500;   // Original image width
        const imgHeight = 888;  // Original image height
    
        // Calculate scale to COVER the screen (no empty areas)
        const scaleX = gameWidth / imgWidth;
        const scaleY = gameHeight / imgHeight;
        const scale = Math.max(scaleX, scaleY); // Ensures full coverage
    
        // Create the background (centered)
        this.background = this.add.tileSprite(
            gameWidth / 2,      // Center X
            gameHeight / 2,     // Center Y
            imgWidth,           // Original width (500)
            imgHeight,          // Original height (888)
            'millitary'      // Key of the loaded image
        )
        .setScale(scale)        // Apply the correct scale
        .setOrigin(0.5, 0.5);  // Center the sprite
    


        const panel = this.add.rectangle(50, 220, 500, 300, 0x333333 , 0.9)
        .setOrigin(0.5);
        this.potion = this.add.image(260, 500, 'tanya').setScale(0.8);

    const fullText = 'My name is Sanjay Kurosaki, I trained my entire life to be a dragon hunter. Since its the modern world we use what we can, Master Shifu has given me the task to hunt the legendary dragon BAJIN THE ENDER';
    
    // Create an initially empty text object
    const text = this.add.text(150, 200, '', {
        font: '18px Arial',
        color: '#ffffff',
           align: 'left',
        wordWrap: { width: 250 }
    }).setOrigin(0.5);

    // Start the typewriter effect
    this.typewriteText(text, fullText, 30);
    const button = this.add.text(120, 320, 'Continue', {
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
                this.scene.start('GameScene');
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