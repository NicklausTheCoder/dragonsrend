
import Phaser from 'phaser';



class FinalScene extends Phaser.Scene {

    constructor() {
        super('FinalScene'); // This string MUST match what you use in scene.start()
        this.gameSpeed = 2; // Pixels per frame to move
        this.countdownValue = 20;
        this.fireRate = 500;
        this.shootingAnimatus ='bullets';
    }
    dragonHealth = 400;
    background2;


    preload() {




        this.load.image('finalsky', `sky.png`);

        this.load.image('laser', `laser.png`);
        this.load.image('laser1', `laser.png`);
        
        this.load.image('laser2', `laser.png`);
        this.load.image('plane1', 'plane1.png');
        this.load.image('plane2', 'plane2.png');
        this.load.image('ad', 'ad.jpg');
        this.load.image('finalDragon1', 'ultimatedragon1.png');
        this.load.image('finalDragon2', 'ultimatedragon2.png');
        this.load.image('finalDragon3', 'ultimatedragon3.png');
        this.load.image('heart', 'heart.png'); // Your heart image

        this.load.image('bullet1', 'bullet1.png');
        this.load.image('bullet2', 'bullet2.png');

        this.load.image('explosion1', 'explosion1.png');
        this.load.image('explosion2', 'explosion2.png');
        this.load.image('explosion3', 'explosion3.png');
        this.load.image('explosion4', 'explosion4.png');
        this.load.image('explosion5', 'explosion5.png');
        this.load.image('explosion6', 'explosion6.png');

        this.load.image('rocket', 'rocket.png');
        this.load.image('fireball1', 'fireball1.png');
        this.load.image('fireball2', 'fireball2.png');


        this.load.image('potion', 'potion.png');
    }

    create() {
        // Background
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'finalsky')
            .setOrigin(0, 0)
            .setScrollFactor(0);
        const bgTexture = this.textures.get('finalsky');
        const bgAspect = bgTexture.source[0].width / bgTexture.source[0].height;
        const gameAspect = gameWidth / gameHeight;

        // milliseconds between shots
        this.startAutoFire();


        // 1. Initialize health
        // Health variables
        this.playerMaxHealth = 5;
        this.playerHealth = this.playerMaxHealth;
        console.log(this.playerHealth)


        this.dragonMaxHealth = 400;
        this.dragonCurrentHealth = this.dragonMaxHealth;






        this.plane = this.add.sprite(45, 300, 'plane1');
        this.dragon = this.physics.add.sprite(this.cameras.main.width * 0.75, // Start at 75% of screen width (right side)
            this.cameras.main.height / 2, 'finalDragon1');
        this.plane.setScale(0.2);
        this.dragon.setScale(1);
        this.dragon.setCollideWorldBounds(true);
        this.dragon.setFlipX(true);
        this.adState = {
            lastShown: 0,
            cooldown: 30000, // 30 seconds cooldown (ms)
            available: true
        };
    
        // Animations
        this.anims.create({
            key: 'fly',
            frames: [
                { key: 'plane1' },
                { key: 'plane2' }
            ],
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'dragonfly',
            frames: [
                { key: 'finalDragon1' },
                { key: 'finalDragon2' },
                { key: 'finalDragon3' }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.plane.play('fly');
        this.dragon.play('dragonfly');


        // Initialize movement properties AFTER dragon creation
        this.dragonSpeed = 150;
        this.dragonMoveDelay = 3000;

        // Wait until next tick to start movement
        this.time.delayedCall(100, () => {
            this.startDragonMovement();
        });

        // Physics
        this.physics.add.existing(this.plane);

        // 1. Create the bullet group
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet1',
            maxSize: 30,
            runChildUpdate: true,
            createCallback: (bullet) => {
                this.physics.add.existing(bullet);
                bullet.body.setAllowGravity(false);
                bullet.setActive(false).setVisible(false); // Start inactive

                // Set default properties (velocity will be set when fired)
                bullet.setScale(0.3);
                bullet.setDepth(1);
            }
        });

        this.anims.create({
            key: 'bulletAnim', // Changed from 'bullets' to be more specific
            frames: [
                { key: 'bullet1' },
                { key: 'bullet2' },
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'laserAnim',
            frames: [
                { key: 'laser1' },
                { key: 'laser2' }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.upgradeToLaser = function() {
            this.shootingAnimatus = 'laser';
            
   
            // Call this after showing ad
        };
        
        // Touch controls
        this.input.addPointer(1);
        this.touchY = 300;

        // Fire button (spacebar)
        this.fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.lastFired = 0;


        // Enable physics for bullets
        this.physics.world.enable(this.bullets);

        // Enable physics for dragon if not already done
        this.physics.add.existing(this.dragon);


        this.createHealthDisplay()

        // Adjust dragon's body size if needed (smaller than visual)
        this.dragon.body.setSize(
            this.dragon.width * 0.8,
            this.dragon.height * 0.8
        );


        // Adjust the hitbox (MOST IMPORTANT PART)
        this.plane.body.setSize(
            this.plane.width * 0.6,  // 60% of sprite width
            this.plane.height * 0.4, // 40% of sprite height
            {
                x: this.plane.width * 0.2,  // 20% offset X
                y: this.plane.height * 0.3  // 30% offset Y
            }
        );

        // Optional: Visual debug (remove in production)
        this.plane.body.debugShowBody = true;

        this.dragonBullets = this.physics.add.group({
            defaultKey: 'fireball1',
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 200,
            runChildUpdate: true,
            createCallback: bullet => {
                this.physics.add.existing(bullet);
                bullet.body.setAllowGravity(false);
                bullet.setScale(0.5);
            }
        });

        // Dragon firing properties
        this.dragonFireRate = 2000; // ms between shots
        this.dragonFireSpeed = -300; // Negative for leftward movement
        this.startDragonFiring('spread', 2000); // Fires spread every 2 seconds

        // Collision between dragon bullets and player
        this.physics.add.overlap(
            this.dragonBullets,
            this.plane,
            this.playerHit,
            null,
            this
        );
        // Create health display
        this.healthText = this.add.text(20, 20, 'Dragon Health: 400', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setScrollFactor(0);

        // Set up collision
        this.physics.add.overlap(
            this.bullets,
            this.dragon,
            this.targetHit,
            null,
            this
        );
        this.physics.add.overlap(
            this.dragon,
            this.plane,
            this.DragonRam,
            null,
            this
        );

        this.rockets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite, // ← MUST INCLUDE
            maxSize: 5,
            defaultKey: 'rocket',
            runChildUpdate: true,
            createCallback: (rocket) => {
                // Explicitly enable physics for each rocket
                this.physics.add.existing(rocket);
                rocket.body.setAllowGravity(false);
                rocket.body.setSize(rocket.width * 0.8, rocket.height * 0.8);
            }
        });

        // Debug checks

        const buttonSize = 80; // Approximate button diameter
        const padding = 50;
        // Create rocket button (bottom right)
        this.rocketButton = this.add.sprite(
            this.cameras.main.width - padding - (buttonSize / 2),   // X position (50px from right)
            this.cameras.main.height - 50, // Y position (50px from bottom)
            'rocket'
        )
            .setInteractive() // Make it clickable
            .setScrollFactor(0) // Stays fixed on screen
            .setDepth(1000) // Always on top
            .setScale(0.1); // Adjust size


        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height)
            .setStrokeStyle(2, 0xff0000)
            .setOrigin(0)
            .setDepth(9999);


        const buttonGroup = this.add.container(
            this.cameras.main.width - 100, // Example position
            80
        ).setScrollFactor(0)
            .setInteractive() // Make it clickable
            .setScrollFactor(0) // Stays fixed on screen
            .setDepth(1000) // Always on top
            .setScale(0.6);

        // 2. Create button and verify
        const laserButton = this.add.sprite(0, 0, 'laser')
            .setInteractive({ useHandCursor: true })
            .setScale(0.7);

        if (!laserButton) {
            console.error("Laser button creation failed!");
            return;
        }
        const getLaseradText = this.add.text(0, -40, 'AD', {
            font: '18px Arial',
            fill: '#FF0000FF'
        }).setOrigin(0.5);
        // 3. Create text elements
        const getLaserText = this.add.text(0, 40, 'Get Laser', {
            font: '18px Arial',
            fill: '#FF0808FF'
        }).setOrigin(0.5);

        // 4. Add to container
        buttonGroup.add([laserButton, getLaseradText, getLaserText]);

        // 5. Verify container before adding listener
        if (buttonGroup) {
            buttonGroup.on('pointerdown', () => {
                console.log("Button clicked!");
                // Your click handler here
            });
        } else {
            console.error("Button group creation failed!");
        }




        this.physics.add.overlap(
            this.rockets,
            this.dragon,
            this.rocketHit,
            null,
            this
        );


        // Add button states
        this.rocketButton.on('pointerover', () => {
            this.rocketButton.setScale(0.12);
        });
        this.tweens.add({
            targets: this.rocketButton,
            scale: 0.15,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.rocketButton.on('pointerout', () => {
            this.rocketButton.setScale(0.12);
        });

        // Add click/tap functionality
        this.rocketButton.on('pointerdown', () => {
            this.fireRocket();
            this.rocketButton.setScale(0.11); // Pressed effect
        });

        this.rocketButton.on('pointerup', () => {
            this.rocketButton.setScale(0.12);
        });

        // Create rocket group
        // Handle events for the entire group
        laserButton.on('pointerdown', () => {
            // Handle button click
            this.showAdForLaser();
        });
        // Button glow effect
        this.buttonGlow = this.add.graphics()
            .fillStyle(0xffff00, 0.15)
            .fillCircle(
                this.rocketButton.x,
                this.rocketButton.y,
                this.rocketButton.width * 0.15
            )
            .setVisible(false)
            .setScrollFactor(0)
            .setDepth(999);

        // Add to pointer events
        this.rocketButton.on('pointerover', () => {
            this.buttonGlow.setVisible(true);
        });

        this.rocketButton.on('pointerout', () => {
            this.buttonGlow.setVisible(false);
        });

        this.hearts = this.add.group();


        // Create initial hearts
        this.createHearts()


    }

    showAdForLaser() {
        // Check cooldown
        const now = Date.now();
        if (now - this.adState.lastShown < this.adState.cooldown) {
            const remaining = Math.ceil((this.adState.cooldown - (now - this.adState.lastShown)) / 1000);
            this.showMessage(`Please wait ${remaining} seconds`, 0xff0000);
            return;
        }
    
        // Check availability
        if (!this.adState.available) {
            this.showMessage("Ads not available", 0xff0000);
            return;
        }
    
        // Pause game
        this.gamePaused = true;
        this.physics.pause();
       
    
        // Show ad UI
        this.createAdPopup();
    
        // Simulate ad completion after 3 seconds
        this.time.delayedCall(30000, () => {
            this.handleAdComplete();
        }, null, this);
    }
    
    createAdPopup() {
        // Dim background
        this.adOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        ).setScrollFactor(0).setDepth(999);
    
        // Popup container
        this.adPopup = this.add.container(
            this.cameras.main.centerX,
            this.cameras.main.centerY
        ).setDepth(1001);
    
        // Popup background
        const popupBg = this.add.rectangle(0, 0, 400, 330, 0x1a2c42)
            .setStrokeStyle(2, 0xffffff);
    
        // Ad content
        const loadingText = this.add.image(0, -50, 'ad').setScale(0.31).setInteractive().setOrigin(0.5);
    
        // Order button
    // Handle the click/tap
loadingText.on('pointerdown', () => {
    // Open Coca-Cola website in new tab
    window.open('https://www.coca-cola.com', '_blank');
    
    // Optional: Add click sound

});
    
        // Countdown text - make sure it's visible (set depth higher than background)
        this.countdownText = this.add.text(0, 100, 'close button will appear in : 20', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(1002);
    
        // Add elements to container
        this.adPopup.add([popupBg, loadingText, this.countdownText]);
    
        // Initialize countdown
     
        
        // Start the timer
        this.startCountdown();
    }
    
    startCountdown() {
        // Remove any existing timer first
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
    
        console.log("Starting countdown timer"); // Debug log
        console.log("Countdown:", this.countdownValue)
        
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
    }
    
    updateCountdown() {
        this.countdownValue--;
        console.log("Countdown:", this.countdownValue); // Debug log
        
        // Update the text
        this.countdownText.setText('close button will appear in :' + this.countdownValue);
        
        // When countdown reaches 0
        if (this.countdownValue <= 0) {
            this.showSkipButton();
        }
    }
    
    showSkipButton() {
        console.log("Showing skip button"); // Debug log
        
        // Remove countdown text
        this.countdownText.destroy();
        
        // Create and add skip button
        this.skipButton = this.add.text(100, 100, 'Close Ad', {
            font: '24px Arial',
            fill: '#ff5555'
        }).setOrigin(0.5).setInteractive().setDepth(1002);
        
        this.adPopup.add(this.skipButton);
        
        // Add click handler
        this.skipButton.on('pointerdown', () => {
            console.log("Skip button clicked"); // Debug log
            this.handleAdComplete();
            this.cleanupAdPopup();
        });
        
        // Stop the timer
        this.timerEvent.remove();
    }
    
    cleanupAdPopup() {
        console.log("Cleaning up ad popup"); // Debug log
        
        // Cleanup all references
        if (this.adOverlay) this.adOverlay.destroy();
        if (this.adPopup) this.adPopup.destroy();
        if (this.timerEvent) this.timerEvent.destroy();
        if (this.countdownText && this.countdownText.active) this.countdownText.destroy();
        if (this.skipButton && this.skipButton.active) this.skipButton.destroy();
        
        // Null all references
        this.adOverlay = null;
        this.adPopup = null;
        this.timerEvent = null;
        this.countdownText = null;
        this.skipButton = null;
    }
    handleAdComplete() {
        // Reward player
   
        // Update ad state
        this.adState.lastShown = Date.now();
        this.adState.available = false; // Temporary lock to prevent spam
    this.shootinganimatus='laser';
        // Resume game
        this.gamePaused = false;
        this.physics.resume();
        this.time.paused = false;
    
        // Show reward message
        this.showMessage("+50 Coins!", 0x00ff00);
    
        // Re-enable ads after short delay
        this.time.delayedCall(5000, () => {
            this.adState.available = true;
        }, null, this);
    
        // Cleanup
        this.cleanupAdPopup();
    }
    

    showMessage(text, color = 0xffffff) {
        const msg = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 200,
            text,
            {
                font: '28px Arial',
                fill: Phaser.Display.Color.IntegerToColor(color).rgba,
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setDepth(1002);
    
        this.tweens.add({
            targets: msg,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
    createHearts() {
        this.hearts = this.add.group();

        for (let i = 0; i < this.playerMaxHealth; i++) {
            this.hearts.add(
                this.add.sprite(20 + (i * 40), this.cameras.main.height - 50, 'heart')
                    .setScrollFactor(0)
                    .setScale(0.06)
                    .setDepth(1000));
        }
    }

    updateHearts() {
        this.hearts.getChildren().forEach((heart, index) => {
            // Show full heart if index < current health
            if (index < this.playerHealth) {
                heart.setTexture('heart');
            }
            // Show empty heart (or hide) if health is depleted
            else {
                heart.setVisible(false)
            }
        });
    }
    // In your class definition
    rocketHit(rocket, dragon) {
        // 1. Handle rocket impact
        dragon.disableBody(true, true); // More reliable than setActive(false)


        // 2. Damage dragon (more than bullets)
        this.dragonHealth -= 30;
        this.healthText.setText(`Dragon Health: ${this.dragonHealth}`);

        // 3. Visual feedback
        this.createExplosion(rocket.x, rocket.y);
        rocket.setTint(0xff0000);
        this.time.delayedCall(300, () => {
            rocket.clearTint();
        });
        this.updateHealthBar();

        // Debug log
        console.log('Rocket hit! Damage: 30');

        // 4. Check for defeat
        if (this.dragonHealth <= 0) {
            this.defeatDragon();
        }
        return false
    }
    createExplosion(x, y, scale = 1) {
        // Create explosion sprite
        const explosion = this.add.sprite(x, y, 'explosion1')
            .setScale(scale)
            .setDepth(100); // Ensure it appears above other objects

        // Play animation
        explosion.play('explode');



        // Auto-remove after animation completes
        this.time.delayedCall(500, () => {
            explosion.destroy();
        });



        // Optional screen shake for big explosions
        if (scale > 1.2) {
            this.cameras.main.shake(300, 0.02);
        }
    }
    // Rocket firing function
    fireRocket() {
        if (this.rocketCooldown) return; // Prevent spamming

        const rocket = this.rockets.get(this.plane.x, this.plane.y);
        if (rocket) {
            rocket.setActive(true)
                .enableBody(true, this.plane.x, this.plane.y, true, true)
                .setVisible(true)
                .setPosition(this.plane.x + 50, this.plane.y)
                .setVelocityX(600) // Faster than regular bullets
                .setScale(0.1);
            console.log('Rocket fire');

            // Cooldown (1 second)
            this.rocketCooldown = true;
            this.time.delayedCall(1000, () => {
                this.rocketCooldown = false;
            });
        }
    }
    playerHit(dragonBullets, plane) {


        // Player hit effect



        if (this.playerHealth > 0) {
            this.playerHealth--;
            console.log(this.playerHealth)
            // Update visual hearts
            this.updateHearts();

            // Visual feedback
            this.cameras.main.shake(200, 0.01); // Screen shake
            dragonBullets.setTint(0xff0000);


            this.time.delayedCall(300, () => {
                dragonBullets.clearTint();
            });
            plane.destroy();



            // Check for game over
            if (this.playerHealth <= 0) {

                this.startGameOver(dragonBullets);
            }
        }



        // Add

        // Add your player damage logic here
        console.log('Player hit by dragon bullet!');
        return false
    }

    DragonRam(dragon, plane) {



        // Player hit effect



        if (this.playerHealth > 0) {
            this.playerHealth--;
            console.log(this.playerHealth)
            // Update visual hearts
            this.updateHearts();

            // Visual feedback
            this.cameras.main.shake(200, 0.01); // Screen shake
            plane.setTint(0xff0000);


            this.time.delayedCall(300, () => {
                plane.clearTint();
            });




            // Check for game over
            if (this.playerHealth <= 0) {

                this.startGameOver(plane);
            }
        }



        // Add

        // Add your player damage logic here
        console.log('Player hit by dragon bullet!');
        return false
    }

    // Helper function to clean up popup elements
    cleanupPopup(...elements) {
        elements.forEach(element => element.destroy());
    }

    // Your custom functions
    extraLifeFunction(bullet, player) {
        this.scene.resume('GameScene');
        this.startAutoFire();
        this.startDragonFiring();
        this.playerhealth -= 1;
        console.log("Player chose to drink - extra life!");
        console.log(this.playerhealth)
        // Add your extra life logic here
        // Example: this.playerHealth += 1;
    }

    startGameOver(plane) {

        this.stopAutoFire();
        this.stopDragonFiring();
        const explosion = this.add.sprite(
            plane.x,
            plane.y,
            'explosion1' // Make sure you loaded this texture
        );

        this.anims.create({
            key: 'explode',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' },
                { key: 'explosion5' },
                { key: 'explosion6' }
            ],
            frameRate: 10,
            repeat: -1
        });


        // 3. Play explosion animation
        explosion.play('explode'); // Set up this animation in create()

        // 4. Hide dragon (after slight delay for overlap)
        this.time.delayedCall(100, () => {
            plane.destroy()
            // 5. Destroy explosion after animation
            this.time.delayedCall(600, () => {
                explosion.destroy();
                console.log('end explosion');
            });
        });
        // Resume in case we were paused
        this.scene.resume();

        // Start fade out from GameScene's camera
        this.cameras.main.fadeOut(1000, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Stop both scenes cleanly
            this.scene.stop('PopupScene');
            this.scene.start('GameOverScene', {
                score: this.score ?? 0,
                level: this.currentLevel ?? 1
            });
        });
    }

    // Start firing with pattern
    startDragonFiring(pattern = 'single', rate = null) {
        if (this.dragonFireTimer) {
            this.dragonFireTimer.destroy();
        }

        this.dragonFireTimer = this.time.addEvent({
            delay: rate || this.dragonFireRate,
            callback: () => this.dragonFire(pattern),
            callbackScope: this,
            loop: true
        });
    }

    stopDragonFiring() {
        if (this.dragonFireTimer) {
            this.dragonFireTimer.destroy();
            this.dragonFireTimer = null;
        }

        // Optional: Clear existing dragon bullets
        this.dragonBullets.clear(true, true);
        console.log('Dragon firing stopped and bullets cleared');
    }
    dragonFire(pattern = 'single') {
        if (!this.dragon?.active || this.gameOver) return;

        switch (pattern) {
            case 'single':
                this.fireSingleBullet();
                break;
            case 'spread':
                this.fireSpread(3, 30); // 3 bullets at 30 degree spread
                break;
            case 'wave':
                this.fireWave(5, 100); // 5 bullets in a wave pattern
                break;
            case 'burst':
                this.fireBurst(3, 200); // 3 quick bursts
                break;
        }
    }

    dragonFire(pattern = 'single') {
        if (!this.dragon?.active || this.gameOver) return;

        switch (pattern) {
            case 'single':
                this.fireSingleBullet();
                break;
            case 'spread':
                this.fireSpread(3, 30);
                break;
            case 'wave':
                this.fireWave(5, 100);
                break;
            case 'burst':
                this.fireBurst(3, 200);
                break;
            default:
                this.fireSingleBullet(); // fallback
        }
    }
    // Fire single bullet
    fireSingleBullet() {
        const bullet = this.dragonBullets.get();
        if (bullet) {
            bullet.setActive(true)
                .setVisible(true)
                .setTexture('fireball1')
                .setPosition(this.dragon.x - 30, this.dragon.y)
                .setVelocityX(this.dragonFireSpeed);

            this.time.delayedCall(3000, () => {
                if (bullet.active) bullet.setActive(false).setVisible(false);
            });
        }
    }
    fireBullet() {

        
        const bullet = this.dragonBullets.get();
        if (bullet) {
            bullet.setActive(true)
                .setVisible(true)
                .setPosition(this.dragon.x - 30, this.dragon.y) // Spawn on LEFT side
                .setVelocityX(-Math.abs(this.dragonFireSpeed)) // Negative for LEFT
                .setFlipX(false); // Ensure facing LEFT (default orientation)

            this.time.delayedCall(3000, () => {
                if (bullet.active) bullet.setActive(false).setVisible(false);
            });
        }
    }

    fireBurst(count = 3, delayBetween = 200) {
        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i * delayBetween, () => {
                const bullet = this.dragonBullets.get();
                if (bullet) {
                    bullet.setActive(true)
                        .setVisible(true)
                        .setPosition(this.dragon.x - 30, this.dragon.y)
                        .setVelocityX(this.dragonFireSpeed);

                    this.setBulletLifetime(bullet);
                }
            });
        }
    }
    fireWave(count = 5, waveSize = 100) {
        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i * 150, () => {
                const bullet = this.dragonBullets.get();
                if (bullet) {
                    const offsetY = waveSize * Math.sin(i * 0.5);

                    bullet.setActive(true)
                        .setVisible(true)
                        .setPosition(this.dragon.x - 30, this.dragon.y + offsetY)
                        .setVelocityX(this.dragonFireSpeed);

                    this.setBulletLifetime(bullet);
                }
            });
        }
    }
    fireSpread(bulletCount = 3, spreadAngle = 30) {
        const centerAngle = 180; // 180° = LEFT
        const startAngle = centerAngle - (spreadAngle / 2);
        const angleStep = spreadAngle / (bulletCount - 1);
        const speed = -Math.abs(this.dragonFireSpeed); // Negative for LEFT

        for (let i = 0; i < bulletCount; i++) {
            const bullet = this.dragonBullets.get();
            if (!bullet) continue;

            const angle = Phaser.Math.DegToRad(startAngle + (i * angleStep));

            bullet.setActive(true)
                .setVisible(true)
                .setPosition(this.dragon.x - 30, this.dragon.y) // LEFT side
                .setVelocity(
                    Math.cos(angle) * 150, // Negative X for LEFT
                    Math.sin(angle) * 150
                )
                .setRotation(angle) // Rotate bullet along movement angle
                .setFlipX(true); // Force LEFT-facing
        }
    }

    createHealthDisplay() {
        // Background (gray)
        this.healthBarBg = this.add.rectangle(
            20, 20,
            200, 30,
            0x333333
        ).setOrigin(0, 0).setScrollFactor(0);

        // Foreground (red) - will shrink as health decreases
        this.healthBar = this.add.rectangle(
            20, 20,
            200, 30,
            0xff0000
        ).setOrigin(0, 0).setScrollFactor(0);


    }

    updateHealthBar() {
        // Calculate new width (0-200)
        const newWidth = 200 * (this.dragonHealth / this.dragonMaxHealth);

        // Destroy old rectangle
        this.healthBar.destroy();

        // Create new rectangle with updated width
        this.healthBar = this.add.rectangle(
            20, 20,
            newWidth, 30,
            0xff0000
        ).setOrigin(0, 0).setScrollFactor(0);

        // Update text if exists
        if (this.healthText) {
            this.healthText.setText(`HP: ${this.dragonHealth}/${this.dragonMaxHealth}`);
        }
    }

    updateHealth(damage) {
        // Reduce health (never below 0)
        this.dragonCurrentHealth = Math.max(0, this.dragonCurrentHealth - damage);

        // Calculate new width
        const healthPercent = this.dragonCurrentHealth / this.dragonMaxHealth;
        this.healthBar.width = 200 * healthPercent;

        // Visual feedback
        this.tweens.add({
            targets: this.healthBar,
            fillColor: 0x990000,
            duration: 100,
            yoyo: true
        });

        // Return true if dead
        return this.dragonCurrentHealth <= 0;
    }

    targetHit(bullet, dragon) {
        // Handle collision
        dragon.setActive(false).setVisible(false);
        this.dragonHealth -= 1;
        this.healthText.setText(`Dragon Health: ${this.dragonHealth}`);
        // Visual feedback
        dragon.setTint(0xff0000);
        this.time.delayedCall(200, () => dragon.clearTint());
        this.updateHealthBar();
        console.log('Target hit!'); // For debugging
        if (this.dragonHealth <= 0) {
            this.defeatDragon();
        }
    }

    defeatDragon() {
        // 1. Stop all firing
        this.stopAutoFire();
        this.stopDragonFiring();
        // 2. Create explosion at dragon's position
        const explosion = this.add.sprite(
            this.dragon.x,
            this.dragon.y,
            'explosion1' // Make sure you loaded this texture
        );

        this.anims.create({
            key: 'explode',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' },
                { key: 'explosion5' },
                { key: 'explosion6' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // 3. Play explosion animation
        explosion.play('explode'); // Set up this animation in create()

        // 4. Hide dragon (after slight delay for overlap)
        this.time.delayedCall(100, () => {
            this.dragon.setVisible(false);

            // 5. Destroy explosion after animation
            this.time.delayedCall(300, () => {
                explosion.destroy();
                console.log('end explosion');
            });
        });


        this.time.delayedCall(700, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0); // Fade out effect

            // After fade completes, switch scene
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('victoryScene');
            });
            // Your b
        });
    }
    startDragonMovement() {
        // Clear existing timer if any

        if (this.dragonMoveTimer) {
            this.dragonMoveTimer.destroy();
        }

        // Verify dragon exists and has physics body
        if (!this.dragon || !this.dragon.body) {
            console.error('Dragon not properly initialized for movement');
            return;
        }

        // Create movement loop
        this.dragonMoveTimer = this.time.addEvent({
            delay: this.dragonMoveDelay,
            callback: this.moveDragonToRandomSpot,
            callbackScope: this,
            loop: true
        });

        // Start first movement
        this.moveDragonToRandomSpot();
    }

    moveDragonToRandomSpot() {
        if (!this.dragon?.body) return;

        // Only move within right half of screen
        const rightHalfStart = this.cameras.main.width / 2;
        const padding = 50;

        const randomX = Phaser.Math.Between(
            rightHalfStart + padding,
            this.cameras.main.width - padding
        );

        const randomY = Phaser.Math.Between(
            padding,
            this.cameras.main.height - padding
        );

        // Keep dragon always facing right
        this.dragon.setFlipX(false);

        // Physics-based movement
        this.physics.moveTo(
            this.dragon,
            randomX,
            randomY,
            this.dragonSpeed
        );
    }

    update(time) {
        // Move background to the left
        this.background.tilePositionX += this.gameSpeed;
        // Touch controls
        if (this.input.activePointer.isDown) {
            this.touchY = this.input.activePointer.y;
        }

        // Plane movement
        if (this.plane.y < this.touchY) {
            this.plane.y += 3;
        } else if (this.plane.y > this.touchY) {
            this.plane.y -= 3;
        }

        // Keep plane within screen
        this.plane.y = Phaser.Math.Clamp(this.plane.y, 50, 550);

        // Firing mechanism
        if (this.fireButton.isDown && time > this.lastFired) {
            this.fireBullet();
            this.lastFired = time + this.fireRate;
        }

        // Update bullets (move right and remove off-screen bullets)
        this.bullets.getChildren().forEach(bullet => {
            bullet.x += 10; // Bullet speed

            // Remove bullets that go off-screen
            if (bullet.x > this.game.config.width + 50) {
                this.bullets.killAndHide(bullet);
            }
        });

        // Stop dragon when close to target to prevent vibrating
        if (this.dragon?.body?.velocity) {
            const target = this.dragon.body.target;
            if (target) {
                const distance = Phaser.Math.Distance.Between(
                    this.dragon.x,
                    this.dragon.y,
                    target.x,
                    target.y
                );

                if (distance < 10) {
                    this.dragon.setVelocity(0, 0);
                }
            }
        }
    }
    // Start/stop:
    startAutoFire() {
        if (this.fireLoop) this.fireLoop.destroy();
        this.fireLoop = this.time.addEvent({
            delay: 500,
            callback: this.fireBullet,
            callbackScope: this,
            loop: true
        });
    }

    stopAutoFire() {
        if (this.fireLoop) {
            this.fireLoop.remove();
            this.fireLoop = null;
        }
    }
    // In your fireBullet() function:
    fireBullet() {
        const bullet = this.bullets.get(this.plane.x + 40, this.plane.y);

        if (!bullet) return; // No available bullets
        
        if (this.shootingAnimatus === 'laser') {
            bullet.setTexture('laser1'); // Set laser sprite
            bullet.play('laserAnim'); // Play laser animation
            bullet.damage = 2; // Laser does more damage
        } else {
            console.log(this.shootingAnimatus);
            if (bullet) {
                // Reset bullet properties
                bullet.setActive(true)
                    .setVisible(true)
                    .setPosition(this.plane.x + 40, this.plane.y)
                    .setVelocityX(500); // Set velocity here instead of createCallback
    
                // Play animation on THIS bullet
                bullet.play('bulletAnim');
    
                // Muzzle flash effect (optional)
                const flash = this.add.sprite(this.plane.x + 20, this.plane.y, 'bullet1')
                    .setScale(1)
                    .setAlpha(0.8)
                    .setDepth(0);
    
                this.tweens.add({
                    targets: flash,
                    scale: 0.5,
                    alpha: 0,
                    duration: 100,
                    onComplete: () => flash.destroy()
                });
            }
        }

    }

}

export default FinalScene;