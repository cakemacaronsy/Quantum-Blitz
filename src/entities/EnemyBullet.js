import { ENEMY_BULLET_SPEED } from '../utils/constants.js';

export default class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, velocityX = 0, velocityY = ENEMY_BULLET_SPEED, tint = 0xff4444) {
        super(scene, x, y, 'enemy-bullet');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set scale (larger for visibility)
        this.setScale(1.2);

        // Set velocity (supports angled bullets)
        this.setVelocity(velocityX, velocityY);

        // Tint to distinguish from player bullets (color varies by enemy type)
        this.setTint(tint);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        // Destroy bullet if it exits any screen edge
        if (this.y > height + 10 || this.y < -10 ||
            this.x > width + 10 || this.x < -10) {
            this.destroy();
        }
    }
}
