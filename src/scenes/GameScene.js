import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';
import HomingMissile from '../entities/HomingMissile.js';
import Obstacle from '../entities/Obstacle.js';
import PowerUp from '../entities/PowerUp.js';
import WaveManager from '../managers/WaveManager.js';
import ScoreManager from '../managers/ScoreManager.js';
import {
    PLAYER_START_X,
    PLAYER_START_Y,
    GAME_WIDTH,
    GAME_HEIGHT,
    POWERUP_TYPES,
    POWERUP_DROP_CHANCE,
    POWERUP_SCORE
} from '../utils/constants.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Support continuing from a specific wave after boss victory
        this.startFromWave = (data && data.continueFromWave) ? data.continueFromWave : 0;
    }

    preload() {
        // Load player assets
        this.load.image('player', 'assets/player/Ship1.png');

        // Load enemy assets
        this.load.image('enemy-small', 'assets/enemies/enemy-small1.png');
        this.load.image('enemy-medium', 'assets/enemies/enemy-medium1.png');
        this.load.image('enemy-large', 'assets/enemies/enemy-big1.png');

        // Load sentinel asset
        this.load.image('enemy-sentinel', 'assets/enemies/boss/Sentinel.png');

        // Load boss asset
        this.load.image('boss-steel-eagle', 'assets/enemies/boss/steel-eagle.png');

        // Load projectile assets
        this.load.image('bullet', 'assets/projectiles/laser-bolts1.png');
        this.load.image('enemy-bullet', 'assets/projectiles/enemy-bullet.png');

        // Load power-up assets
        this.load.image('powerup1', 'assets/powerups/power-up1.png');
        this.load.image('powerup2', 'assets/powerups/power-up2.png');
        this.load.image('powerup3', 'assets/powerups/power-up3.png');
        this.load.image('powerup4', 'assets/powerups/power-up4.png');

        // Load homing missile asset
        this.load.image('homing-missile', 'assets/projectiles/pulse1.png');

        // Load obstacle assets
        this.load.image('space-mine', 'assets/enemies/boss/observer.png');

        // Load background layers (parallax)
        this.load.image('bg-back', 'assets/backgrounds/blue-back.png');
        this.load.image('bg-stars', 'assets/backgrounds/blue-stars.png');
        this.load.image('background', 'assets/backgrounds/space-bg.png');

        // Load explosion sprites
        this.load.image('explosion1', 'assets/effects/Explosion/explosion1.png');
        this.load.image('explosion2', 'assets/effects/Explosion/explosion2.png');
        this.load.image('explosion3', 'assets/effects/Explosion/explosion3.png');
        this.load.image('explosion4', 'assets/effects/Explosion/explosion4.png');
        this.load.image('explosion5', 'assets/effects/Explosion/explosion5.png');

        // Load audio
        this.load.audio('sfx-shot', 'assets/audio/shot 1.wav');
        this.load.audio('sfx-shot2', 'assets/audio/shot 2.wav');
        this.load.audio('sfx-explosion', 'assets/audio/explosion.wav');
        this.load.audio('sfx-hit', 'assets/audio/hit.wav');

        // Load BGM
        this.load.audio('bgm-gameplay-1', 'assets/audio/bgm/gameplay/starfield-rush-1.wav');
        this.load.audio('bgm-gameplay-2', 'assets/audio/bgm/gameplay/starfield-rush-2.wav');
        this.load.audio('bgm-boss-1', 'assets/audio/bgm/boss/pixel-last-stand-1.wav');
        this.load.audio('bgm-boss-2', 'assets/audio/bgm/boss/pixel-last-stand-2.wav');
    }

    create() {
        // Parallax background layers
        this.bgBack = this.add.tileSprite(400, 300, 800, 600, 'bg-back');
        this.bgStars = this.add.tileSprite(400, 300, 800, 600, 'bg-stars');
        this.bgStars.setAlpha(0.7);
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');
        this.background.setAlpha(0.3); // Blend with parallax layers

        // Create explosion animation (only if not already created from a previous scene run)
        if (!this.anims.exists('explode')) this.anims.create({
            key: 'explode',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' },
                { key: 'explosion5' }
            ],
            frameRate: 15,
            repeat: 0
        });

        // Initialize audio
        this.shotSound = this.sound.add('sfx-shot', { volume: 0.3 });
        this.shotSound2 = this.sound.add('sfx-shot2', { volume: 0.3 });
        this.explosionSound = this.sound.add('sfx-explosion', { volume: 0.4 });
        this.hitSound = this.sound.add('sfx-hit', { volume: 0.3 });

        // Initialize BGM system
        this.initBGM();

        // Initialize managers
        this.scoreManager = new ScoreManager(this);
        this.waveManager = new WaveManager(this);

        // If continuing from a boss victory, set the wave
        if (this.startFromWave > 0) {
            this.waveManager.currentWave = this.startFromWave;
        }

        // Create player
        this.player = new Player(this, PLAYER_START_X, PLAYER_START_Y);

        // Create thruster particle effect
        this.createThrusterParticles();

        // Create groups
        this.enemies = this.add.group({
            runChildUpdate: true
        });

        this.enemyBullets = this.add.group({
            runChildUpdate: true
        });

        this.powerUps = this.add.group({
            runChildUpdate: true
        });

        // Boss reference
        this.boss = null;

        // Homing missiles group
        this.homingMissiles = this.add.group({
            runChildUpdate: true
        });

        // Laser beam graphics layer
        this.laserBeamGraphics = this.add.graphics();
        this.laserBeamGraphics.setDepth(50);

        // Generate textures
        this.generateAsteroidTextures();
        this.generatePowerUpTextures();

        // Obstacle group
        this.obstacles = this.add.group({
            runChildUpdate: true
        });

        // Obstacle spawn timer
        this.lastObstacleSpawn = 0;

        // Setup spawning
        this.lastEnemySpawn = 0;
        this.initialSpawnDelay = 2000; // 2 second delay before first spawn (let wave title show)
        this.gameStartTime = 0;

        // Setup collisions
        this.setupCollisions();

        // Create UI
        this.createUI();

        // Setup pause handler
        this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
        this.input.keyboard.on('keydown-P', () => this.pauseGame());

        // God mode toggle (press 1 for invincible testing mode)
        this.input.keyboard.on('keydown-ONE', () => {
            if (this.player && this.player.isAlive) {
                this.player.toggleGodMode();
                this.showFloatingText(
                    this.player.x,
                    this.player.y - 40,
                    this.player.godMode ? 'GOD MODE ON' : 'GOD MODE OFF',
                    this.player.godMode ? '#00ff00' : '#ff4444'
                );
            }
        });

        // Debug: press 2 to spawn boss for testing
        this.input.keyboard.on('keydown-TWO', () => {
            if (this.player && this.player.isAlive) {
                this.waveManager.bossActive = true;
                this.spawnBoss();
                this.showFloatingText(this.player.x, this.player.y - 40, 'BOSS SPAWNED', '#ff4444');
            }
        });

        // Start first wave
        this.waveManager.startNextWave();

        console.log('GameScene.create() complete. WaveManager state:', {
            waveActive: this.waveManager.waveActive,
            wavePaused: this.waveManager.wavePaused,
            enemiesInWave: this.waveManager.enemiesInWave,
            enemiesSpawned: this.waveManager.enemiesSpawned
        });
    }

    // ---- BGM System ----
    initBGM() {
        this.bgmVolume = 0.4;
        this.bgmFadeDuration = 1500; // crossfade duration in ms

        // Gameplay tracks (interchange on loop)
        this.gameplayTracks = ['bgm-gameplay-1', 'bgm-gameplay-2'];
        this.currentGameplayIndex = Phaser.Math.Between(0, 1); // start random
        this.currentBGM = null;

        // Boss tracks (pick one randomly)
        this.bossTracks = ['bgm-boss-1', 'bgm-boss-2'];
        this.bossBGM = null;

        this.isBossMusic = false;

        // Start gameplay BGM
        this.playGameplayBGM();
    }

    playGameplayBGM() {
        const trackKey = this.gameplayTracks[this.currentGameplayIndex];
        this.currentBGM = this.sound.add(trackKey, { volume: this.bgmVolume, loop: false });
        this.currentBGM.play();

        // When track ends, switch to the other track
        this.currentBGM.on('complete', () => {
            if (this.isBossMusic) return; // don't restart if boss music took over
            this.currentGameplayIndex = (this.currentGameplayIndex + 1) % this.gameplayTracks.length;
            this.playGameplayBGM();
        });
    }

    switchToBossMusic() {
        if (this.isBossMusic) return;
        this.isBossMusic = true;

        // Fade out current gameplay BGM
        if (this.currentBGM && this.currentBGM.isPlaying) {
            this.tweens.add({
                targets: this.currentBGM,
                volume: 0,
                duration: this.bgmFadeDuration,
                onComplete: () => {
                    if (this.currentBGM) {
                        this.currentBGM.stop();
                        this.currentBGM.destroy();
                        this.currentBGM = null;
                    }
                }
            });
        }

        // Pick a random boss track and fade in
        const bossTrackKey = Phaser.Utils.Array.GetRandom(this.bossTracks);
        this.bossBGM = this.sound.add(bossTrackKey, { volume: 0, loop: true });
        this.bossBGM.play();

        this.tweens.add({
            targets: this.bossBGM,
            volume: this.bgmVolume,
            duration: this.bgmFadeDuration
        });
    }

    switchToGameplayMusic() {
        if (!this.isBossMusic) return;
        this.isBossMusic = false;

        // Fade out boss BGM
        if (this.bossBGM && this.bossBGM.isPlaying) {
            this.tweens.add({
                targets: this.bossBGM,
                volume: 0,
                duration: this.bgmFadeDuration,
                onComplete: () => {
                    if (this.bossBGM) {
                        this.bossBGM.stop();
                        this.bossBGM.destroy();
                        this.bossBGM = null;
                    }
                }
            });
        }

        // Resume gameplay BGM with fade in
        this.time.delayedCall(500, () => {
            if (!this.isBossMusic) {
                this.playGameplayBGM();
            }
        });
    }

    stopAllBGM() {
        if (this.currentBGM) {
            this.currentBGM.stop();
            this.currentBGM.destroy();
            this.currentBGM = null;
        }
        if (this.bossBGM) {
            this.bossBGM.stop();
            this.bossBGM.destroy();
            this.bossBGM = null;
        }
    }

    createThrusterParticles() {
        // Create a small particle texture for the thruster
        if (!this.textures.exists('thruster-particle')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x00ccff);
            g.fillCircle(4, 4, 4);
            g.generateTexture('thruster-particle', 8, 8);
            g.destroy();
        }

        this.thrusterEmitter = this.add.particles(0, 0, 'thruster-particle', {
            speed: { min: 20, max: 80 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.6, end: 0 },
            lifespan: 300,
            blendMode: 'ADD',
            frequency: 30,
            tint: [0x00ccff, 0x0088ff, 0x00ffff],
            follow: this.player,
            followOffset: { x: 0, y: 20 }
        });
        this.thrusterEmitter.setDepth(-1);
    }

    pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseScene');
    }

    setupCollisions() {
        // Player bullets hit enemies
        this.physics.add.overlap(
            this.player.getBullets(),
            this.enemies,
            this.bulletHitEnemy,
            null,
            this
        );

        // Enemy bullets hit player
        this.physics.add.overlap(
            this.player,
            this.enemyBullets,
            this.enemyBulletHitPlayer,
            null,
            this
        );

        // Enemies hit player
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.enemyHitPlayer,
            null,
            this
        );

        // Player collects power-ups
        this.physics.add.overlap(
            this.player,
            this.powerUps,
            this.collectPowerUp,
            null,
            this
        );

        // Player bullets hit obstacles
        this.physics.add.overlap(
            this.player.getBullets(),
            this.obstacles,
            this.bulletHitObstacle,
            null,
            this
        );

        // Player hits obstacles
        this.physics.add.overlap(
            this.player,
            this.obstacles,
            this.playerHitObstacle,
            null,
            this
        );

        // Homing missiles hit enemies
        this.physics.add.overlap(
            this.homingMissiles,
            this.enemies,
            this.bulletHitEnemy,
            null,
            this
        );

        // Homing missiles hit obstacles
        this.physics.add.overlap(
            this.homingMissiles,
            this.obstacles,
            this.bulletHitObstacle,
            null,
            this
        );
    }

    bulletHitEnemy(bullet, enemy) {
        try {
            if (!bullet.active || !enemy.active) return;

            const damage = bullet.damage || 1;

            // Destroy bullet
            bullet.destroy();

            // Play hit sound
            if (this.hitSound) {
                this.hitSound.play({ volume: 0.2 });
            }

            // Damage enemy
            if (enemy.takeDamage) {
                enemy.takeDamage(damage);
            }
        } catch (error) {
            console.error('Error in bulletHitEnemy:', error);
        }
    }

    bulletHitBoss(bullet, boss) {
        try {
            if (!bullet.active || !boss.active) return;

            const damage = bullet.damage || 1;

            bullet.destroy();

            if (this.hitSound) {
                this.hitSound.play({ volume: 0.2 });
            }

            if (boss.takeDamage) {
                boss.takeDamage(damage);
            }
        } catch (error) {
            console.error('Error in bulletHitBoss:', error);
        }
    }

    enemyBulletHitPlayer(player, bullet) {
        try {
            if (!bullet.active || !player.active) return;

            // Destroy bullet
            bullet.destroy();

            // Damage player
            if (player.takeDamage) {
                player.takeDamage();
            }

            // Update UI
            this.updateLivesDisplay();
        } catch (error) {
            console.error('Error in enemyBulletHitPlayer:', error);
        }
    }

    enemyHitPlayer(player, enemy) {
        try {
            if (!player.active || !enemy.active) return;

            // Damage player
            if (player.takeDamage) {
                player.takeDamage();
            }

            // Destroy enemy
            if (enemy.die) {
                enemy.die();
            }

            // Update UI
            this.updateLivesDisplay();
        } catch (error) {
            console.error('Error in enemyHitPlayer:', error);
        }
    }

    collectPowerUp(player, powerUp) {
        try {
            if (!player.active || !powerUp.active) return;

            const pickupX = powerUp.x;
            const pickupY = powerUp.y;
            const tintColor = powerUp.tintColor || 0x00ffff;

            // Award score
            this.scoreManager.addScore(POWERUP_SCORE);

            // Activate power-up
            const powerUpType = powerUp.getType ? powerUp.getType() : null;
            if (player.activatePowerUp && powerUpType) {
                player.activatePowerUp(powerUpType);
            }

            // Destroy power-up
            powerUp.destroy();

            // --- Pickup VFX ---

            // 1. Expanding flash ring (color-matched)
            const ring = this.add.circle(pickupX, pickupY, 10, tintColor, 0.6);
            ring.setStrokeStyle(3, tintColor);
            ring.setDepth(200);
            this.tweens.add({
                targets: ring,
                scale: 4,
                alpha: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => ring.destroy()
            });

            // 2. Floating power-up name text
            const nameMap = {
                [POWERUP_TYPES.SPREAD_SHOT]: '+SPREAD SHOT',
                [POWERUP_TYPES.RAPID_FIRE]: '+RAPID FIRE',
                [POWERUP_TYPES.SHIELD]: '+SHIELD',
                [POWERUP_TYPES.HOMING_MISSILE]: '+HOMING MISSILE',
                [POWERUP_TYPES.LASER_BEAM]: '+LASER BEAM',
                [POWERUP_TYPES.BACK_SHOOTER]: '+BACK SHOOTER',
                [POWERUP_TYPES.OVERCLOCK]: '+OVERCLOCK'
            };
            const displayName = nameMap[powerUpType] || '+POWER UP';
            const nameColor = powerUpType === POWERUP_TYPES.OVERCLOCK ? '#ff4444' : '#00ffff';
            this.showFloatingText(pickupX, pickupY, displayName, nameColor);

            // 3. Brief white screen flash (50ms)
            const flash = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 0.3);
            flash.setDepth(300);
            this.tweens.add({
                targets: flash,
                alpha: 0,
                duration: 50,
                onComplete: () => flash.destroy()
            });

            // Update UI
            this.updateScoreDisplay();
        } catch (error) {
            console.error('Error in collectPowerUp:', error);
        }
    }

    bulletHitObstacle(bullet, obstacle) {
        try {
            if (!bullet.active || !obstacle.active) return;
            const damage = bullet.damage || 1;
            bullet.destroy();
            if (obstacle.takeDamage) {
                obstacle.takeDamage(damage);
            }
        } catch (error) {
            console.error('Error in bulletHitObstacle:', error);
        }
    }

    playerHitObstacle(player, obstacle) {
        try {
            if (!player.active || !obstacle.active) return;

            // Player takes damage (unless in god mode)
            if (player.takeDamage) {
                player.takeDamage();
            }

            // Destroy obstacle
            if (obstacle.die) {
                obstacle.die();
            }

            this.updateLivesDisplay();
        } catch (error) {
            console.error('Error in playerHitObstacle:', error);
        }
    }

    tryDropPowerUp(x, y) {
        if (Math.random() < POWERUP_DROP_CHANCE) {
            // Randomly choose power-up type
            const types = [
                POWERUP_TYPES.SPREAD_SHOT,
                POWERUP_TYPES.RAPID_FIRE,
                POWERUP_TYPES.SHIELD,
                POWERUP_TYPES.HOMING_MISSILE,
                POWERUP_TYPES.LASER_BEAM,
                POWERUP_TYPES.BACK_SHOOTER,
                POWERUP_TYPES.OVERCLOCK
            ];
            const type = Phaser.Utils.Array.GetRandom(types);

            // Create power-up
            const powerUp = new PowerUp(this, x, y, type);
            this.powerUps.add(powerUp);
        }
    }

    createUI() {
        // Top HUD bar background
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.7);
        graphics.fillRect(0, 0, GAME_WIDTH, 50);
        graphics.lineStyle(2, 0x00ffff, 0.5);
        graphics.lineBetween(0, 50, GAME_WIDTH, 50);
        graphics.setScrollFactor(0);
        graphics.setDepth(90);

        const uiStyle = {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#004444',
            strokeThickness: 2,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 4, stroke: true, fill: true }
        };

        // Score text
        this.scoreText = this.add.text(20, 15, `SCORE: 0`, uiStyle);
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100);

        // High score text
        this.highScoreText = this.add.text(300, 15, `HIGH: ${this.scoreManager.getHighScore()}`, {
            ...uiStyle,
            fill: '#ffff00',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffaa00', blur: 4, stroke: true, fill: true }
        });
        this.highScoreText.setScrollFactor(0);
        this.highScoreText.setDepth(100);

        // Lives text
        this.livesText = this.add.text(GAME_WIDTH - 20, 15, `LIVES: ${this.player.lives}`, uiStyle);
        this.livesText.setOrigin(1, 0);
        this.livesText.setScrollFactor(0);
        this.livesText.setDepth(100);

        // Combo Display (New)
        this.comboText = this.add.text(20, 60, '', {
            fontSize: '24px',
            fill: '#ff00ff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 3,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff00ff', blur: 8, stroke: true, fill: true }
        });
        this.comboText.setScrollFactor(0);
        this.comboText.setDepth(100);
        this.comboText.setVisible(false);

        // Wave text (centered)
        this.waveText = this.add.text(GAME_WIDTH / 2, 80, `WAVE 1`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff00ff', blur: 8, stroke: true, fill: true }
        });
        this.waveText.setOrigin(0.5);
        this.waveText.setScrollFactor(0);
        this.waveText.setDepth(100);
        this.waveText.setAlpha(0); // Start invisible, fade in on wave start

        // Power-up indicator (moved below top bar)
        this.powerUpText = this.add.text(GAME_WIDTH / 2, 45, '', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 3
        });
        this.powerUpText.setOrigin(0.5, 0);
        this.powerUpText.setScrollFactor(0);
        this.powerUpText.setDepth(100);
    }

    updateScoreDisplay() {
        try {
            if (!this.scoreText || !this.highScoreText || !this.comboText || !this.scoreManager) return;

            this.scoreText.setText(`SCORE: ${this.scoreManager.getScore()}`);
            this.highScoreText.setText(`HIGH: ${this.scoreManager.getHighScore()}`);

            // Update Combo UI
            const combo = this.scoreManager.getCombo();
            const multiplier = this.scoreManager.getMultiplier();

            if (combo > 1) {
                this.comboText.setVisible(true);
                this.comboText.setText(`${combo}x COMBO (${multiplier}X)`);
                this.comboText.setScale(1 + (combo * 0.05)); // Slight grow effect

                // Cap scale
                if (this.comboText.scale > 1.5) this.comboText.setScale(1.5);
            } else {
                this.comboText.setVisible(false);
            }
        } catch (error) {
            console.error('Error in updateScoreDisplay:', error);
        }
    }

    updateLivesDisplay() {
        try {
            if (!this.livesText || !this.player) return;

            if (this.player.isAlive) {
                this.livesText.setText(`LIVES: ${this.player.lives}`);
            }
        } catch (error) {
            console.error('Error in updateLivesDisplay:', error);
        }
    }

    updateWaveDisplay() {
        try {
            if (!this.waveText || !this.waveManager) return;

            this.waveText.setText(`WAVE: ${this.waveManager.getCurrentWave()}`);
        } catch (error) {
            console.error('Error in updateWaveDisplay:', error);
        }
    }

    updatePowerUpDisplay() {
        try {
            if (!this.powerUpText || !this.player) return;

            if (this.player.activePowerUp) {
                let powerUpName = '';
                switch (this.player.activePowerUp) {
                    case POWERUP_TYPES.SPREAD_SHOT:
                        powerUpName = 'SPREAD SHOT';
                        break;
                    case POWERUP_TYPES.RAPID_FIRE:
                        powerUpName = 'RAPID FIRE';
                        break;
                    case POWERUP_TYPES.SHIELD:
                        powerUpName = 'SHIELD';
                        break;
                    case POWERUP_TYPES.HOMING_MISSILE:
                        powerUpName = 'HOMING MISSILE';
                        break;
                    case POWERUP_TYPES.LASER_BEAM:
                        powerUpName = 'LASER BEAM';
                        break;
                    case POWERUP_TYPES.BACK_SHOOTER:
                        powerUpName = 'BACK SHOOTER';
                        break;
                    case POWERUP_TYPES.OVERCLOCK:
                        powerUpName = 'OVERCLOCK';
                        break;
                }
                // OVERCLOCK shows in red, all others in cyan
                if (this.player.activePowerUp === POWERUP_TYPES.OVERCLOCK) {
                    this.powerUpText.setFill('#ff4444');
                    this.powerUpText.setShadow(0, 0, '#ff0000', 4, true, true);
                } else {
                    this.powerUpText.setFill('#00ffff');
                    this.powerUpText.setShadow(0, 0, '#00ffff', 4, true, true);
                }
                this.powerUpText.setText(`⚡ ${powerUpName}`);
            } else {
                this.powerUpText.setText('');
            }
        } catch (error) {
            console.error('Error in updatePowerUpDisplay:', error);
        }
    }

    spawnEnemy() {
        // Get enemy type from wave manager
        const enemyType = this.waveManager.getEnemyTypeForWave();

        let x, y;

        if (enemyType.movementPattern === 'strafe') {
            // Sentinels enter from left or right edge
            const fromLeft = Math.random() < 0.5;
            x = fromLeft ? -30 : GAME_WIDTH + 30;
            y = Phaser.Math.Between(50, 200);
        } else {
            // Normal enemies spawn from top
            x = Phaser.Math.Between(50, GAME_WIDTH - 50);
            y = -50;
        }

        const enemy = new Enemy(this, x, y, enemyType);
        this.enemies.add(enemy);

        // Notify wave manager
        this.waveManager.enemySpawned();
    }

    spawnBoss(wave = 5) {
        if (this.boss && this.boss.active) return;
        this._bossWave = wave;

        // Show warning sequence first, then spawn
        this.showBossWarning(() => {
            this.actuallySpawnBoss();
        });
    }

    showBossWarning(callback) {
        // Switch to boss music
        this.switchToBossMusic();

        // Red overlay flash
        const overlay = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0);
        overlay.setDepth(300);

        // Flash the red overlay
        this.tweens.add({
            targets: overlay,
            alpha: { from: 0, to: 0.3 },
            duration: 300,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut'
        });

        // Camera shake
        this.shakeCamera(2000, 0.008);

        // WARNING text
        const warningText = this.add.text(GAME_WIDTH / 2, 200, '⚠ WARNING ⚠', {
            fontSize: '56px',
            fill: '#ff0000',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#440000',
            strokeThickness: 6,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff0000', blur: 20, stroke: true, fill: true }
        });
        warningText.setOrigin(0.5);
        warningText.setDepth(301);
        warningText.setAlpha(0);

        // Fade in warning
        this.tweens.add({
            targets: warningText,
            alpha: 1,
            duration: 400,
            ease: 'Power2'
        });

        // Blink the warning
        this.tweens.add({
            targets: warningText,
            alpha: { from: 1, to: 0.3 },
            duration: 250,
            yoyo: true,
            repeat: 5,
            delay: 400,
            ease: 'Sine.easeInOut'
        });

        // "BOSS APPROACHING" text
        const approachText = this.add.text(GAME_WIDTH / 2, 300, 'BOSS APPROACHING...', {
            fontSize: '32px',
            fill: '#ffaa00',
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#ff4400', blur: 10, stroke: true, fill: true }
        });
        approachText.setOrigin(0.5);
        approachText.setDepth(301);
        approachText.setAlpha(0);

        // Fade in approach text with scale
        this.tweens.add({
            targets: approachText,
            alpha: 1,
            scale: { from: 0.5, to: 1.0 },
            duration: 600,
            delay: 800,
            ease: 'Back.easeOut'
        });

        // Pulse the approach text
        this.tweens.add({
            targets: approachText,
            scale: { from: 1.0, to: 1.1 },
            duration: 400,
            yoyo: true,
            repeat: 2,
            delay: 1400,
            ease: 'Sine.easeInOut'
        });

        // Clean up and spawn boss after sequence
        this.time.delayedCall(3000, () => {
            // Fade out warning texts
            this.tweens.add({
                targets: [warningText, approachText, overlay],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    warningText.destroy();
                    approachText.destroy();
                    overlay.destroy();
                }
            });

            // Spawn the boss
            if (callback) callback();
        });
    }

    actuallySpawnBoss() {
        try {
            this.boss = new Boss(this, GAME_WIDTH / 2, -80, this._bossWave || 5);

            // Setup boss collision with player bullets
            this.physics.add.overlap(
                this.player.getBullets(),
                this.boss,
                this.bulletHitBoss,
                null,
                this
            );

            // Boss collides with player
            this.physics.add.overlap(
                this.player,
                this.boss,
                (player, boss) => {
                    try {
                        if (!player.active || !boss.active) return;
                        if (player.takeDamage) player.takeDamage();
                        this.updateLivesDisplay();
                    } catch (error) {
                        console.error('Error in boss-player collision:', error);
                    }
                },
                null,
                this
            );

            // Homing missiles hit boss
            this.physics.add.overlap(
                this.homingMissiles,
                this.boss,
                this.bulletHitBoss,
                null,
                this
            );

            console.log('Boss spawned!');
        } catch (error) {
            console.error('Error spawning boss:', error);
            this.waveManager.bossActive = false;
        }
    }

    onBossDefeated() {
        this.boss = null;

        // Play explosion sound
        if (this.explosionSound) {
            this.explosionSound.play();
        }

        // Stop all music before transitioning to victory
        this.stopAllBGM();

        // Transition to Victory scene after a brief delay for explosions to finish
        this.time.delayedCall(2000, () => {
            const score = this.scoreManager.getScore();
            const highScore = this.scoreManager.getHighScore();
            this.scene.start('VictoryScene', {
                score: score,
                wave: this.waveManager.currentWave,
                highScore: highScore,
                isNewHighScore: score >= highScore
            });
        });
    }

    showFloatingText(x, y, message, color = '#ffff00') {
        const text = this.add.text(x, y, message, {
            fontSize: '24px',
            fill: color,
            fontFamily: '"Orbitron", sans-serif',
            stroke: '#000',
            strokeThickness: 3
        });
        text.setOrigin(0.5);
        text.setDepth(200);

        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => {
                text.destroy();
            }
        });
    }

    // Camera shake helper
    shakeCamera(duration = 100, intensity = 0.01) {
        this.cameras.main.shake(duration, intensity);
    }

    generateAsteroidTextures() {
        // Small asteroid (~24px)
        if (!this.textures.exists('asteroid-small')) {
            const gSmall = this.make.graphics({ x: 0, y: 0, add: false });
            gSmall.fillStyle(0x888888);
            gSmall.fillCircle(16, 16, 12);
            gSmall.fillStyle(0x666666);
            gSmall.fillCircle(12, 12, 4);
            gSmall.fillCircle(20, 18, 3);
            gSmall.fillStyle(0xaaaaaa);
            gSmall.fillCircle(18, 10, 3);
            gSmall.generateTexture('asteroid-small', 32, 32);
            gSmall.destroy();
        }

        // Large asteroid (~48px)
        if (!this.textures.exists('asteroid-large')) {
            const gLarge = this.make.graphics({ x: 0, y: 0, add: false });
            gLarge.fillStyle(0x777777);
            gLarge.fillCircle(28, 28, 24);
            gLarge.fillStyle(0x555555);
            gLarge.fillCircle(20, 20, 7);
            gLarge.fillCircle(36, 30, 5);
            gLarge.fillCircle(24, 38, 4);
            gLarge.fillStyle(0x999999);
            gLarge.fillCircle(32, 18, 6);
            gLarge.fillCircle(16, 32, 3);
            gLarge.generateTexture('asteroid-large', 56, 56);
            gLarge.destroy();
        }
    }

    generatePowerUpTextures() {
        // Laser beam power-up: dark blue circle bg, cyan beam line, white highlight
        if (!this.textures.exists('powerup-laser')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Background circle
            g.fillStyle(0x1a1a66);
            g.fillCircle(16, 16, 14);
            // Cyan border
            g.lineStyle(2, 0x00ffff, 1);
            g.strokeCircle(16, 16, 14);
            // Vertical beam line
            g.fillStyle(0x00ffff);
            g.fillRect(14, 4, 4, 24);
            // White highlight
            g.fillStyle(0xffffff);
            g.fillRect(15, 6, 2, 20);
            g.generateTexture('powerup-laser', 32, 32);
            g.destroy();
        }

        // Overclock power-up: red circle with lightning bolt
        if (!this.textures.exists('powerup-overclock')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Dark red background circle
            g.fillStyle(0x661111);
            g.fillCircle(16, 16, 14);
            // Red border
            g.lineStyle(2, 0xff4444, 1);
            g.strokeCircle(16, 16, 14);
            // Yellow lightning bolt
            g.fillStyle(0xffff00);
            g.fillTriangle(18, 4, 10, 16, 16, 16);
            g.fillTriangle(14, 16, 22, 16, 14, 28);
            g.generateTexture('powerup-overclock', 32, 32);
            g.destroy();
        }

        // Back shooter power-up: dark yellow bg, up-arrow + down-arrow
        if (!this.textures.exists('powerup-backshoot')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Background circle
            g.fillStyle(0x665500);
            g.fillCircle(16, 16, 14);
            // Yellow border
            g.lineStyle(2, 0xffff00, 1);
            g.strokeCircle(16, 16, 14);
            // Up arrow (yellow)
            g.fillStyle(0xffff00);
            g.fillTriangle(16, 5, 10, 14, 22, 14);
            g.fillRect(14, 12, 4, 5);
            // Down arrow (orange)
            g.fillStyle(0xff8800);
            g.fillTriangle(16, 27, 10, 18, 22, 18);
            g.fillRect(14, 15, 4, 5);
            g.generateTexture('powerup-backshoot', 32, 32);
            g.destroy();
        }
    }

    spawnObstacle() {
        const obstacleType = this.waveManager.getObstacleTypeForWave();
        const x = Phaser.Math.Between(60, GAME_WIDTH - 60);
        const obstacle = new Obstacle(this, x, -40, obstacleType);
        this.obstacles.add(obstacle);
    }

    update(time, delta) {
        try {
            // Track game start time
            if (this.gameStartTime === 0) {
                this.gameStartTime = time;
                this.lastEnemySpawn = time + this.initialSpawnDelay;
            }

            // Update score manager (combo timer)
            if (this.scoreManager && this.scoreManager.update) {
                this.scoreManager.update(time, delta);
            }

            // Update player
            if (this.player && this.player.isAlive && this.player.update) {
                this.player.update(time, delta);
            }

            // Scroll parallax background layers
            if (this.bgBack) {
                this.bgBack.tilePositionY -= 0.3;
            }
            if (this.bgStars) {
                this.bgStars.tilePositionY -= 0.8;
            }
            if (this.background) {
                this.background.tilePositionY -= 1.5;
            }

            // Update UI
            this.updateScoreDisplay();
            this.updateWaveDisplay();

            // Spawn enemies if wave is active (with initial delay)
            if (this.waveManager && this.waveManager.shouldSpawnEnemy &&
                this.waveManager.shouldSpawnEnemy() &&
                time > this.lastEnemySpawn &&
                time > this.gameStartTime + this.initialSpawnDelay) {
                this.spawnEnemy();
                this.lastEnemySpawn = time + this.waveManager.getEnemySpawnInterval();
            }

            // Spawn obstacles based on wave difficulty (not during boss waves)
            if (this.waveManager && !this.waveManager.bossActive) {
                const obstacleInterval = this.waveManager.getObstacleSpawnInterval();
                if (obstacleInterval !== Infinity && time > this.lastObstacleSpawn + obstacleInterval) {
                    this.spawnObstacle();
                    this.lastObstacleSpawn = time;
                }
            }

            // Update boss
            if (this.boss && this.boss.active && this.boss.update) {
                this.boss.update(time, delta);
            }
        } catch (error) {
            console.error('Error in GameScene.update():', error);
            // Pause game on critical error
            this.scene.pause();
        }
    }
}
