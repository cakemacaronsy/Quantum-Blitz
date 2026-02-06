import { BULLET_SPEED, BULLET_SCALE } from '../utils/constants.js';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set scale
        this.setScale(BULLET_SCALE);

        // Set velocity (move upward)
        this.setVelocityY(-BULLET_SPEED);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Destroy bullet if it goes off screen (top or bottom for back-shooter)
        if (this.y < -10 || this.y > this.scene.game.config.height + 10) {
            this.destroy();
        }
    }
}
