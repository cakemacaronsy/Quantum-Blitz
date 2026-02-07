import { POWERUP_SPEED, POWERUP_SCALE, POWERUP_TYPES } from '../utils/constants.js';

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Determine sprite key based on type
        let spriteKey;
        let tintColor;
        switch(type) {
            case POWERUP_TYPES.SPREAD_SHOT:
                spriteKey = 'powerup1';
                tintColor = 0x00ffff;  // Cyan
                break;
            case POWERUP_TYPES.RAPID_FIRE:
                spriteKey = 'powerup2';
                tintColor = 0x00ff00;  // Green
                break;
            case POWERUP_TYPES.SHIELD:
                spriteKey = 'powerup3';
                tintColor = 0xffff00;  // Yellow
                break;
            case POWERUP_TYPES.HOMING_MISSILE:
                spriteKey = 'powerup4';
                tintColor = 0xff00ff;  // Magenta
                break;
            case POWERUP_TYPES.LASER_BEAM:
                spriteKey = 'powerup-laser';
                tintColor = 0x4444ff;  // Blue
                break;
            case POWERUP_TYPES.BACK_SHOOTER:
                spriteKey = 'powerup-backshoot';
                tintColor = 0xffaa00;  // Orange
                break;
            case POWERUP_TYPES.OVERCLOCK:
                spriteKey = 'powerup-overclock';
                tintColor = 0xff4444;  // Red
                break;
            default:
                spriteKey = 'powerup1';
                tintColor = 0x00ffff;
        }

        super(scene, x, y, spriteKey);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set properties
        this.powerupType = type;
        this.setScale(POWERUP_SCALE);
        this.setTint(tintColor);
        this.tintColor = tintColor;

        // Set velocity (drift downward)
        this.setVelocityY(POWERUP_SPEED);

        // Add floating animation
        this.floatTween = scene.tweens.add({
            targets: this,
            y: this.y + 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add rotation
        this.rotateTween = scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        // Add acid/glow pulse effect
        this.scaleTween = scene.tweens.add({
            targets: this,
            scale: { from: POWERUP_SCALE, to: POWERUP_SCALE * 1.3 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add alpha pulse for extra visibility
        this.alphaTween = scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.6 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    destroy(fromScene) {
        // Stop tweens before destroying
        if (this.floatTween) {
            this.floatTween.stop();
            this.floatTween = null;
        }
        if (this.rotateTween) {
            this.rotateTween.stop();
            this.rotateTween = null;
        }
        if (this.scaleTween) {
            this.scaleTween.stop();
            this.scaleTween = null;
        }
        if (this.alphaTween) {
            this.alphaTween.stop();
            this.alphaTween = null;
        }

        super.destroy(fromScene);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Destroy if goes off screen
        if (this.y > this.scene.game.config.height + 50) {
            this.destroy();
        }
    }

    getType() {
        return this.powerupType;
    }
}
