import { ENEMY_BULLET_SPEED } from '../utils/constants.js';

export default class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy-bullet');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set scale (larger for visibility)
        this.setScale(1.2);

        // Set velocity (move downward)
        this.setVelocityY(ENEMY_BULLET_SPEED);

        // Tint it red to distinguish from player bullets
        this.setTint(0xff4444);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Destroy bullet if it goes below the screen
        if (this.y > this.scene.game.config.height + 10) {
            this.destroy();
        }
    }
}
