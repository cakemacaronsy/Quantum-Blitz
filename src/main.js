import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/constants.js';

// Global error handler to catch and log any unhandled errors
window.addEventListener('error', (event) => {
    console.error('CRITICAL ERROR DETECTED:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    alert(`Game Error: ${event.message}\nCheck console (F12) for details.`);
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, PauseScene, GameOverScene, VictoryScene]
};

console.log('Initializing game...');
const game = new Phaser.Game(config);
console.log('Game initialized successfully');
