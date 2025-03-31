import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        // Load button image (or use a text button)
        this.load.image('startButton', 'start.png');
        this.load.image('bajin', 'baji.png');
        // Optional: Load sound for button click
        this.load.image('tanya', 'tanya.png');
        this.load.image('dragon1', 'dragon1.png');
        this.load.image('dragon2', 'dragon2.png');
        this.load.image('dragon3', 'dragon3.png');
        this.load.image('master', 'master.png');
        this.load.image('name', 'name.png');
    }

    create() {
        // Add background or styling
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





      this.potion = this.add.image(30, 600, 'master').setScale(1);
      this.potion = this.add.image(300, 500, 'tanya').setScale(0.8);
  
      this.potion = this.add.image(180, 70, 'name').setScale(0.3);
        // Add title text
      
        // Create the button (using an image)
        const startButton = this.add.image(200, 300, 'startButton')
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
                this.scene.start('StoryPanelScene');
            });
        });
    }
}