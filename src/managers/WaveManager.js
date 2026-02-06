import { WAVE_CONFIG, ENEMY_TYPES, OBSTACLE_TYPES, OBSTACLE_SPAWN_START_WAVE, GAME_WIDTH, BOSS_WAVE_INTERVAL, DIFFICULTY_SCALING } from '../utils/constants.js';

export default class WaveManager {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 0;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.enemiesRemaining = 0;
        this.enemiesEscaped = 0;
        this.waveActive = false;
        this.wavePaused = false;
        this.bossActive = false;
    }

    isBossWave(wave) {
        return wave > 0 && wave % BOSS_WAVE_INTERVAL === 0;
    }

    startNextWave() {
        this.currentWave++;
        this.waveActive = true;
        this.wavePaused = false;
        this.bossActive = false;

        // Boss wave
        if (this.isBossWave(this.currentWave)) {
            this.bossActive = true;
            this.enemiesInWave = 0;
            this.enemiesSpawned = 0;
            this.enemiesRemaining = 0;
            this.enemiesEscaped = 0;
            this.showWaveMessage(`⚠ BOSS WAVE ${this.currentWave} ⚠`);

            // Spawn boss after a brief delay
            this.scene.time.delayedCall(1500, () => {
                if (this.scene && this.scene.spawnBoss) {
                    this.scene.spawnBoss(this.currentWave);
                }
            });
            return;
        }

        // Calculate enemies for this wave
        this.enemiesInWave = Math.min(
            WAVE_CONFIG.startingEnemies + (this.currentWave - 1) * WAVE_CONFIG.enemyIncreasePerWave,
            WAVE_CONFIG.maxEnemiesPerWave
        );

        this.enemiesSpawned = 0;
        this.enemiesRemaining = this.enemiesInWave;
        this.enemiesEscaped = 0;

        // Show wave start message
        this.showWaveMessage(`Wave ${this.currentWave}`);
    }

    showWaveMessage(text) {
        const message = this.scene.add.text(
            GAME_WIDTH / 2,
            300,
            text,
            {
                fontSize: '48px',
                fill: '#00ffff',
                fontFamily: 'Arial',
                stroke: '#000',
                strokeThickness: 6
            }
        );
        message.setOrigin(0.5);
        message.setDepth(200);

        // Fade in and out
        this.scene.tweens.add({
            targets: message,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                message.destroy();
            }
        });
    }

    shouldSpawnEnemy() {
        return this.waveActive &&
            !this.wavePaused &&
            !this.bossActive &&
            this.enemiesSpawned < this.enemiesInWave;
    }

    enemySpawned() {
        this.enemiesSpawned++;
    }

    enemyDestroyed() {
        this.enemiesRemaining--;
        this.checkWaveComplete();
    }

    enemyEscaped() {
        this.enemiesEscaped++;
        this.checkWaveComplete();
    }

    checkWaveComplete() {
        if (this.bossActive) return;  // Boss waves complete via bossDefeated(), not here
        // Wave completes when all spawned enemies are either destroyed or escaped
        const enemiesDestroyed = this.enemiesInWave - this.enemiesRemaining;
        const enemiesDealtWith = enemiesDestroyed + this.enemiesEscaped;

        if (enemiesDealtWith >= this.enemiesInWave && this.enemiesSpawned >= this.enemiesInWave) {
            console.log(`Wave ${this.currentWave} completing: ${enemiesDestroyed} destroyed, ${this.enemiesEscaped} escaped`);
            this.waveComplete();
        }
    }

    waveComplete() {
        if (!this.waveActive) return;  // Prevent double-fire
        console.log(`Wave ${this.currentWave} complete!`);
        this.waveActive = false;
        this.wavePaused = true;

        // Award wave completion bonus
        this.scene.scoreManager.addScore(WAVE_CONFIG.waveCompletionBonus);

        // Show completion message
        this.showWaveMessage(`Wave ${this.currentWave} Complete!\n+${WAVE_CONFIG.waveCompletionBonus} Bonus`);

        // Start next wave after delay
        this.scene.time.delayedCall(WAVE_CONFIG.delayBetweenWaves, () => {
            console.log(`Starting wave ${this.currentWave + 1}`);
            this.startNextWave();
        });
    }

    bossDefeated() {
        console.log(`Boss defeated on wave ${this.currentWave}!`);
        this.bossActive = false;
        this.waveActive = false;
        this.wavePaused = true;

        // Award wave completion bonus
        this.scene.scoreManager.addScore(WAVE_CONFIG.waveCompletionBonus * 5);

        this.showWaveMessage(`Boss Defeated!\n+${WAVE_CONFIG.waveCompletionBonus * 5} Bonus`);
    }

    // Get difficulty-scaled enemy type for current wave
    getEnemyTypeForWave() {
        // Wave 1-2: Only small enemies
        if (this.currentWave <= 2) {
            return this.scaleDifficulty(ENEMY_TYPES.SMALL);
        }

        // Wave 3-5: Small and medium
        if (this.currentWave <= 5) {
            const rand = Math.random();
            const base = rand < 0.6 ? ENEMY_TYPES.SMALL : ENEMY_TYPES.MEDIUM;
            return this.scaleDifficulty(base);
        }

        // Wave 6+: All types with increasing large enemy chance
        const rand = Math.random();
        let base;
        if (rand < 0.4) {
            base = ENEMY_TYPES.SMALL;
        } else if (rand < 0.75) {
            base = ENEMY_TYPES.MEDIUM;
        } else {
            base = ENEMY_TYPES.LARGE;
        }
        return this.scaleDifficulty(base);
    }

    // Apply per-wave difficulty scaling to enemy type
    scaleDifficulty(baseType) {
        const wave = this.currentWave;
        const speedMult = Math.min(
            1 + (wave - 1) * DIFFICULTY_SCALING.enemySpeedIncreasePerWave,
            DIFFICULTY_SCALING.maxSpeedMultiplier
        );
        const shootBonus = Math.min(
            (wave - 1) * DIFFICULTY_SCALING.enemyShootChanceIncreasePerWave,
            DIFFICULTY_SCALING.maxShootChanceBonus
        );

        return {
            ...baseType,
            speed: Math.round(baseType.speed * speedMult),
            shootChance: Math.min(baseType.shootChance + shootBonus, 0.95)
        };
    }

    getObstacleSpawnInterval() {
        if (this.currentWave < OBSTACLE_SPAWN_START_WAVE) {
            return Infinity; // No obstacles for waves 1-2
        }
        if (this.currentWave <= 4) {
            return 3000; // ~1 every 3s
        }
        if (this.currentWave <= 6) {
            return 2000; // ~1 every 2s
        }
        return 1500; // ~1 every 1.5s
    }

    getObstacleTypeForWave() {
        // Waves 3-4: Only small asteroids
        if (this.currentWave <= 4) {
            return OBSTACLE_TYPES.SMALL_ASTEROID;
        }
        // Waves 5-6: Small + large asteroids
        if (this.currentWave <= 6) {
            return Math.random() < 0.6
                ? OBSTACLE_TYPES.SMALL_ASTEROID
                : OBSTACLE_TYPES.LARGE_ASTEROID;
        }
        // Wave 7+: All types
        const rand = Math.random();
        if (rand < 0.4) {
            return OBSTACLE_TYPES.SMALL_ASTEROID;
        } else if (rand < 0.7) {
            return OBSTACLE_TYPES.LARGE_ASTEROID;
        } else {
            return OBSTACLE_TYPES.SPACE_MINE;
        }
    }

    getCurrentWave() {
        return this.currentWave;
    }

    getEnemiesRemaining() {
        return this.enemiesRemaining;
    }
}
