import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        // Load button image (or use a text button)
        this.load.image('startButton', 'start.png');
        this.load.image('dead', 'death.jpg');
        // Optional: Load sound for button click
        this.load.image('dragon1', 'dragon1.png');
        this.load.image('dragon2', 'dragon2.png');
        this.load.image('dragon3', 'dragon3.png');
    }

    create() {
        // Add background or styling
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const imgWidth = 360;   // Original image width
        const imgHeight = 600;  // Original image height
    
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
            'dead'      // Key of the loaded image
        )
        .setScale(scale)        // Apply the correct scale
        .setOrigin(0.5, 0.5);  // Center the sprite
    



 

        // Add title text
        this.add.text(200, 300, 'Game Over', { 
            fontSize: '44px', 
            fontStyle: 'Bold',
            color: '#fff' 
        }).setOrigin(0.5);
        this.add.text(200, 400, 'After losing their greatest flier, Walcheria was at risk.\nAs fate would have it, the dragon later destroyed the kingdom.', { 
            fontSize: '14px', 
            fontStyle: 'bold',
            color: '#fff',
            wordWrap: { 
                width: 350  // Maximum width in pixels before wrapping
            },
            align: 'center' // Optional: center alignment
        }).setOrigin(0.5);

        // Create the button (using an image)
        const startButton = this.add.image(200, 500, 'startButton')
            .setInteractive() // Make it interactive
            .setScale(0.2); // Optional: Scale it down
        
        // Add hover effects
        startButton.on('pointerover', () => {
            startButton.setScale(0.22);
            startButton.setTint(0xcccccc); // Lighten the button
        });
        
        startButton.on('pointerout', () => {
            startButton.setScale(0.2);
            startButton.clearTint();
        });
        
        // Add click handler
        startButton.on('pointerdown', () => {
            // Play click sound if you loaded one
            // this.sound.play('clickSound');
            
            // Transition to GameScene
            this.cameras.main.fadeOut(500, 0, 0, 0); // Fade out effect
            
            // After fade completes, switch scene
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('StartScene');
            });
        });
    }
}