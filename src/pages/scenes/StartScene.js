import Phaser from 'phaser';
import * as uiWidgets from 'phaser-ui-tools';
import { TextSprite } from 'phaser-ui-tools'; // Make sure to import it

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        // Load button image (or use a text button)
        this.load.image('button', 'buttonstart.png');
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
      const gameWidth = this.scale.width;
      const gameHeight = this.scale.height;
      
      // 1. Create the background
      this.background = this.add.tileSprite(
          0, 0,                    // Position at top-left
          gameWidth,               // Use dynamic width
          gameHeight,              // Use dynamic height
          'bajin'                  // Your texture key
      )
      .setOrigin(0, 0)             // Anchor to top-left
      .setScrollFactor(0)          // Optional: Make static for parallax
      .setDepth(-1);               // Send to back
      
      // 2. PERFECT scaling for all screen sizes
      const texture = this.textures.get('bajin');
      const scaleX = gameWidth / texture.getSourceImage().width;
      const scaleY = gameHeight / texture.getSourceImage().height;
      
      this.background
          .setTileScale(scaleX, scaleY)  // Match screen exactly
          .setTilePosition(0, 0);        // Reset any offset


      const button = this.add.image(    this.cameras.main.centerX,
        this.cameras.main.centerY + 90, 'button')
        .setInteractive()
        .setScale(0.4); // Resize if needed
        const buttonstore = this.add.image(    this.cameras.main.centerX,
            this.cameras.main.centerY + 170, 'button')
            .setInteractive()
            .setScale(0.4); // Resize if needed


            const buttonexit = this.add.image(    this.cameras.main.centerX,
                this.cameras.main.centerY + 250, 'button')
                .setInteractive()
                .setScale(0.4); // Resize if needed
        // Add title text
      
        // Create the button (using an image)
       
    // 2. Add button text
    const buttonText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 90,
        'PLAY',
        {
            fontFamily: 'Arial',
            fontSize: '26px',
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
    const buttonExit = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 250,
        'EXIT',
        {
            fontFamily: 'Arial',
            fontSize: '26px',
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

    const buttonstoreText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 170,
        'STORE',
        {
            fontFamily: 'Arial',
            fontSize: '26px',
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

    // 4. Add animations
    // Pulse glow effect
    const pulseTween =   this.tweens.add({
        targets: button, // Array of targets
        scale: 0.5,

        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'     
    });

    const pulseTweenexit =   this.tweens.add({
        targets:buttonexit, // Array of targets
        scale: 0.5,

        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'     
    });

    const pulseTweenstore =   this.tweens.add({
        targets: buttonstore, // Array of targets
        scale: 0.5,

        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'     
    });



        
        // Add hover effects
        button.on('pointerover', () => {
            pulseTween.pause(); // Pause the animation
    
            // Optional: Immediate scale reset
            button.setScale(0.5);
            buttonText.setScale(1);
    
        });
        buttonexit.on('pointerover', () => {
            pulseTweenexit.pause(); // Pause the animation
    
            // Optional: Immediate scale reset
            button.setScale(0.5);
            buttonText.setScale(1);
    
        });
        buttonstore.on('pointerover', () => {
            pulseTweenstore.pause(); // Pause the animation
    
            // Optional: Immediate scale reset
            button.setScale(0.5);
            buttonText.setScale(1);
    
        });
        
        button.on('pointerout', () => {
            pulseTween.resume(); 
     
        });
        buttonexit.on('pointerout', () => {
            pulseTweenexit.resume(); 
     
        });
        buttonstore.on('pointerout', () => {
            pulseTweenstore.resume(); 
     
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
        buttonexit.on('pointerdown', () => {
            // Play click sound if you loaded one
            // this.sound.play('clickSound');
            
            // Transition to GameScene
            this.cameras.main.fadeOut(500, 0, 0, 0); // Fade out effect
            
            // After fade completes, switch scene
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.closeGame();
            });
        });
        buttonstore.on('pointerdown', () => {
            // Play click sound if you loaded one
            // this.sound.play('clickSound');
            
            // Transition to GameScene
            this.cameras.main.fadeOut(500, 0, 0, 0); // Fade out effect
            
            // After fade completes, switch scene
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('storeScene');
            });
        });
    }


    closeGame() {
        // Platform-specific closing
        if (navigator.app && navigator.app.exitApp) {
            // Cordova/PhoneGap
            navigator.app.exitApp();
        } else if (window.cordova && window.cordova.plugins.Exit) {
            // Cordova with Exit plugin
            window.cordova.plugins.Exit.exit();
        } else if (window.cordova) {
            // Generic Cordova fallback
            navigator.app.exitApp();
        } else if (window.electron) {
            // Electron apps
            window.electron.ipcRenderer.send('close-window');
        } else {
            // Web browsers - can't truly close, so go to home page
            window.location.href = 'about:blank';
            
            // Or for a better UX in browsers:
            this.scene.stop();
            document.getElementById('game-container').style.display = 'none';
            document.body.innerHTML = '<h1>Thanks for playing!</h1>';
        }
    }
}

