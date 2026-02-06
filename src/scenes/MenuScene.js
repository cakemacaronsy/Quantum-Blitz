export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Load background
        this.load.image('background', 'assets/backgrounds/space-bg.png');
    }

    create() {
        // Add scrolling background
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

        // Overlay for better text visibility
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.4);
        overlay.fillRect(0, 0, 800, 600);

        // Title
        const titleText = this.add.text(400, 150, 'SPACE SHOOTER', {
            fontSize: '72px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#004444',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 10, stroke: true, fill: true }
        });
        titleText.setOrigin(0.5);

        // Title Pulse Tween
        this.tweens.add({
            targets: titleText,
            scale: { from: 1, to: 1.05 },
            alpha: { from: 1, to: 0.9 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        const subtitleText = this.add.text(400, 230, 'RETRO EDITION', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: '"Orbitron", sans-serif',
            letterSpacing: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff00ff', blur: 5, stroke: true, fill: true }
        });
        subtitleText.setOrigin(0.5);

        // Start button
        const startText = this.add.text(400, 340, 'PRESS SPACE TO START', {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
        });
        startText.setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Controls info - Footer style
        const controlsY = 500;

        this.add.text(400, controlsY, 'CONTROLS', {
            fontSize: '20px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        const controlsStyle = {
            fontSize: '16px',
            fill: '#cccccc',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 2
        };

        this.add.text(400, controlsY + 30, 'ARROWS / WASD - MOVE', controlsStyle).setOrigin(0.5);
        this.add.text(400, controlsY + 55, 'SPACE - SHOOT', controlsStyle).setOrigin(0.5);
        this.add.text(400, controlsY + 80, 'ESC / P - PAUSE', controlsStyle).setOrigin(0.5);

        // High score display (Top Right)
        const highScore = this.getHighScore();
        this.add.text(780, 20, `HIGH SCORE: ${highScore}`, {
            fontSize: '18px',
            fill: '#ffaa00',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        // Start game on space
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }

    update() {
        // Scroll background
        this.background.tilePositionY -= 0.5;
    }

    getHighScore() {
        try {
            const saved = localStorage.getItem('spaceShooterHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            return 0;
        }
    }
}
