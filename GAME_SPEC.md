# 2D Retro Space Shooter - Game Specification

## Overview
A vertical-scrolling space shooter built with Phaser 3, featuring wave-based enemy spawning, power-ups, boss fights, and a scoring system. The player controls a spaceship at the bottom of the screen, shooting upward at enemies descending from above.

## Technical Stack
- **Framework**: Phaser 3
- **Language**: JavaScript/HTML5
- **Resolution**: 800x600 (scalable)
- **Target Platform**: Web browser

## Core Requirements

### Gameplay Mechanics
1. **Player Ship**
   - Keyboard controls (Arrow keys/WASD for movement)
   - Spacebar for shooting
   - Constrained to screen boundaries
   - 3 lives per game
   - Death animation on collision

2. **Combat System**
   - Continuous shooting when spacebar held
   - Multiple weapon types (unlocked via power-ups)
   - Hit detection for player bullets vs enemies
   - Hit detection for enemy bullets vs player
   - Visual hit feedback

3. **Enemy System**
   - 3 enemy types (small, medium, large)
   - Wave-based spawning with increasing difficulty
   - Varied movement patterns (straight, zigzag, diving)
   - Enemies shoot projectiles at player
   - Boss enemy every 5 waves

4. **Power-Up System**
   - 4 power-up types dropped by destroyed enemies
   - Weapon upgrades (spread shot, rapid fire, charged beam)
   - Temporary shield
   - Power-ups drift down the screen

5. **Scoring System**
   - Points for destroying enemies
   - Bonus points for power-up collection
   - Wave completion bonuses
   - High score persistence (localStorage)

6. **Game States**
   - Main menu screen
   - Active gameplay
   - Pause functionality
   - Game over screen with final score
   - Victory screen (after boss defeat)

### Visual & Audio
- Parallax scrolling space background
- Explosion effects for destroyed ships
- Laser/projectile effects
- Hit flash effects
- UI overlay (score, lives, wave number)

---

## Asset Mapping

### Player Assets
**Ship**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Ship/Ship1.png`
**Alternative Ships** (for variety/upgrades):
- `Legacy Collection/Assets/Characters/top-down-shooter-ship/sprites/ship 01/_0000_Layer-1.png`
- `Legacy Collection/Assets/Characters/top-down-shooter-ship/sprites/ship 02/`
- `Legacy Collection/Assets/Characters/top-down-shooter-ship/sprites/ship 03/`

### Enemy Assets
**Small Enemies**:
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemySmall/enemy-small1.png`
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemySmall/enemy-small2.png`
- `Legacy Collection/Assets/Characters/top-down-shooter-enemies/sprites/enemy-01/`

**Medium Enemies**:
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Enemy Medium/`
- `Legacy Collection/Assets/Characters/top-down-shooter-enemies/sprites/enemy-02/`

**Large Enemies**:
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemyBig/`
- `Legacy Collection/Assets/Characters/top-down-shooter-enemies/sprites/enemy-03/`

**Boss Enemies** (mechanical units):
- `Legacy Collection/Assets/Characters/Battle Sprites/Mechanic/Drone.png`
- `Legacy Collection/Assets/Characters/Battle Sprites/Mechanic/Metal-Slug.png`
- `Legacy Collection/Assets/Characters/Battle Sprites/Mechanic/Sentinel.png`
- `Legacy Collection/Assets/Characters/Battle Sprites/Mechanic/steel-eagle.png`

### Projectile Assets
**Player Lasers**:
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts1.png`
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts2.png`
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts3.png`

**Weapon Effects** (for power-up weapons):
- `Legacy Collection/Assets/Misc/Warped shooting fx/Bolt/`
- `Legacy Collection/Assets/Misc/Warped shooting fx/Pulse/`
- `Legacy Collection/Assets/Misc/Warped shooting fx/charged/`
- `Legacy Collection/Assets/Misc/Warped shooting fx/waveform/`

**Enemy Projectiles**:
- `Legacy Collection/Assets/Misc/EnemyProjectile/`
- `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/shoot/`

### Effect Assets
**Explosions**:
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Explosion/`
- `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/explosion/sprites/`

**Hit Effects**:
- `Legacy Collection/Assets/Misc/Warped shooting fx/hits/hits-1/Sprites/`
- `Legacy Collection/Assets/Misc/Warped shooting fx/hits/Hits-2/Sprites/`
- `Legacy Collection/Assets/Misc/Warped shooting fx/hits/Hits-3/Sprites/`
- `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Hit/sprites/`

**Flash Effects**:
- `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/flash/`
- `Legacy Collection/Assets/Misc/Warped shooting fx/spark/Sprites/`

### Power-Up Assets
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up1.png`
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up2.png`
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up3.png`
- `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up4.png`

### Background Assets
**Space Background** (parallax layers):
- `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/`
- `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/background/layered/`

**Alternative Backgrounds**:
- `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/layers/`

---

## Development Milestones

### Milestone 1: Core Gameplay Loop (Playable)
**Goal**: Basic but complete game loop - player can move, shoot, and destroy enemies

**Features**:
- Player ship with keyboard movement (arrow keys/WASD)
- Ship constrained to screen boundaries
- Basic shooting (spacebar, single laser)
- 1 enemy type (small enemy) with basic downward movement
- Simple enemy spawning (continuous, random X positions)
- Collision detection (bullets hit enemies, enemies hit player)
- Basic explosion effect on enemy destruction
- Simple scrolling space background
- Player health system (3 lives)
- Game over state when lives = 0

**Deliverable**:
A playable prototype where the player can move their ship, shoot enemies, take damage, and experience game over. This validates core mechanics and game feel.

**Assets Used**:
- Player: `SpaceShipShooter/Sprites/Ship/Ship1.png`
- Enemy: `SpaceShipShooter/Sprites/EnemySmall/enemy-small1.png`
- Laser: `SpaceShipShooter/Sprites/Laser Bolts/laser-bolts1.png`
- Explosion: `SpaceShipShooter/Sprites/Explosion/`
- Background: `space_background_pack/Blue Version/`

---

### Milestone 2: Wave System & Power-Ups (Playable)
**Goal**: Add progression, variety, and strategic depth

**Features**:
- **Wave-based enemy spawning**
  - Defined wave patterns (5 enemies, 8 enemies, 10 enemies, etc.)
  - Delay between waves
  - Wave number display on UI
  - Increasing difficulty per wave

- **Multiple enemy types**
  - Small enemies (low HP, fast)
  - Medium enemies (medium HP, shoots back)
  - Large enemies (high HP, aggressive movement)
  - Different point values per type

- **Enemy AI improvements**
  - Medium enemies shoot projectiles at player
  - Varied movement patterns (zigzag, dive attacks)

- **Power-up system**
  - 3 power-up types drop randomly from destroyed enemies
  - Power-up 1: Spread shot (3-way laser)
  - Power-up 2: Rapid fire (faster shooting)
  - Power-up 3: Shield (temporary invincibility with visual effect)
  - Power-ups drift downward, collect by touching

- **Scoring system**
  - Points for destroying enemies (50/100/200 based on type)
  - Power-up collection bonus (+25 points)
  - Wave completion bonus
  - Score display on UI

- **Enhanced visual effects**
  - Different hit effects for different weapons
  - Player ship hit flash
  - Improved explosions with sprite animations

- **UI enhancements**
  - Score display
  - Lives counter with ship icons
  - Wave number
  - Active power-up indicator

**Deliverable**:
A feature-complete game with progression, strategy, and replay value. Players can experience different weapon types, face varied enemy threats, and pursue high scores.

**Additional Assets Used**:
- Enemies: `EnemySmall/`, `Enemy Medium/`, `EnemyBig/`
- Enemy bullets: `EnemyProjectile/`
- Power-ups: `PowerUps/power-up1.png` through `power-up4.png`
- Weapon effects: `Warped shooting fx/Pulse/`, `Warped shooting fx/charged/`
- Hit effects: `Warped shooting fx/hits/`

---

### Milestone 3: Boss Fights & Polish (Playable & Complete)
**Goal**: Complete game with climactic boss encounters and polished experience

**Features**:
- **Boss system**
  - Boss spawns every 5 waves
  - Large boss enemy with high HP (10x normal enemy)
  - Multi-phase boss behavior:
    - Phase 1: Side-to-side movement, basic shooting
    - Phase 2 (50% HP): Faster movement, bullet spread patterns
    - Phase 3 (25% HP): Aggressive diving attacks
  - Boss health bar displayed at top of screen
  - Victory screen after boss defeat with score/stats

- **Enhanced difficulty progression**
  - Enemy count increases each wave (up to 15 per wave)
  - Enemy speed increases gradually
  - More enemies shoot projectiles in later waves

- **Game polish**
  - Main menu screen with "Start Game" button
  - Pause functionality (ESC/P key)
  - Restart option on game over
  - High score persistence using localStorage
  - New high score celebration

- **Audio integration** (if using sound files from collection)
  - Shooting sounds
  - Explosion sounds
  - Hit sounds
  - Background music loop

- **Visual polish**
  - Parallax scrolling background (multiple layers)
  - Screen shake on explosions
  - Particle effects for thrusters
  - Smooth transitions between game states
  - Victory/defeat screen animations

- **Balance & tuning**
  - Fine-tune enemy HP values
  - Adjust power-up drop rates (15% chance)
  - Balance weapon power levels
  - Adjust player/enemy speeds for good game feel

**Deliverable**:
A complete, polished game with a satisfying gameplay arc from start to finish. Includes challenging boss fights, smooth progression, and high replay value. Ready for playtesting and potential distribution.

**Additional Assets Used**:
- Boss: `Battle Sprites/Mechanic/Metal-Slug.png` (primary boss)
- Alt bosses: `Mechanic/Sentinel.png`, `steel-eagle.png`
- Sound: `SpaceShooter/Space Shooter files/Sound FX/`
- Background layers: All layers from `space_background_pack/Blue Version/layered/`

---

## Success Metrics

### Milestone 1 Success
- Player can survive for 30+ seconds
- Controls feel responsive
- Hit detection works accurately
- Game over state triggers correctly

### Milestone 2 Success
- Players can reach wave 5+
- Power-ups provide noticeable gameplay advantage
- Different enemy types pose distinct threats
- Score system motivates continued play

### Milestone 3 Success
- Players can defeat first boss
- Difficulty curve feels fair but challenging
- Game has replay value (high score chasing)
- No major bugs or performance issues
- Game runs smoothly at 60 FPS

---

## Project Structure
```
shooting-game/
├── index.html
├── src/
│   ├── main.js              # Phaser config & game initialization
│   ├── scenes/
│   │   ├── MenuScene.js     # Main menu
│   │   ├── GameScene.js     # Core gameplay
│   │   ├── GameOverScene.js # Game over screen
│   │   └── VictoryScene.js  # Victory screen
│   ├── entities/
│   │   ├── Player.js        # Player ship class
│   │   ├── Enemy.js         # Enemy class
│   │   ├── Boss.js          # Boss class
│   │   ├── Bullet.js        # Projectile class
│   │   └── PowerUp.js       # Power-up class
│   ├── managers/
│   │   ├── WaveManager.js   # Wave spawning logic
│   │   └── ScoreManager.js  # Score tracking
│   └── utils/
│       └── constants.js     # Game constants
├── assets/                  # Symlink to Legacy Collection assets
└── README.md
```

---

## Next Steps
1. Set up Phaser 3 project structure
2. Import and organize needed assets
3. Begin Milestone 1 implementation with player movement
4. Iterate and playtest each milestone before moving to next

---

**Document Version**: 1.0
**Last Updated**: 2026-02-03
