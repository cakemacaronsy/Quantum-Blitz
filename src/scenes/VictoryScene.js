export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalWave = data.wave || 0;
        this.highScore = data.highScore || 0;
        this.isNewHighScore = data.isNewHighScore || false;
    }

    create() {
        // Dark overlay background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

        // Victory text
        const victoryText = this.add.text(400, 100, 'VICTORY!', {
            fontSize: '80px',
            fill: '#ffff00',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#ff8800',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: '#ffff00', blur: 20, stroke: true, fill: true }
        });
        victoryText.setOrigin(0.5);

        // Pulse animation on title
        this.tweens.add({
            targets: victoryText,
            scale: { from: 1, to: 1.08 },
            alpha: { from: 1, to: 0.85 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Boss defeated subtitle
        const subtitleText = this.add.text(400, 180, 'BOSS DEFEATED', {
            fontSize: '28px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 8, stroke: true, fill: true }
        });
        subtitleText.setOrigin(0.5);

        // Stats
        const statsStyle = {
            fontSize: '26px',
            fill: '#fff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00cccc', blur: 4, stroke: true, fill: true }
        };

        this.add.text(400, 260, `FINAL SCORE: ${this.finalScore}`, statsStyle).setOrigin(0.5);
        this.add.text(400, 300, `WAVE REACHED: ${this.finalWave}`, statsStyle).setOrigin(0.5);

        // High score
        if (this.isNewHighScore) {
            const newHighText = this.add.text(400, 350, '🌟 NEW HIGH SCORE! 🌟', {
                fontSize: '32px',
                fill: '#ffff00',
                fontFamily: '"Orbitron", sans-serif',
                stroke: '#000',
                strokeThickness: 4,
                shadow: { offsetX: 0, offsetY: 0, color: '#ffff00', blur: 10, stroke: true, fill: true }
            });
            newHighText.setOrigin(0.5);

            this.tweens.add({
                targets: newHighText,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else {
            this.add.text(400, 350, `HIGH SCORE: ${this.highScore}`, {
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

        const continueText = this.add.text(400, 440, 'SPACE - CONTINUE PLAYING', instructionsStyle);
        continueText.setOrigin(0.5);

        const menuText = this.add.text(400, 480, 'Q - MAIN MENU', instructionsStyle);
        menuText.setOrigin(0.5);

        // Blink
        this.tweens.add({
            targets: [continueText, menuText],
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Inputs
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene', { continueFromWave: this.finalWave });
        });

        this.input.keyboard.once('keydown-Q', () => {
            this.scene.start('MenuScene');
        });
    }
}
