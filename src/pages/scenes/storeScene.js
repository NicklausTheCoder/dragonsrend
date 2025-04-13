import Phaser from 'phaser';

export default class StoreScene extends Phaser.Scene {
    constructor() {
        super('storeScene');
        this.selectedSkin = null;
        this.playerBalance = 100; // Starting with $100 for demo purposes
        this.selectedSkin = 1;
        this.skinButtons = []; // Store all button references
        this.gameData = {
            unlockedSkins: {
                skin1: true,  // Fire Dragon (starter skin)
                skin2: false, // Ice Dragon (locked initially)
                skin3: false,
                skin4: false, // Chopper (locked initially)
            }
        };
    }
    init() {
        // Load progress
        const savedData = localStorage.getItem('dragonGameData');
        if (savedData) {
            this.gameData = JSON.parse(savedData);
        } else {
            this.gameData = {
                unlockedSkins: { skin1: true },
                balance: 100
            };
        }
    }
    preload() {
        this.load.image('background', 'storebg.jpg');
        this.load.image('backButton', 'buttonstart.png');


        // Load all coin frames (Gold_11.png to Gold_20.png)
        for (let i = 11; i <= 20; i++) {
            this.load.image(`coin${i}`, `Gold_${i}.png`);
        }

        // Load skin preview images
        this.load.image('skin1', 'dragon1.png');
        this.load.image('skin2', 'ultimatedragon2.png');
        this.load.image('skin3', 'helicopter_1.png');
        this.load.image('skin4', 'frame_00_delay-0.03s.gif');
    }

    create() {
        // Background setup
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'background')
            .setDisplaySize(width, height);

        // Store title
        this.add.text(width / 5, 10, 'DRAGON SKIN STORE', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.1);

        // Player balance display




        this.coin = this.add.sprite(width / 2.6, 68, 'coin11')
            .setScale(0.05)
            .setDepth(10);
        this.anims.create({
            key: 'coinSpin',
            frames: Array.from({ length: 10 }, (_, i) => ({
                key: `coin${i + 11}`,
                frame: null
            })),
            frameRate: 10,  // 10 FPS (1 full spin per second)
            repeat: -1      // Infinite loop
        });

        // Play the animation
        this.coin.play('coinSpin');
        this.balanceText = this.add.text(width / 2.3, 53, `$${this.playerBalance}`, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF'
        });

        // Back button
        const backButton = this.add.image(80, height - 50, 'backButton')
            .setInteractive()
            .setScale(0.3);

        const backButtontext = this.add.text(80, height - 50, 'Back', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#FFFFFF'

        }).setOrigin(0.5)
            .setScale(1);


        backButton.on('pointerdown', () => {
            this.scene.start('StartScene');
        });

        // Skin items
        const skins = [
            {
                id: 1,
                name: 'Fire Dragon',
                price: 3,
                image: 'skin1',
                locked: true, // Removed duplicate 'locked' property
                scale: 0.7,
                yOffset: 10
            },
            {
                id: 2,
                name: 'Ice Dragon',
                price: 4,
                image: 'skin2',
                locked: !this.gameData.unlockedSkins.skin2,
                scale: 0.7,
                yOffset: 10
            },
            {
                id: 3,
                name: 'Chopper',
                price: 5,
                image: 'skin3',
                locked: !this.gameData.unlockedSkins.skin3,
                scale: 1.2, // Special scale for Chopper
                yOffset: -15 // Special offset for Chopper
            },
            {
                id: 4, // Changed from duplicate id 3 to 4
                name: 'Cloudy BG',
                price: 5,
                image: 'skin4',
                locked: !this.gameData.unlockedSkins.skin4,
                scale: 0.1,
                yOffset: 10
            }
        ];


        // Create skin display grid
        this.createSkinGrid(skins);
    }

    createSkinGrid(skins) {
        const { width, height } = this.scale;
        const cols = 2;
        const itemWidth = width / (cols + 1);
        const startY = 150;

        skins.forEach((skin, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;

            const x = itemWidth * (col + 1);
            const y = startY + (row * 250);

            // Skin image
            const skinImage = this.add.image(x, y + 20, skin.image)
                .setInteractive()
                .setScale(skin.scale || (skin.name === 'Chopper' ? 1.2 : 0.9));

            // Special case for Chopper (if not using skin.scale property)
            if (skin.name === 'Chopper' && !skin.scale) {
                skinImage.y -= 15;
            }

            // Skin name
            this.add.text(x, y + 70, skin.name, {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#FFFFFF',
                align: 'center'
            }).setOrigin(0.5);

            // Price
            const priceText = this.add.text(x, y + 120, `$${skin.price}`, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#FFD700'
            }).setOrigin(0.5);

            // Buy/Select button
            const button = this.add.rectangle(x, y + 170, 120, 40, 0x1a65ac)
                .setInteractive()
                .setStrokeStyle(2, 0xFFFFFF);

            const buttonText = this.add.text(x, y + 170, skin.locked ? 'BUY' : 'SELECT', {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#FFFFFF'
            }).setOrigin(0.5);

            // Highlight selected skin
            if (this.selectedSkin === skin.id) {
                button.setFillStyle(0x00aa00);
                buttonText.setText('SELECTED');
            }

            // Button interactions
            skinImage.on('pointerover', () => {
                if (skin.name === 'Cloudy BG') {
                    skinImage.setScale(0.12); // Smaller hover scale for Cloudy BG
                } else {
                    skinImage.setScale(1); // Default hover effect
                }
            });

            skinImage.on('pointerout', () => {
                if (skin.name === 'Cloudy BG') {
                    skinImage.setScale(0.1); // Smaller hover scale for Cloudy BG
                } else {
                    skinImage.setScale(0.9); // Default hover effect
                }
            });

            button.on('pointerover', () => {
                button.setFillStyle(0x2a75cc);
            });

            button.on('pointerout', () => {
                button.setFillStyle(this.selectedSkin === skin.id ? 0x00aa00 : 0x1a65ac);
            });

            button.on('pointerdown', () => {
                if (skin.locked) {
                    this.purchaseSkin(skin);
                } else {
                    this.selectSkin(skin.id, button, buttonText);
                }
            });

            const buttonData = {
                skinId: skin.id,
                button,
                buttonText,
                priceText,
                skinImage,
                locked: skin.locked
            };
            this.skinButtons.push(buttonData);
        });
    }

    purchaseSkin(skin) {
        if (this.playerBalance >= skin.price) {
            // Deduct price
            this.playerBalance -= skin.price;
            this.balanceText.setText(`$${this.playerBalance}`);

            // Unlock the skin
            this.updateSkinButton(skin.id);

            // Play sound effect

            // Save to game data
            this.gameData.unlockedSkins[`skin${skin.id}`] = true;

            
            this.saveGameData();
        } else {
            // Show "not enough coins" feedback
            this.showMessage('Not enough coins!', '#ff0000');
        }
    }


    saveGameData() {
        // Save to localStorage or your preferred storage
        localStorage.setItem('gameData', JSON.stringify(this.gameData));
    }
    updateSkinButton(skinId) {
        const buttonData = this.skinButtons.find(b => b.skinId === skinId);
        if (!buttonData) return;

        // Update button appearance
        buttonData.locked = false;
        buttonData.buttonText.setText('SELECT');
        buttonData.button.setFillStyle(0x1a65ac); // Blue color for unlocked

        // Optional: Change price text or hide it
        buttonData.priceText.setVisible(false);

        // Optional: Add unlock effect
        this.tweens.add({
            targets: [buttonData.button, buttonData.skinImage],
            scale: 1.1,
            duration: 200,
            yoyo: true
        });
    }


    selectSkin(skinId, button, buttonText) {
        this.selectedSkin = skinId;
        button.setFillStyle(0x00aa00);
        buttonText.setText('SELECTED');

        // In a real game, you would save this selection
        this.showMessage('Skin selected!');
    }

    showMessage(text, color = '#00FF00') {
        const { width, height } = this.scale;

        if (this.message) {
            this.message.destroy();
        }

        this.message = this.add.text(width / 2, height - 100, text, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: color,
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Auto-hide message after 2 seconds
        this.time.delayedCall(2000, () => {
            if (this.message) {
                this.message.destroy();
                this.message = null;
            }
        });
    }
}