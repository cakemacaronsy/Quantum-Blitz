// Game configuration constants
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Player constants
export const PLAYER_SPEED = 300;
export const PLAYER_START_X = GAME_WIDTH / 2;
export const PLAYER_START_Y = GAME_HEIGHT - 80;
export const PLAYER_LIVES = 3;
export const PLAYER_FIRE_RATE = 300; // milliseconds between shots

// Enemy types
export const ENEMY_TYPES = {
    SMALL: {
        key: 'enemy-small',
        health: 1,
        speed: 150, // Was 120
        scale: 1.2,
        score: 50,
        shootChance: 0, // doesn't shoot
        movementPattern: 'straight'
    },
    MEDIUM: {
        key: 'enemy-medium',
        health: 2,
        speed: 110, // Was 90
        scale: 1.4,
        score: 100,
        shootChance: 0.5, // Was 0.3
        movementPattern: 'zigzag'
    },
    LARGE: {
        key: 'enemy-large',
        health: 5, // Was 4
        speed: 75, // Was 60
        scale: 1.8,
        score: 200,
        shootChance: 0.7, // Was 0.5
        movementPattern: 'dive'
    }
};

// Bullet constants
export const BULLET_SPEED = 400;
export const ENEMY_BULLET_SPEED = 300; // Was 250

// Power-up constants
export const POWERUP_TYPES = {
    SPREAD_SHOT: 'spread',
    RAPID_FIRE: 'rapid',
    SHIELD: 'shield',
    HOMING_MISSILE: 'homing',
    LASER_BEAM: 'laser',
    BACK_SHOOTER: 'backshoot'
};

// Homing missile constants
export const HOMING_MISSILE_SPEED = 200;
export const HOMING_MISSILE_TURN_RATE = 0.05; // radians/frame
export const HOMING_MISSILE_FIRE_INTERVAL = 3; // fire every 3rd shot

// Laser beam constants
export const LASER_BEAM_DPS = 2; // HP/second continuous damage

export const POWERUP_DURATION = 8000; // 8 seconds
export const POWERUP_SPEED = 80;
export const POWERUP_DROP_CHANCE = 0.15; // 15% chance
export const POWERUP_SCORE = 25;

// Wave system constants
export const WAVE_CONFIG = {
    startingEnemies: 5,
    enemyIncreasePerWave: 2,
    maxEnemiesPerWave: 20, // Was 15
    delayBetweenWaves: 2000, // Was 3000
    waveCompletionBonus: 100
};

// Obstacle types
export const OBSTACLE_TYPES = {
    SMALL_ASTEROID: { key: 'asteroid-small', health: 1, speed: [100, 140], scale: 0.8, score: 15 },
    LARGE_ASTEROID: { key: 'asteroid-large', health: 3, speed: [60, 80], scale: 1.2, score: 30 },
    SPACE_MINE:     { key: 'space-mine', health: 2, speed: [65, 75], scale: 0.7, score: 40 }
};
export const OBSTACLE_SPAWN_START_WAVE = 3;

// Boss constants
export const BOSS_WAVE_INTERVAL = 5; // Boss every 5 waves
export const BOSS_CONFIG = {
    key: 'boss-steel-eagle',
    health: 30,
    speed: 90,
    scale: 2.5,
    score: 500,
    shootCooldown: 1200, // ms between shots
    phases: {
        // Phase 1: 100-50% HP
        1: { speedMultiplier: 1.0, shootCooldown: 1200, pattern: 'side-to-side' },
        // Phase 2: 50-25% HP
        2: { speedMultiplier: 1.2, shootCooldown: 800, pattern: 'spread' },
        // Phase 3: <25% HP
        3: { speedMultiplier: 1.5, shootCooldown: 500, pattern: 'aggressive' }
    }
};

// Difficulty scaling per wave
export const DIFFICULTY_SCALING = {
    enemySpeedIncreasePerWave: 0.05, // 5% faster each wave
    enemyShootChanceIncreasePerWave: 0.03, // +3% shoot chance each wave
    maxSpeedMultiplier: 2.0,
    maxShootChanceBonus: 0.3
};

// Collision constants
export const PLAYER_SCALE = 1.8;
export const BULLET_SCALE = 1.5;
export const EXPLOSION_SCALE = 2.5;
export const POWERUP_SCALE = 1.0;
