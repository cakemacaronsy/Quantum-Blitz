import EnemyBullet from './EnemyBullet.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyType) {
        super(scene, x, y, enemyType.key);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Store enemy type config
        this.enemyType = enemyType;

        // Set properties
        this.setScale(enemyType.scale);
        this.health = enemyType.health;
        this.maxHealth = enemyType.health;
        this.scoreValue = enemyType.score;
        this.baseSpeed = enemyType.speed;

        // Add subtle tint/outline for visibility
        let tintColor;
        switch(enemyType.key) {
            case 'enemy-small':
                tintColor = 0xffcccc;  // Light red
                break;
            case 'enemy-medium':
                tintColor = 0xffaaaa;  // Medium red
                break;
            case 'enemy-large':
                tintColor = 0xff8888;  // Stronger red
                break;
            default:
                tintColor = 0xffffff;
        }
        this.setTint(tintColor);

        // Movement properties
        this.movementPattern = enemyType.movementPattern;
        this.movementTimer = 0;
        this.zigzagDirection = 1;

        // Shooting properties
        this.shootChance = enemyType.shootChance;
        this.lastShot = 0;
        this.shootCooldown = 2000; // 2 seconds between shots

        // Set initial velocity
        this.setVelocityY(this.baseSpeed);

        // Enable collision
        this.setCollideWorldBounds(false);

        // Add subtle pulse effect for visibility
        this.glowTween = scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.85 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // DEBUG: Log enemy creation
        console.log('Enemy created:', {
            type: enemyType.key,
            x: this.x,
            y: this.y,
            visible: this.visible,
            active: this.active,
            alpha: this.alpha,
            texture: this.texture.key
        });
    }

    takeDamage(damage = 1) {
        this.health -= damage;

        // Flash effect on hit
        this.setTint(0xff0000);

        // Store the timer so we can cancel it if enemy is destroyed
        if (this.flashTimer) {
            this.flashTimer.remove();
        }
        this.flashTimer = this.scene.time.delayedCall(100, () => {
            if (this.active && this.scene) {
                // Restore original tint based on enemy type
                let tintColor;
                switch(this.enemyType.key) {
                    case 'enemy-small':
                        tintColor = 0xffcccc;
                        break;
                    case 'enemy-medium':
                        tintColor = 0xffaaaa;
                        break;
                    case 'enemy-large':
                        tintColor = 0xff8888;
                        break;
                    default:
                        tintColor = 0xffffff;
                }
                this.setTint(tintColor);
            }
            this.flashTimer = null;
        });

        if (this.health <= 0) {
            this.die();
            return true; // Enemy destroyed
        }
        return false; // Enemy still alive
    }

    die() {
        try {
            if (!this.scene || !this.active) return;

            // Increase Combo
            if (this.scene.scoreManager && this.scene.scoreManager.increaseCombo) {
                this.scene.scoreManager.increaseCombo();
            }

            // Award score with multiplier
            let points = this.scoreValue;
            if (this.scene.scoreManager && this.scene.scoreManager.addScore) {
                points = this.scene.scoreManager.addScore(this.scoreValue);
            }

            // Show floating score
            if (this.scene.showFloatingText) {
                const multiplier = this.scene.scoreManager ? this.scene.scoreManager.getMultiplier() : 1;
                this.scene.showFloatingText(
                    this.x,
                    this.y,
                    `+${points}${multiplier > 1 ? ' x' + multiplier : ''}`
                );
            }

            // Screen Shake for large enemies
            if (this.enemyType && this.enemyType.key === 'enemy-large' && this.scene.shakeCamera) {
                this.scene.shakeCamera(200, 0.02);
            }

            // Notify wave manager
            if (this.scene.waveManager && this.scene.waveManager.enemyDestroyed) {
                this.scene.waveManager.enemyDestroyed();
            }

            // Try to drop power-up
            if (this.scene.tryDropPowerUp) {
                this.scene.tryDropPowerUp(this.x, this.y);
            }

            // Play explosion sound
            if (this.scene.explosionSound) {
                this.scene.explosionSound.play({ volume: 0.3 });
            }

            // Play explosion animation
            if (this.scene.add) {
                const explosion = this.scene.add.sprite(this.x, this.y, 'explosion1');
                explosion.setScale(1.5);
                explosion.play('explode');

                explosion.on('animationcomplete', () => {
                    if (explosion && explosion.scene) {
                        explosion.destroy();
                    }
                });
            }

            // Destroy enemy
            this.destroy();
        } catch (error) {
            console.error('Error in Enemy.die():', error);
            // Make sure enemy is destroyed even if there's an error
            try {
                this.destroy();
            } catch (e) {
                // Ignore destroy errors
            }
        }
    }

    destroy(fromScene) {
        // Clean up flash timer if it exists
        if (this.flashTimer) {
            this.flashTimer.remove();
            this.flashTimer = null;
        }

        // Clean up glow tween
        if (this.glowTween) {
            this.glowTween.stop();
            this.glowTween = null;
        }

        super.destroy(fromScene);
    }

    shoot(time) {
        if (time - this.lastShot < this.shootCooldown) return;

        // Check if should shoot based on chance
        if (Math.random() < this.shootChance) {
            const bullet = new EnemyBullet(this.scene, this.x, this.y + 20);
            this.scene.enemyBullets.add(bullet);
            this.lastShot = time;
        }
    }

    updateMovement(time, delta) {
        this.movementTimer += delta;

        switch (this.movementPattern) {
            case 'straight':
                // Just move straight down (already set in constructor)
                break;

            case 'zigzag':
                // Zigzag side to side
                if (this.movementTimer > 500) {
                    this.zigzagDirection *= -1;
                    this.movementTimer = 0;
                }
                this.setVelocityX(this.zigzagDirection * 100);
                break;

            case 'dive':
                // Occasional dive attacks toward player
                if (this.movementTimer > 3000 && this.scene.player && this.scene.player.isAlive && this.body) {
                    const angle = Phaser.Math.Angle.Between(
                        this.x, this.y,
                        this.scene.player.x, this.scene.player.y
                    );
                    this.scene.physics.velocityFromRotation(angle, this.baseSpeed * 2, this.body.velocity);
                    this.movementTimer = 0;
                } else if (this.movementTimer < 500 && this.body) {
                    // Reset to downward movement after dive
                    this.setVelocityY(this.baseSpeed);
                }
                break;
        }
    }

    update(time, delta) {
        // Call parent's preUpdate for proper sprite updates
        if (this.scene && this.active) {
            // Update movement pattern
            this.updateMovement(time, delta);

            // Try to shoot
            this.shoot(time);

            // Destroy enemy if it goes below the screen
            if (this.y > this.scene.game.config.height + 50) {
                // Count as escaped (not destroyed by player)
                if (this.scene.waveManager) {
                    this.scene.waveManager.enemyEscaped();
                }
                this.destroy();
            }
        }
    }
}
