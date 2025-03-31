
import Phaser from 'phaser';



class FinalScene extends Phaser.Scene 
{

    constructor() {
        super('FinalScene'); // This string MUST match what you use in scene.start()
        this.gameSpeed = 2; // Pixels per frame to move
        this.playerhealth = 0
        this.fireRate = 500;
    }
    dragonHealth = 100;
    background2;


    preload() {



    // Load all frames as individual images
    for (let i = 0; i <= 67; i++) {
        const frameNum = i.toString().padStart(2, '0');
        this.load.image(`finalsky${i}`, `frame_${frameNum}_delay-0.03s.gif`);
    }

        this.load.image('plane1', 'plane1.png');
        this.load.image('plane2', 'plane2.png');

        this.load.image('finalDragon1', 'ultimatedragon1.png');
        this.load.image('finalDragon2', 'ultimatedragon2.png');
        this.load.image('finalDragon3', 'ultimatedragon3.png');


        this.load.image('bullet1', 'bullet1.png');
        this.load.image('bullet2', 'bullet2.png');

        this.load.image('explosion1', 'explosion1.png');
        this.load.image('explosion2', 'explosion2.png');
        this.load.image('explosion3', 'explosion3.png');
        this.load.image('explosion4', 'explosion4.png');
        this.load.image('explosion5', 'explosion5.png');
        this.load.image('explosion6', 'explosion6.png');


        this.load.image('fireball1', 'fireball1.png');
        this.load.image('fireball2', 'fireball2.png');


        this.load.image('potion', 'potion.png');
    }

    create() {
        // Background
        // milliseconds between shots
        this.startAutoFire();
        console.log(this.playerhealth)
        this.playerhealth += 1

        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const imgWidth = 999;   // Original image width
        const imgHeight = 429;  // Original image height
    
        // Calculate scale to COVER the screen (no empty areas)
        const scaleX = gameWidth / imgWidth;
        const scaleY = gameHeight / imgHeight;
        const scale = Math.max(scaleX, scaleY); // Ensures full coverage
    
        // Create the background (centered)
        this.background = this.add.sprite(
            gameWidth / 2,
            gameHeight / 2,
            'finalsky0' // Use first frame as default
        )
        .setScale(scale)        // Apply the correct scale
        .setOrigin(0.5, 0.5);  // Center the sprite
    
    // Create animation
    const frames = [];
    for (let i = 0; i < 67; i++) {
        frames.push({ key: `finalsky${i}` });
    }

    // Create animation (33ms delay ≈ 30fps)
    this.anims.create({
        key: 'skyAnimation',
        frames: frames,
        frameRate: 30,
        repeat: -1
    });

    // Play animation
    this.background.play('skyAnimation');

    // Scale to cover screen
    this.scaleBackground();

  
        // Create plane
        this.plane = this.add.sprite(45, 300, 'plane1');
        this.dragon = this.physics.add.sprite(this.cameras.main.width * 0.75, // Start at 75% of screen width (right side)
            this.cameras.main.height / 2, 'dragon1');
        this.plane.setScale(0.2);
        this.dragon.setScale(1.5);
        this.dragon.setCollideWorldBounds(true);
        this.dragon.setFlipX(true);

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

        // Collision detection
        this.physics.add.overlap(
            this.bullets,
            this.dragon,
            this.targetHit,
            null,
            this
        );
        this.createHealthDisplay()

        // Adjust dragon's body size if needed (smaller than visual)
        this.dragon.body.setSize(
            this.dragon.width * 0.8,
            this.dragon.height * 0.8
        );




        this.dragonBullets = this.physics.add.group({
            defaultKey: 'fireball1',
            maxSize: 50,
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
        this.startDragonFiring();

        // Collision between dragon bullets and player
        this.physics.add.overlap(
            this.dragonBullets,
            this.plane,
            this.playerHit,
            null,
            this
        );

        this.physics.add.overlap(
            this.dragon,
            this.plane,
            this.playerHit,
            null,
            this
        );
    }
    
    playerHit(bullet, player) {

        this.stopAutoFire();
        this.stopDragonFiring();
        // Player hit effect



        if (this.playerhealth <= 0) {

            const explosion = this.add.sprite(
                player.x,
                player.y,
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
                bullet.setActive(false).setVisible(false);
    
                // 5. Destroy explosion after animation
                this.time.delayedCall(300, () => {
                    explosion.destroy();
                    console.log('end explosion');
                });
            });
            this.startGameOver();
        } else {

            this.scene.pause('GameScene');
           
            this.scene.launch('UIScene'); // Launch unpaused popup
        }

        // Add

        // Add your player damage logic here
        console.log('Player hit by dragon bullet!');
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

    startGameOver() {
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
    
        switch(pattern) {
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
    
    // Then modify startDragonFiring to accept pattern:
    startDragonFiring(pattern = 'single', rate = 1000) {
        if (this.dragonFireTimer) this.dragonFireTimer.destroy();
        
        this.dragonFireTimer = this.time.addEvent({
            delay: rate,
            callback: () => this.dragonFire(pattern),
            callbackScope: this,
            loop: true
        });
    }

    startDragonFiring() {
        this.dragonFireTimer = this.time.addEvent({
            delay: this.dragonFireRate,
            callback: this.dragonFire,
            callbackScope: this,
            loop: true
        });
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
    fireSpread(count = 3, angleSpread = 30) {
        const centerAngle = 180; // Firing left (adjust as needed)
        const angleStep = angleSpread / (count - 1);
        const startAngle = centerAngle - (angleSpread / 2);
    
        for (let i = 0; i < count; i++) {
            const bullet = this.dragonBullets.get();
            if (bullet) {
                const angle = Phaser.Math.DegToRad(startAngle + (i * angleStep));
                const speed = this.dragonFireSpeed;
                
                bullet.setActive(true)
                    .setVisible(true)
                    .setPosition(this.dragon.x - 30, this.dragon.y)
                    .setVelocity(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                
                this.setBulletLifetime(bullet);
            }
        }
    }
    createHealthDisplay() {
        this.healthText = this.add.text(20, 20, 'Dragon Health: 100', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);
    }
    targetHit(bullet, dragon) {
        // Handle collision
        dragon.setActive(false).setVisible(false);
        this.dragonHealth -= 1;
        this.healthText.setText(`Dragon Health: ${this.dragonHealth}`);
        // Visual feedback
        dragon.setTint(0xff0000);
        this.time.delayedCall(200, () => dragon.clearTint());

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

        console.log('Dragon defeated!');
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
    scaleBackground() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const scaleX = gameWidth / this.background.width;
        const scaleY = gameHeight / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale);
    }
    update(time) {
        // Move background to the left
        this.background.x -= 0.5;
        if (this.background.x <= -this.background.displayWidth/2) {
            this.background.x = this.cameras.main.width;
        }

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

export default FinalScene;