export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Semi-transparent background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // Pause text
        const pauseText = this.add.text(400, 200, 'PAUSED', {
            fontSize: '72px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#004444',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 10, stroke: true, fill: true }
        });
        pauseText.setOrigin(0.5);

        // Instructions
        const instructionsStyle = {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4
        };

        this.add.text(400, 320, 'ESC / P - RESUME', instructionsStyle).setOrigin(0.5);
        this.add.text(400, 370, 'R - RESTART GAME', instructionsStyle).setOrigin(0.5);
        this.add.text(400, 420, 'Q - QUIT TO MENU', instructionsStyle).setOrigin(0.5);

        // Setup input handlers
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
        this.input.keyboard.on('keydown-P', () => this.resumeGame());
        this.input.keyboard.on('keydown-R', () => this.restartGame());
        this.input.keyboard.on('keydown-Q', () => this.quitToMenu());
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    restartGame() {
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('GameScene');
    }

    quitToMenu() {
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}
