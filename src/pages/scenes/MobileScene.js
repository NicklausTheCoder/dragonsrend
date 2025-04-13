import Phaser from 'phaser';
import { AdMob } from '@capacitor-community/admob';

class MobileScene extends Phaser.Scene {
    constructor() {
        super('MobileScene');
        this.coins = 0;
    }

    async create() {
        // Initialize AdMob
        await this.initializeAdMob();

        // Show banner ad
        await this.showBannerAd();

        // Game UI
        this.createUI();
    }

    async initializeAdMob() {
        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                testingDevices: ['TEST_DEVICE_ID'],
                initializeForTesting: true, // Remove for production
            });
            console.log('AdMob initialized');
        } catch (e) {
            console.error('AdMob init error:', e);
        }
    }

    async showBannerAd() {
        try {
            await AdMob.showBanner({
                adId: 'ca-app-pub-7429385817508822/2788994024', // Test ID
                position: 'BOTTOM_CENTER',
                margin: 0,
            });
        } catch (e) {
            console.error('Banner error:', e);
        }
    }

    createUI() {
        // Coin display
        this.coinText = this.add.text(50, 50, `Coins: ${this.coins}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#FFD700'
        });

        // Reward button
        const rewardButton = this.add.rectangle(400, 300, 250, 70, 0x1a65ac)
            .setInteractive()
            .on('pointerdown', () => this.showRewardedAd());

        this.add.text(400, 300, 'Watch Ad for 100 Coins', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
    }

    async showRewardedAd() {
        try {
            // First prepare the ad
            await AdMob.prepareRewardVideoAd({
                adId: 'ca-app-pub-7429385817508822/1346961984', // Test ID
            });
            
            // Then show it
            const result = await AdMob.showRewardVideoAd();
            
            // Reward the user if they completed the ad
            if (result && result.value) {
                this.coins += 100;
                this.coinText.setText(`Coins: ${this.coins}`);
                this.showMessage('+100 coins!');
            }
        } catch (e) {
            console.error('Rewarded ad error:', e);
            this.showMessage('Ad not available');
        }
    }

    showMessage(text) {
        const msg = this.add.text(400, 200, text, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => msg.destroy());
    }
}
export default MobileScene;