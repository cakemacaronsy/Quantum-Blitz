import { HOMING_MISSILE_SPEED, HOMING_MISSILE_TURN_RATE } from '../utils/constants.js';

export default class HomingMissile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'homing-missile');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set properties
        this.setScale(1.2);
        this.setTint(0x00ffff);

        // Initial upward velocity
        this.setVelocityY(-HOMING_MISSILE_SPEED);

        // Lifespan (5 seconds)
        this.spawnTime = scene.time.now;
        this.lifespan = 5000;

        // Current angle of travel
        this.travelAngle = -Math.PI / 2; // straight up
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Self-destruct when lifespan exceeded
        if (time - this.spawnTime > this.lifespan) {
            this.destroy();
            return;
        }

        // Destroy if off-screen
        if (this.y < -20 || this.y > this.scene.game.config.height + 20 ||
            this.x < -20 || this.x > this.scene.game.config.width + 20) {
            this.destroy();
            return;
        }

        // Find nearest enemy and steer toward it
        const target = this.findNearestEnemy();
        if (target) {
            const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

            // Calculate angle difference
            let angleDiff = targetAngle - this.travelAngle;

            // Normalize to [-PI, PI]
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            // Clamp turn rate
            if (angleDiff > HOMING_MISSILE_TURN_RATE) {
                this.travelAngle += HOMING_MISSILE_TURN_RATE;
            } else if (angleDiff < -HOMING_MISSILE_TURN_RATE) {
                this.travelAngle -= HOMING_MISSILE_TURN_RATE;
            } else {
                this.travelAngle = targetAngle;
            }
        }

        // Set velocity from angle
        this.setVelocity(
            Math.cos(this.travelAngle) * HOMING_MISSILE_SPEED,
            Math.sin(this.travelAngle) * HOMING_MISSILE_SPEED
        );

        // Rotate sprite to face travel direction
        this.rotation = this.travelAngle + Math.PI / 2;
    }

    findNearestEnemy() {
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
}
