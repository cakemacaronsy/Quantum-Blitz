import { PLAYER_SPEED, PLAYER_SCALE, PLAYER_FIRE_RATE, GAME_WIDTH, GAME_HEIGHT, POWERUP_TYPES, POWERUP_DURATION, HOMING_MISSILE_FIRE_INTERVAL, LASER_BEAM_DPS } from '../utils/constants.js';
import Bullet from './Bullet.js';
import HomingMissile from './HomingMissile.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set properties
        this.setScale(PLAYER_SCALE);
        this.setCollideWorldBounds(true);

        // Player state
        this.lives = 3;
        this.isAlive = true;
        this.lastFired = 0;
        this.fireRate = PLAYER_FIRE_RATE;

        // God mode (invincible) - toggle with key 1
        this.godMode = false;

        // Power-up state
        this.activePowerUp = null;
        this.powerUpTimer = null;
        this.hasShield = false;
        this.shieldGraphic = null;

        // Homing missile shot counter
        this.shotCounter = 0;

        // Laser beam state
        this.laserBeamDamageAccumulator = 0;

        // Shield animation state
        this.shieldHexAngle = 0;
        this.shieldSparkles = null;
        this.shieldHexGraphics = null;
        this.shieldInnerGlow = null;
        this.shieldCircle = null;
        this.shieldGlowTween = null;
        this.shieldContainer = null;

        // Setup controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Create bullets group
        this.bullets = scene.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });
    }

    update(time, delta) {
        if (!this.isAlive) return;

        // Handle movement
        this.handleMovement();

        // Handle shooting (skip discrete shots for laser beam)
        if (this.activePowerUp !== POWERUP_TYPES.LASER_BEAM) {
            this.handleShooting(time);
        }

        // Laser beam logic
        if (this.activePowerUp === POWERUP_TYPES.LASER_BEAM && this.spaceBar.isDown) {
            this.updateLaserBeam(time, delta);
        } else if (this.scene.laserBeamGraphics) {
            this.scene.laserBeamGraphics.clear();
        }

        // Update shield position and animation if active
        if (this.shieldContainer) {
            this.shieldContainer.setPosition(this.x, this.y);

            // Rotate hexagonal ring
            this.shieldHexAngle += 0.02;
            if (this.shieldHexGraphics) {
                this.shieldHexGraphics.clear();
                this.shieldHexGraphics.lineStyle(1.5, 0x00ffff, 0.6);
                const hexRadius = 46;
                for (let i = 0; i < 6; i++) {
                    const angle1 = this.shieldHexAngle + (i * Math.PI * 2 / 6);
                    const angle2 = this.shieldHexAngle + ((i + 1) * Math.PI * 2 / 6);
                    this.shieldHexGraphics.lineBetween(
                        Math.cos(angle1) * hexRadius,
                        Math.sin(angle1) * hexRadius,
                        Math.cos(angle2) * hexRadius,
                        Math.sin(angle2) * hexRadius
                    );
                }
            }

            // Update orbiting sparkles
            if (this.shieldSparkles) {
                this.shieldSparkles.forEach(sp => {
                    sp.orbitAngle += sp.speed * delta / 1000;
                    sp.circle.x = Math.cos(sp.orbitAngle) * sp.radius;
                    sp.circle.y = Math.sin(sp.orbitAngle) * sp.radius;
                    sp.circle.alpha = 0.5 + 0.5 * Math.sin(time * 0.004 + sp.phase);
                });
            }
        }
    }

    handleMovement() {
        // Reset velocity
        this.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.setVelocityX(-PLAYER_SPEED);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.setVelocityX(PLAYER_SPEED);
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.setVelocityY(-PLAYER_SPEED);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.setVelocityY(PLAYER_SPEED);
        }

        // Keep player within bounds
        this.x = Phaser.Math.Clamp(this.x, 20, GAME_WIDTH - 20);
        this.y = Phaser.Math.Clamp(this.y, 20, GAME_HEIGHT - 20);
    }

    handleShooting(time) {
        // Adjust fire rate based on power-up
        const currentFireRate = this.activePowerUp === POWERUP_TYPES.RAPID_FIRE
            ? this.fireRate / 2
            : this.fireRate;

        // Check if spacebar is pressed and enough time has passed
        if (this.spaceBar.isDown && time > this.lastFired) {
            this.shoot();
            this.lastFired = time + currentFireRate;
        }
    }

    shoot() {
        // Play shoot sound
        if (this.scene.shotSound) {
            this.scene.shotSound.play({ volume: 0.2 });
        }

        // Different shooting patterns based on power-up
        if (this.activePowerUp === POWERUP_TYPES.SPREAD_SHOT) {
            // Spread shot - 3 bullets
            const bullet1 = new Bullet(this.scene, this.x, this.y - 20);
            const bullet2 = new Bullet(this.scene, this.x - 15, this.y - 15);
            const bullet3 = new Bullet(this.scene, this.x + 15, this.y - 15);

            bullet2.setVelocityX(-50);
            bullet3.setVelocityX(50);

            this.bullets.add(bullet1);
            this.bullets.add(bullet2);
            this.bullets.add(bullet3);
        } else if (this.activePowerUp === POWERUP_TYPES.HOMING_MISSILE) {
            // Normal bullet + every 3rd shot also fires a homing missile
            const bullet = new Bullet(this.scene, this.x, this.y - 20);
            this.bullets.add(bullet);

            this.shotCounter++;
            if (this.shotCounter >= HOMING_MISSILE_FIRE_INTERVAL) {
                this.shotCounter = 0;
                const missile = new HomingMissile(this.scene, this.x, this.y - 20);
                if (this.scene.homingMissiles) {
                    this.scene.homingMissiles.add(missile);
                }
            }
        } else if (this.activePowerUp === POWERUP_TYPES.BACK_SHOOTER) {
            // Forward bullet
            const bulletForward = new Bullet(this.scene, this.x, this.y - 20);
            this.bullets.add(bulletForward);

            // Backward bullet (goes down)
            const bulletBack = new Bullet(this.scene, this.x, this.y + 20);
            bulletBack.setVelocityY(400);
            bulletBack.setFlipY(true);
            this.bullets.add(bulletBack);
        } else {
            // Normal single bullet
            const bullet = new Bullet(this.scene, this.x, this.y - 20);
            this.bullets.add(bullet);
        }
    }

    updateLaserBeam(time, delta) {
        if (!this.scene.laserBeamGraphics) return;

        // Find nearest enemy
        const target = this.findNearestTarget();
        if (!target) {
            this.scene.laserBeamGraphics.clear();
            return;
        }

        const gfx = this.scene.laserBeamGraphics;
        gfx.clear();

        // Draw 3-layer beam: outer glow, inner beam, core
        // Outer glow
        gfx.lineStyle(6, 0x00ffff, 0.2);
        gfx.lineBetween(this.x, this.y - 15, target.x, target.y);
        // Inner beam
        gfx.lineStyle(3, 0x00ffff, 0.5);
        gfx.lineBetween(this.x, this.y - 15, target.x, target.y);
        // Core
        gfx.lineStyle(1, 0xffffff, 0.9);
        gfx.lineBetween(this.x, this.y - 15, target.x, target.y);

        // Accumulate DPS damage
        this.laserBeamDamageAccumulator += LASER_BEAM_DPS * (delta / 1000);
        if (this.laserBeamDamageAccumulator >= 1) {
            const dmg = Math.floor(this.laserBeamDamageAccumulator);
            this.laserBeamDamageAccumulator -= dmg;
            if (target.takeDamage) {
                target.takeDamage(dmg);
            }
        }
    }

    findNearestTarget() {
        let nearest = null;
        let nearestDist = Infinity;

        // Check enemies group
        if (this.scene.enemies) {
            this.scene.enemies.getChildren().forEach(enemy => {
                if (!enemy.active) return;
                const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = enemy;
                }
            });
        }

        // Check boss
        if (this.scene.boss && this.scene.boss.active) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.scene.boss.x, this.scene.boss.y);
            if (dist < nearestDist) {
                nearest = this.scene.boss;
            }
        }

        return nearest;
    }

    activatePowerUp(type) {
        try {
            if (!this.scene || !this.active) return;

            // Clear existing power-up
            this.clearPowerUp();

            // Activate new power-up
            this.activePowerUp = type;
            this.shotCounter = 0;

            if (type === POWERUP_TYPES.SHIELD) {
                this.hasShield = true;
                this.createShieldGraphic();
            }

            // Set timer to clear power-up
            if (this.scene.time) {
                this.powerUpTimer = this.scene.time.delayedCall(POWERUP_DURATION, () => {
                    if (this.scene && this.active) {
                        this.clearPowerUp();
                    }
                });
            }

            // Update UI
            if (this.scene.updatePowerUpDisplay) {
                this.scene.updatePowerUpDisplay();
            }
        } catch (error) {
            console.error('Error in activatePowerUp:', error);
        }
    }

    clearPowerUp() {
        this.activePowerUp = null;
        this.hasShield = false;

        // Stop any ongoing flash effect
        if (this.flashTween) {
            this.flashTween.stop();
            this.flashTween = null;
        }

        if (this.shieldTween) {
            this.shieldTween.stop();
            this.shieldTween = null;
        }

        if (this.shieldGlowTween) {
            this.shieldGlowTween.stop();
            this.shieldGlowTween = null;
        }

        if (this.shieldContainer) {
            this.shieldContainer.destroy();
            this.shieldContainer = null;
        }

        // Null out shield refs (container destroy handles child cleanup)
        this.shieldGraphic = null;
        this.shieldSparkles = null;
        this.shieldHexGraphics = null;
        this.shieldInnerGlow = null;
        this.shieldCircle = null;

        if (this.powerUpTimer) {
            this.powerUpTimer.remove();
            this.powerUpTimer = null;
        }

        // Clear laser beam graphics
        if (this.scene && this.scene.laserBeamGraphics) {
            this.scene.laserBeamGraphics.clear();
        }
        this.laserBeamDamageAccumulator = 0;

        // Update UI
        if (this.scene && this.scene.updatePowerUpDisplay) {
            this.scene.updatePowerUpDisplay();
        }
    }

    createShieldGraphic() {
        // Create a container for all shield layers
        this.shieldContainer = this.scene.add.container(this.x, this.y);
        this.shieldContainer.setDepth(this.depth - 1);

        // Inner glow circle
        this.shieldInnerGlow = this.scene.add.circle(0, 0, 38, 0x00ffff, 0.15);
        this.shieldContainer.add(this.shieldInnerGlow);

        // Main shield circle
        this.shieldCircle = this.scene.add.circle(0, 0, 40, 0x00ffff, 0.2);
        this.shieldCircle.setStrokeStyle(2, 0x00ffff);
        this.shieldContainer.add(this.shieldCircle);

        // Rotating hexagonal ring (drawn via Graphics each frame)
        this.shieldHexGraphics = this.scene.add.graphics();
        this.shieldContainer.add(this.shieldHexGraphics);
        this.shieldHexAngle = 0;

        // 6 orbiting sparkle circles
        this.shieldSparkles = [];
        for (let i = 0; i < 6; i++) {
            const circle = this.scene.add.circle(0, 0, 2, 0x00ffff, 0.8);
            this.shieldContainer.add(circle);
            this.shieldSparkles.push({
                circle: circle,
                orbitAngle: (i * Math.PI * 2) / 6,
                speed: 1.5 + (i * 0.3),
                radius: 44 + (i % 2) * 4,
                phase: i * 1.2
            });
        }

        // Pulse tween on main circle
        this.shieldTween = this.scene.tweens.add({
            targets: this.shieldCircle,
            scale: 1.1,
            alpha: 0.4,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Pulse tween on inner glow
        this.shieldGlowTween = this.scene.tweens.add({
            targets: this.shieldInnerGlow,
            scale: 1.15,
            alpha: 0.25,
            duration: 700,
            yoyo: true,
            repeat: -1
        });

        // Set shieldGraphic for backward compat with position tracking
        this.shieldGraphic = this.shieldContainer;
    }

    toggleGodMode() {
        this.godMode = !this.godMode;
        if (this.godMode) {
            this.setAlpha(0.5);
        } else {
            this.setAlpha(1);
        }
    }

    takeDamage() {
        if (!this.isAlive) return;

        // God mode ignores all damage
        if (this.godMode) return;

        // Shield absorbs damage
        if (this.hasShield) {
            this.clearPowerUp();
            return;
        }

        this.lives--;

        // Flash effect - stop any existing flash first
        if (this.flashTween) {
            this.flashTween.stop();
        }
        this.flashTween = this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.flashTween = null;
            }
        });

        // Screen Shake on damage
        if (this.scene.shakeCamera) {
            this.scene.shakeCamera(300, 0.03);
        }

        if (this.lives <= 0) {
            this.die();
        }
    }

    die() {
        try {
            if (!this.scene || !this.isAlive) return;

            this.isAlive = false;

            // Clear power-up
            this.clearPowerUp();

            // Stop BGM before scene transition
            if (this.scene.stopAllBGM) {
                this.scene.stopAllBGM();
            }

            // Save scene reference BEFORE destroy (destroy sets this.scene = undefined)
            const sceneRef = this.scene;

            // Play explosion animation
            if (sceneRef.add) {
                const explosion = sceneRef.add.sprite(this.x, this.y, 'explosion1');
                explosion.setScale(2);
                explosion.play('explode');
            }

            // Destroy player
            this.destroy();

            // Trigger game over after a delay with score data
            if (sceneRef.time && sceneRef.scene) {
                sceneRef.time.delayedCall(1000, () => {
                    try {
                        if (!sceneRef || !sceneRef.scoreManager || !sceneRef.waveManager) return;

                        const score = sceneRef.scoreManager.getScore();
                        const highScore = sceneRef.scoreManager.getHighScore();
                        const wave = sceneRef.waveManager.getCurrentWave();

                        sceneRef.scene.start('GameOverScene', {
                            score: score,
                            wave: wave,
                            highScore: highScore,
                            isNewHighScore: score >= highScore
                        });
                    } catch (error) {
                        console.error('Error in game over transition:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Error in Player.die():', error);
        }
    }

    getBullets() {
        return this.bullets;
    }

    destroy(fromScene) {
        // Clean up flash tween if it exists
        if (this.flashTween) {
            this.flashTween.stop();
            this.flashTween = null;
        }

        super.destroy(fromScene);
    }
}
