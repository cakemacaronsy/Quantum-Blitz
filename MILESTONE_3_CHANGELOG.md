# Milestone 3 - Changelog

## Updated Files

### Constants
- `src/utils/constants.js`
  - Added `SENTINEL` enemy type to `ENEMY_TYPES` (3 HP, 120 speed, 150 points, 60% shoot chance, `strafe` movement pattern)

### Entities
- `src/entities/Enemy.js`
  - Added cyan tint (`0x88ffff`) for sentinel in constructor and `takeDamage()` tint restore
  - Sentinel-specific init: `strafeDirection` based on spawn side, 1500ms shoot cooldown, `strafeStepTimer`
  - Horizontal initial velocity for strafe enemies instead of vertical
  - New `'strafe'` movement case: horizontal movement at base speed, reverses at screen edges, steps down 30px every ~2s, slow 15px/s downward drift
  - Aimed shooting for sentinels: calculates angle to player and fires diagonal `EnemyBullet` with both X and Y velocity
  - New import: `GAME_WIDTH`, `ENEMY_BULLET_SPEED` from constants

- `src/entities/EnemyBullet.js`
  - Constructor now accepts optional `velocityX` and `velocityY` parameters (defaults: `0` and `ENEMY_BULLET_SPEED`)
  - Uses `setVelocity(velocityX, velocityY)` instead of `setVelocityY()` to support angled bullets
  - `preUpdate()` bounds check now destroys bullets exiting any screen edge (left, right, top, bottom)

### Scenes
- `src/scenes/GameScene.js`
  - `preload()`: loads `assets/enemies/boss/Sentinel.png` as `'enemy-sentinel'`
  - `spawnEnemy()`: sentinels spawn from a random side edge (left or right) at y 50-200 instead of from the top
  - `onBossDefeated()`: calls `stopAllBGM()` instead of `switchToGameplayMusic()` for clean transition to victory screen

- `src/scenes/VictoryScene.js`
  - Redesigned as a final game-ending celebration screen
  - Title changed to "CONGRATULATIONS" with scale-up entrance animation
  - Narrative subtitle: "The Steel Eagle Has Been Destroyed"
  - Flavor text: "The galaxy is safe... for now."
  - Stats show "WAVES SURVIVED" instead of "WAVE REACHED"
  - Added "Thanks for playing!" line
  - Removed "CONTINUE PLAYING" option — game now ends after boss defeat
  - "PLAY AGAIN" restarts from wave 1 (fresh game)
  - All elements stagger in over ~3 seconds; inputs disabled until prompts appear

### Managers
- `src/managers/WaveManager.js`
  - Updated `getEnemyTypeForWave()` with sentinel spawn distribution:
    - Waves 1-3: No sentinels
    - Wave 4-5: 10% Sentinel, 50% Small, 40% Medium
    - Wave 6+: 15% Sentinel, 30% Small, 30% Medium, 25% Large

## New Gameplay Features

### Sentinel Enemy Type
A new mid-tier threat that behaves unlike any existing enemy:
- **Entry**: Spawns from left or right screen edge (not top)
- **Movement**: Horizontal strafe across screen, reverses at edges, steps down 30px every ~2s, slow downward drift
- **Shooting**: Aimed diagonal bullets that track toward the player's position
- **Stats**: 3 HP, 120 speed, 150 points, cyan tint
- **Appearance**: Teal spider-bot (`assets/enemies/boss/Sentinel.png`)
- Appears from wave 4+, increasing in frequency at wave 6+

### Game Ending
- The game now ends definitively after defeating the boss
- Victory screen provides narrative closure with cinematic staggered animations
- Players can replay from wave 1 or return to main menu
- No more infinite continuation loop

## Balance Changes
- Wave 4-5 composition adjusted to include sentinels (10%)
- Wave 6+ composition rebalanced: 15% Sentinel, 30% Small, 30% Medium, 25% Large (was 40/35/25)
- Boss music now stops cleanly on defeat instead of crossfading to gameplay music

---

## Testing Checklist

- [ ] Sentinels spawn from left/right edges starting at wave 4
- [ ] Sentinel strafes horizontally, reversing at screen edges
- [ ] Sentinel steps down ~30px every ~2 seconds
- [ ] Sentinel bullets aim toward player position (diagonal trajectory)
- [ ] Killing sentinel awards 150 points
- [ ] Sentinel counts toward wave completion (kill or escape)
- [ ] Sentinel going off-screen bottom counts as escaped
- [ ] Boss defeat transitions to congratulations screen (no continue option)
- [ ] "PLAY AGAIN" starts fresh from wave 1
- [ ] No boss music bleeds into victory screen
- [ ] No console errors during sentinel spawn/movement/death/shooting

---

**Build Date**: 2026-02-07
**Milestone**: 3/3
