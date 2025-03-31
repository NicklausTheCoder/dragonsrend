import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        // Load button image (or use a text button)
        this.load.image('button', 'start.png');
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





      this.potion = this.add.image(30,this.cameras.main.height -150, 'master').setScale(0.7);
      this.potion = this.add.image(320, this.cameras.main.height -150, 'tanya').setScale(0.6);
  
      this.potion = this.add.image(180, 70, 'name').setScale(0.3);
        // Add title text
      
        // Create the button (using an image)
        const button = this.add.graphics()
        .fillStyle(0x4a6ea9, 1) // Deep blue color
        .fillRoundedRect(
            this.cameras.main.centerX - 100,
            this.cameras.main.centerY + 50,
            200, 80, 16 // x, y, width, height, radius
        )
        .setInteractive(
            new Phaser.Geom.Rectangle(
                this.cameras.main.centerX - 100,
                this.cameras.main.centerY + 50,
                200, 80
            ),
            Phaser.Geom.Rectangle.Contains
        );

    // 2. Add button text
    const buttonText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 90,
        'PLAY',
        {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#FFFFFF',
            stroke: '#1a2c42',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 0,
                stroke: true
            }
        }
    ).setOrigin(0.5);

    // 3. Add glow effect (using graphics)
    const glow = this.add.graphics()
        .fillStyle(0x7ab1f7, 0.3) // Lighter blue glow
        .fillRoundedRect(
            this.cameras.main.centerX - 110,
            this.cameras.main.centerY + 40,
            220, 100, 20 // Slightly larger than button
        );

    // 4. Add animations
    // Pulse glow effect
    this.tweens.add({
        targets: glow,
        scale: 1.05,
        alpha: 0.4,
        duration: 1500,
        yoyo: true,
        repeat: -1
    });




        
        // Add hover effects
        button.on('pointerover', () => {

    
        });
        
        button.on('pointerout', () => {
     
     
        });
        
        // Add click handler
        button.on('pointerdown', () => {
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