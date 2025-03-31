import Phaser from 'phaser';

// uiScene.js
export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
    }

    create(data) {
        // Create popup background (covers whole screen)
        const bg = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        ).setInteractive(); // Makes whole area clickable

        // Main popup panel
        const panel = this.add.rectangle(200, 300, 500, 300, 0x333333)
            .setOrigin(0.5);

        // Popup content
        this.add.image(200, 230, 'potion').setScale(0.3);
        const text = this.add.text(200, 300, 
            'The Wizard has blessed you with a mighty potion...', 
            {
                font: '18px Arial',
                color: '#ffffff',
                wordWrap: { width: 250 },
                align: 'center'
            }
        ).setOrigin(0.5);

        // Buttons
        const drinkButton = this.createButton(90, 400, 'Drink', '#228822', () => {
            this.cleanup();
            this.scene.get('GameScene').extraLifeFunction(); // Call game scene function
        });

        const declineButton = this.createButton(250, 400, 'Decline', '#882222', () => {
            this.cleanup();
            // Get reference to the active plane from GameScene
            const gameScene = this.scene.get('GameScene');
            gameScene.startGameOver(gameScene.plane); // Pass the plane object
        });
        // Store references for cleanup
        this.popupElements = { bg, panel, text, drinkButton, declineButton };
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.text(x, y, text, {
            font: '32px Arial',
            color: '#ffffff',
            backgroundColor: color,
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        // Hover effects
        btn.on('pointerover', () => btn.setBackgroundColor('#aaaaaa'));
        btn.on('pointerout', () => btn.setBackgroundColor(color));
        btn.on('pointerdown', callback);

        return btn;
    }

    cleanup() {
        // Destroy all popup elements
        Object.values(this.popupElements).forEach(obj => obj.destroy());
        this.scene.stop(); // Close the popup scene
    }
}
