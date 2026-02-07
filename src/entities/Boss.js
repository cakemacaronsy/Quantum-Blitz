import EnemyBullet from './EnemyBullet.js';
import PowerUp from './PowerUp.js';
import { BOSS_CONFIG, GAME_WIDTH, GAME_HEIGHT, POWERUP_TYPES } from '../utils/constants.js';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, wave = 5) {
        super(scene, x, y, BOSS_CONFIG.key);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set properties
        this.setScale(BOSS_CONFIG.scale);
        // Wave-scaled HP: 30 + wave*5
        this.health = BOSS_CONFIG.health + wave * 5;
        this.maxHealth = this.health;
        this.scoreValue = BOSS_CONFIG.score;
        this.baseSpeed = BOSS_CONFIG.speed;

        // Phase tracking
        this.currentPhase = 1;
        this.phaseConfig = BOSS_CONFIG.phases[1];

        // Movement
        this.moveDirection = 1;
        this.enteredArena = false;
        this.targetY = 80;

        // Shooting
        this.lastShot = 0;
        this.shootCooldown = this.phaseConfig.shootCooldown;

        // Dive attack (phase 3)
        this.isDiving = false;
        this.diveTimer = 0;
        this.diveReturnY = this.targetY;

        // Enter from top
        this.setVelocityY(60);
        this.setCollideWorldBounds(false);

        // Health bar graphics
        this.healthBarBg = null;
        this.healthBarFill = null;
        this.healthBarBorder = null;
        this.bossLabel = null;
        this.createHealthBar();

        // Flash effect
        this.flashTimer = null;
    }

    createHealthBar() {
        const barWidth = 400;
        const barHeight = 16;
        const barX = (GAME_WIDTH - barWidth) / 2;
        const barY = 58;

        // Background
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x333333, 0.8);
        this.healthBarBg.fillRect(barX, barY, barWidth, barHeight);
        this.healthBarBg.setDepth(95);

        // Fill
        this.healthBarFill = this.scene.add.graphics();
        this.healthBarFill.setDepth(96);

        // Border
        this.healthBarBorder = this.scene.add.graphics();
        this.healthBarBorder.lineStyle(2, 0xff0000, 1);
        this.healthBarBorder.strokeRect(barX, barY, barWidth, barHeight);
        this.healthBarBorder.setDepth(97);

        // Boss label
        this.bossLabel = this.scene.add.text(GAME_WIDTH / 2, barY - 14, 'STEEL EAGLE', {
            fontSize: '14px',
            fill: '#ff4444',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 3,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff0000', blur: 6, stroke: true, fill: true }
        });
        this.bossLabel.setOrigin(0.5);
        this.bossLabel.setDepth(97);

        this.updateHealthBar();
    }

    updateHealthBar() {
        if (!this.healthBarFill) return;

        const barWidth = 400;
        const barHeight = 16;
        const barX = (GAME_WIDTH - barWidth) / 2;
        const barY = 58;
        const healthPct = this.health / this.maxHealth;

        this.healthBarFill.clear();

        // Color based on health
        let color = 0x00ff00;
        if (healthPct < 0.25) {
            color = 0xff0000;
        } else if (healthPct < 0.5) {
            color = 0xffaa00;
        }

        this.healthBarFill.fillStyle(color, 1);
        this.healthBarFill.fillRect(barX, barY, barWidth * healthPct, barHeight);
    }

    updatePhase() {
        const healthPct = this.health / this.maxHealth;
        let newPhase;

        if (healthPct <= 0.25) {
            newPhase = 3;
        } else if (healthPct <= 0.5) {
            newPhase = 2;
        } else {
            newPhase = 1;
        }

        if (newPhase !== this.currentPhase) {
            this.currentPhase = newPhase;
            this.phaseConfig = BOSS_CONFIG.phases[newPhase];
            this.shootCooldown = this.phaseConfig.shootCooldown;

            // Phase transition flash
            if (this.scene) {
                this.scene.shakeCamera(300, 0.03);
                this.scene.showFloatingText(this.x, this.y - 60, `PHASE ${newPhase}!`, '#ff4444');
            }
        }
    }

    takeDamage(damage = 1) {
        this.health -= damage;

        // Flash effect
        this.setTint(0xff0000);
        if (this.flashTimer) {
            this.flashTimer.remove();
        }
        this.flashTimer = this.scene.time.delayedCall(80, () => {
            if (this.active && this.scene) {
                this.clearTint();
            }
            this.flashTimer = null;
        });

        this.updateHealthBar();
        this.updatePhase();

        if (this.health <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    die() {
        try {
            if (!this.scene || !this.active) return;

            // Increase combo
            if (this.scene.scoreManager && this.scene.scoreManager.increaseCombo) {
                this.scene.scoreManager.increaseCombo();
            }

            // Award score
            if (this.scene.scoreManager && this.scene.scoreManager.addScore) {
                const points = this.scene.scoreManager.addScore(this.scoreValue);
                if (this.scene.showFloatingText) {
                    this.scene.showFloatingText(this.x, this.y, `+${points}`, '#ffff00');
                }
            }

            // "BOSS DEFEATED!" floating text
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(this.x, this.y - 40, 'BOSS DEFEATED!', '#00ffff');
            }

            // Big screen shake
            if (this.scene.shakeCamera) {
                this.scene.shakeCamera(500, 0.05);
            }

            // Play explosion sound
            if (this.scene.explosionSound) {
                this.scene.explosionSound.play();
            }

            // Save position for explosions and power-up drop
            const deathX = this.x;
            const deathY = this.y;

            // Multiple explosions for dramatic effect
            const sceneRef = this.scene;
            for (let i = 0; i < 5; i++) {
                sceneRef.time.delayedCall(i * 200, () => {
                    if (!sceneRef || !sceneRef.add) return;
                    const offsetX = Phaser.Math.Between(-50, 50);
                    const offsetY = Phaser.Math.Between(-50, 50);
                    const explosion = sceneRef.add.sprite(deathX + offsetX, deathY + offsetY, 'explosion1');
                    explosion.setScale(2.5);
                    explosion.play('explode');
                    explosion.on('animationcomplete', () => {
                        if (explosion && explosion.scene) explosion.destroy();
                    });
                });
            }

            // Guaranteed power-up drop
            if (sceneRef.powerUps) {
                const types = Object.values(POWERUP_TYPES);
                const type = Phaser.Utils.Array.GetRandom(types);
                const powerUp = new PowerUp(sceneRef, deathX, deathY, type);
                sceneRef.powerUps.add(powerUp);
            }

            // Clean up health bar
            this.destroyHealthBar();

            // Notify wave manager
            if (sceneRef.waveManager && sceneRef.waveManager.bossDefeated) {
                sceneRef.waveManager.bossDefeated();
            }

            // Notify game scene
            if (sceneRef.onBossDefeated) {
                sceneRef.onBossDefeated();
            }

            this.destroy();
        } catch (error) {
            console.error('Error in Boss.die():', error);
            try { this.destroy(); } catch (e) { /* ignore */ }
        }
    }

    destroyHealthBar() {
        if (this.healthBarBg) { this.healthBarBg.destroy(); this.healthBarBg = null; }
        if (this.healthBarFill) { this.healthBarFill.destroy(); this.healthBarFill = null; }
        if (this.healthBarBorder) { this.healthBarBorder.destroy(); this.healthBarBorder = null; }
        if (this.bossLabel) { this.bossLabel.destroy(); this.bossLabel = null; }
    }

    shoot(time) {
        if (time - this.lastShot < this.shootCooldown) return;
        if (!this.scene || !this.scene.enemyBullets) return;

        this.lastShot = time;

        // Play sound
        if (this.scene.shotSound) {
            this.scene.shotSound.play({ volume: 0.3 });
        }

        switch (this.phaseConfig.pattern) {
            case 'side-to-side':
                // Single aimed shot
                this.shootSingle();
                break;
            case 'spread':
                // 3-way spread
                this.shootSpread();
                break;
            case 'aggressive':
                // 5-way spread + aimed
                this.shootAggressive();
                break;
        }
    }

    shootSingle() {
        const bullet = new EnemyBullet(this.scene, this.x, this.y + 40, 0, undefined, 0xaa44ff);
        this.scene.enemyBullets.add(bullet);
    }

    shootSpread() {
        for (let angle = -30; angle <= 30; angle += 30) {
            const bullet = new EnemyBullet(this.scene, this.x, this.y + 40, 0, undefined, 0xaa44ff);
            const radians = Phaser.Math.DegToRad(90 + angle);
            const speed = 250;
            bullet.setVelocity(Math.cos(radians) * speed, Math.sin(radians) * speed);
            this.scene.enemyBullets.add(bullet);
        }
    }

    shootAggressive() {
        // 5-way spread
        for (let angle = -40; angle <= 40; angle += 20) {
            const bullet = new EnemyBullet(this.scene, this.x, this.y + 40, 0, undefined, 0xaa44ff);
            const radians = Phaser.Math.DegToRad(90 + angle);
            const speed = 280;
            bullet.setVelocity(Math.cos(radians) * speed, Math.sin(radians) * speed);
            this.scene.enemyBullets.add(bullet);
        }
    }

    updateMovement(time, delta) {
        // Enter the arena first
        if (!this.enteredArena) {
            if (this.y >= this.targetY) {
                this.enteredArena = true;
                this.setVelocityY(0);
            }
            return;
        }

        const speed = this.baseSpeed * this.phaseConfig.speedMultiplier;

        switch (this.phaseConfig.pattern) {
            case 'side-to-side':
                // Simple side-to-side
                this.setVelocityX(this.moveDirection * speed);
                if (this.x > GAME_WIDTH - 80) {
                    this.moveDirection = -1;
                } else if (this.x < 80) {
                    this.moveDirection = 1;
                }
                this.setVelocityY(0);
                break;

            case 'spread':
                // Faster side-to-side with slight vertical bobbing
                this.setVelocityX(this.moveDirection * speed);
                if (this.x > GAME_WIDTH - 80) {
                    this.moveDirection = -1;
                } else if (this.x < 80) {
                    this.moveDirection = 1;
                }
                // Vertical bob
                const bobY = Math.sin(time * 0.003) * 30;
                this.y = this.targetY + bobY;
                break;

            case 'aggressive':
                // Occasional dive attacks
                this.diveTimer += delta;
                if (!this.isDiving) {
                    // Normal side-to-side
                    this.setVelocityX(this.moveDirection * speed);
                    if (this.x > GAME_WIDTH - 80) {
                        this.moveDirection = -1;
                    } else if (this.x < 80) {
                        this.moveDirection = 1;
                    }

                    // Start a dive every 4 seconds
                    if (this.diveTimer > 4000 && this.scene.player && this.scene.player.isAlive) {
                        this.isDiving = true;
                        this.diveTimer = 0;
                        this.diveReturnY = this.y;
                        // Dive toward player
                        const angle = Phaser.Math.Angle.Between(
                            this.x, this.y,
                            this.scene.player.x, this.scene.player.y
                        );
                        this.scene.physics.velocityFromRotation(angle, speed * 1.5, this.body.velocity);
                    }
                } else {
                    // Return to top after diving past a certain Y
                    if (this.y > GAME_HEIGHT * 0.6 || this.diveTimer > 1500) {
                        this.isDiving = false;
                        this.diveTimer = 0;
                        // Return to arena top
                        const returnAngle = Phaser.Math.Angle.Between(
                            this.x, this.y,
                            GAME_WIDTH / 2, this.diveReturnY
                        );
                        this.scene.physics.velocityFromRotation(returnAngle, speed, this.body.velocity);
                    }
                }
                break;
        }
    }

    update(time, delta) {
        if (!this.scene || !this.active) return;

        this.updateMovement(time, delta);

        if (this.enteredArena) {
            this.shoot(time);
        }
    }

    destroy(fromScene) {
        if (this.flashTimer) {
            this.flashTimer.remove();
            this.flashTimer = null;
        }
        this.destroyHealthBar();
        super.destroy(fromScene);
    }
}
