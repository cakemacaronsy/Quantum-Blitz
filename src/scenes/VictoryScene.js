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

        // --- Title: "CONGRATULATIONS" with staggered fade-in ---
        const victoryText = this.add.text(400, 80, 'CONGRATULATIONS', {
            fontSize: '56px',
            fill: '#ffff00',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#ff8800',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: '#ffff00', blur: 20, stroke: true, fill: true }
        });
        victoryText.setOrigin(0.5);
        victoryText.setAlpha(0);
        victoryText.setScale(0.5);

        this.tweens.add({
            targets: victoryText,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });

        // Gentle pulse after entrance
        this.time.delayedCall(800, () => {
            this.tweens.add({
                targets: victoryText,
                scale: { from: 1, to: 1.05 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // --- Subtitle ---
        const subtitleText = this.add.text(400, 155, 'The Steel Eagle Has Been Destroyed', {
            fontSize: '22px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 8, stroke: true, fill: true }
        });
        subtitleText.setOrigin(0.5);
        subtitleText.setAlpha(0);

        this.tweens.add({
            targets: subtitleText,
            alpha: 1,
            delay: 600,
            duration: 600,
            ease: 'Power2'
        });

        // --- Flavor text ---
        const flavorText = this.add.text(400, 195, 'The galaxy is safe... for now.', {
            fontSize: '16px',
            fill: '#88aacc',
            fontFamily: '"Orbitron", sans-serif',
            fontStyle: 'italic',
            stroke: '#000',
            strokeThickness: 2
        });
        flavorText.setOrigin(0.5);
        flavorText.setAlpha(0);

        this.tweens.add({
            targets: flavorText,
            alpha: 1,
            delay: 1200,
            duration: 800,
            ease: 'Power2'
        });

        // --- Stats panel ---
        const statsStyle = {
            fontSize: '26px',
            fill: '#fff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00cccc', blur: 4, stroke: true, fill: true }
        };

        const scoreText = this.add.text(400, 270, `FINAL SCORE: ${this.finalScore}`, statsStyle);
        scoreText.setOrigin(0.5);
        scoreText.setAlpha(0);

        const waveText = this.add.text(400, 310, `WAVES SURVIVED: ${this.finalWave}`, statsStyle);
        waveText.setOrigin(0.5);
        waveText.setAlpha(0);

        // Stagger stats fade-in
        this.tweens.add({ targets: scoreText, alpha: 1, delay: 1600, duration: 500 });
        this.tweens.add({ targets: waveText, alpha: 1, delay: 1900, duration: 500 });

        // --- High score ---
        if (this.isNewHighScore) {
            const newHighText = this.add.text(400, 365, 'NEW HIGH SCORE!', {
                fontSize: '32px',
                fill: '#ffff00',
                fontFamily: '"Orbitron", sans-serif',
                stroke: '#000',
                strokeThickness: 4,
                shadow: { offsetX: 0, offsetY: 0, color: '#ffff00', blur: 10, stroke: true, fill: true }
            });
            newHighText.setOrigin(0.5);
            newHighText.setAlpha(0);

            this.tweens.add({
                targets: newHighText,
                alpha: 1,
                delay: 2200,
                duration: 500,
                onComplete: () => {
                    this.tweens.add({
                        targets: newHighText,
                        scale: { from: 1, to: 1.1 },
                        duration: 600,
                        yoyo: true,
                        repeat: -1
                    });
                }
            });
        } else {
            const highText = this.add.text(400, 365, `HIGH SCORE: ${this.highScore}`, {
                fontSize: '24px',
                fill: '#aaaaaa',
                fontFamily: '"Orbitron", sans-serif',
                stroke: '#000',
                strokeThickness: 3
            });
            highText.setOrigin(0.5);
            highText.setAlpha(0);

            this.tweens.add({ targets: highText, alpha: 1, delay: 2200, duration: 500 });
        }

        // --- Thank you line ---
        const thanksText = this.add.text(400, 420, 'Thanks for playing!', {
            fontSize: '20px',
            fill: '#aaddff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 3
        });
        thanksText.setOrigin(0.5);
        thanksText.setAlpha(0);

        this.tweens.add({ targets: thanksText, alpha: 1, delay: 2600, duration: 600 });

        // --- Action prompts (appear last) ---
        const instructionsStyle = {
            fontSize: '22px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4
        };

        const replayText = this.add.text(400, 490, 'SPACE - PLAY AGAIN', instructionsStyle);
        replayText.setOrigin(0.5);
        replayText.setAlpha(0);

        const menuText = this.add.text(400, 530, 'Q - MAIN MENU', instructionsStyle);
        menuText.setOrigin(0.5);
        menuText.setAlpha(0);

        // Fade in prompts, then start blinking
        this.tweens.add({
            targets: [replayText, menuText],
            alpha: 1,
            delay: 3000,
            duration: 600,
            onComplete: () => {
                this.tweens.add({
                    targets: [replayText, menuText],
                    alpha: 0.4,
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // --- Inputs (only active after prompts appear) ---
        this.time.delayedCall(3000, () => {
            this.input.keyboard.once('keydown-SPACE', () => {
                this.scene.start('GameScene');
            });

            this.input.keyboard.once('keydown-Q', () => {
                this.scene.start('MenuScene');
            });
        });
    }
}
