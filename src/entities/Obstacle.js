import { GAME_HEIGHT } from '../utils/constants.js';

export default class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, obstacleType) {
        super(scene, x, y, obstacleType.key);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Store config
        this.obstacleType = obstacleType;
        this.health = obstacleType.health;
        this.scoreValue = obstacleType.score;

        // Set scale
        this.setScale(obstacleType.scale);

        // Random speed within range
        const speed = Phaser.Math.Between(obstacleType.speed[0], obstacleType.speed[1]);
        this.setVelocityY(speed);

        // Disable world bounds collision
        this.setCollideWorldBounds(false);

        // Type-specific behavior
        if (obstacleType.key === 'asteroid-small') {
            // Slight random horizontal drift
            this.setVelocityX(Phaser.Math.Between(-30, 30));
        } else if (obstacleType.key === 'asteroid-large') {
            // Slow rotation
            this.rotationSpeed = Phaser.Math.FloatBetween(-1, 1);
        } else if (obstacleType.key === 'space-mine') {
            // Sine-wave horizontal bob
            this.baseX = x;
            this.bobTimer = 0;
            this.bobAmplitude = 40;
            this.bobFrequency = 2;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Destroy when off-screen
        if (this.y > GAME_HEIGHT + 60) {
            this.destroy();
            return;
        }

        // Large asteroid rotation
        if (this.obstacleType.key === 'asteroid-large' && this.rotationSpeed) {
            this.rotation += this.rotationSpeed * delta * 0.001;
        }

        // Space mine sine-wave bob
        if (this.obstacleType.key === 'space-mine') {
            this.bobTimer += delta * 0.001;
            this.x = this.baseX + Math.sin(this.bobTimer * this.bobFrequency * Math.PI) * this.bobAmplitude;
        }
    }

    takeDamage(damage = 1) {
        this.health -= damage;

        // Flash effect
        this.setTint(0xff0000);
        if (this.flashTimer) {
            this.flashTimer.remove();
        }
        this.flashTimer = this.scene.time.delayedCall(100, () => {
            if (this.active && this.scene) {
                this.clearTint();
            }
            this.flashTimer = null;
        });

        if (this.health <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    die() {
        try {
            if (!this.scene || !this.active) return;

            // Award score
            if (this.scene.scoreManager && this.scene.scoreManager.addScore) {
                const points = this.scene.scoreManager.addScore(this.scoreValue);

                // Show floating score
                if (this.scene.showFloatingText) {
                    this.scene.showFloatingText(this.x, this.y, `+${points}`);
                }
            }

            // Play explosion animation
            if (this.scene.add) {
                const explosion = this.scene.add.sprite(this.x, this.y, 'explosion1');
                explosion.setScale(this.obstacleType.key === 'asteroid-large' ? 1.5 : 1.0);
                explosion.play('explode');
                explosion.on('animationcomplete', () => {
                    if (explosion && explosion.scene) {
                        explosion.destroy();
                    }
                });
            }

            this.destroy();
        } catch (error) {
            console.error('Error in Obstacle.die():', error);
            try { this.destroy(); } catch (e) { /* ignore */ }
        }
    }

    destroy(fromScene) {
        if (this.flashTimer) {
            this.flashTimer.remove();
            this.flashTimer = null;
        }
        super.destroy(fromScene);
    }
}
