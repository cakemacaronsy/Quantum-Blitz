export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalWave = data.wave || 0;
        this.highScore = data.highScore || 0;
        this.isNewHighScore = data.isNewHighScore || false;
    }

    create() {
        // Add background (dark overlay)
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

        // Game Over text
        const gameOverText = this.add.text(400, 150, 'GAME OVER', {
            fontSize: '72px',
            fill: '#ff0000',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#550000',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff0000', blur: 20, stroke: true, fill: true }
        });
        gameOverText.setOrigin(0.5);

        // Stats
        const statsStyle = {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00cccc', blur: 4, stroke: true, fill: true }
        };

        this.add.text(400, 250, `FINAL SCORE: ${this.finalScore}`, statsStyle).setOrigin(0.5);
        this.add.text(400, 290, `WAVE REACHED: ${this.finalWave}`, statsStyle).setOrigin(0.5);

        // High score indicator
        if (this.isNewHighScore) {
            const newHighText = this.add.text(400, 340, '🌟 NEW HIGH SCORE! 🌟', {
                fontSize: '32px',
                fill: '#ffff00',
                fontFamily: '"Orbitron", sans-serif',
                stroke: '#000',
                strokeThickness: 4,
                shadow: { offsetX: 0, offsetY: 0, color: '#ffff00', blur: 10, stroke: true, fill: true }
            });
            newHighText.setOrigin(0.5);

            // Pulse animation
            this.tweens.add({
                targets: newHighText,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else {
            this.add.text(400, 340, `HIGH SCORE: ${this.highScore}`, {
                fontSize: '24px',
                fill: '#aaaaaa',
                fontFamily: '"Orbitron", sans-serif',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);
        }

        // Instructions
        const instructionsStyle = {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4
        };

        const restartText = this.add.text(400, 430, 'SPACE - RESTART', instructionsStyle);
        restartText.setOrigin(0.5);

        const menuText = this.add.text(400, 470, 'Q - MAIN MENU', instructionsStyle);
        menuText.setOrigin(0.5);

        // Blinking effect for instructions
        this.tweens.add({
            targets: [restartText, menuText],
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Setup inputs
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.once('keydown-Q', () => {
            this.scene.start('MenuScene');
        });
    }
}
