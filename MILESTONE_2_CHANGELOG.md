# Milestone 2 - Changelog

## New Files Created

### Managers
- `src/managers/WaveManager.js` - Handles wave-based enemy spawning, progression, and wave completion
- `src/managers/ScoreManager.js` - Tracks score, high score, and localStorage persistence

### Entities
- `src/entities/PowerUp.js` - Power-up collectibles with floating/rotation animations
- `src/entities/EnemyBullet.js` - Enemy projectiles that shoot at player

## Updated Files

### Core Systems
- `src/utils/constants.js`
  - Added enemy type configurations (SMALL, MEDIUM, LARGE)
  - Added power-up types and constants
  - Added wave system configuration
  - Defined scoring values

### Entities
- `src/entities/Enemy.js`
  - Complete rewrite to support multiple enemy types
  - Added varied movement patterns (straight, zigzag, dive)
  - Added shooting capability for medium/large enemies
  - Added damage flash effect
  - Integrated with WaveManager and ScoreManager

- `src/entities/Player.js`
  - Added power-up system (spread shot, rapid fire, shield)
  - Shield visual effect with pulse animation
  - Modified shooting to support spread pattern
  - Fire rate modification for rapid fire
  - Updated die() method to pass game stats to GameOverScene

### Scenes
- `src/scenes/GameScene.js`
  - Complete rewrite for Milestone 2 features
  - Integrated WaveManager and ScoreManager
  - Added enemy bullets group
  - Added power-ups group
  - Enhanced UI with score, high score, wave, and power-up displays
  - Multiple collision handlers (player bullets vs enemies, enemy bullets vs player, power-up collection)
  - Wave-based enemy spawning logic

- `src/scenes/GameOverScene.js`
  - Added score and wave display
  - Added high score display
  - New high score celebration with animation
  - Receives game data from Player die() method

## New Assets
- `assets/enemies/enemy-medium1.png`
- `assets/enemies/enemy-big1.png`
- `assets/powerups/power-up1.png` (Spread Shot)
- `assets/powerups/power-up2.png` (Rapid Fire)
- `assets/powerups/power-up3.png` (Shield)
- `assets/projectiles/enemy-bullet.png`

## New Gameplay Features

### Wave System
- Enemies spawn in defined waves
- Progressive difficulty (5 → 7 → 9... up to 15 enemies per wave)
- 3-second break between waves with visual announcements
- Wave completion bonus: +100 points
- Enemy types scale with wave number:
  - Waves 1-2: Only small enemies
  - Waves 3-5: Small + medium enemies
  - Wave 6+: All enemy types

### Enemy Variety
Three distinct enemy types with unique behaviors:
1. **Small**: Fast, straight movement, 1 HP, 50 points
2. **Medium**: Zigzag pattern, shoots occasionally, 2 HP, 100 points
3. **Large**: Diving attacks toward player, shoots frequently, 4 HP, 200 points

### Power-Up System
- 15% drop chance from destroyed enemies
- 8-second duration
- Three types:
  - **Spread Shot**: 3-way bullet pattern
  - **Rapid Fire**: 2x fire rate
  - **Shield**: Absorbs one hit
- Visual indicators (rotation, floating animation)
- UI display of active power-up

### Scoring & Progression
- Point values per enemy type
- Power-up collection bonus: +25 points
- Wave completion bonus: +100 points
- High score persistence using localStorage
- New high score celebration on Game Over screen

### Enhanced UI
- Score display (top-left)
- High score display (top-left)
- Lives display (top-left)
- Wave number (top-right)
- Active power-up indicator (top-right)
- Game Over screen shows final stats

### Visual Improvements
- Enemy hit flash effect
- Shield visual with pulse animation
- Power-up rotation and floating
- Faster background scrolling
- Enhanced explosion effects

## Balance Changes
- Enemy spawn interval: 2000ms → 800ms (faster within waves)
- Background scroll speed: 1 → 1.5 (faster)
- Player bullet pool: 30 → 50 (supports spread shot)
- Fire rate adjustments for power-ups

## Technical Improvements
- Modular manager classes for better code organization
- Enemy type system for easy balancing
- Improved collision detection with multiple groups
- Data passing between scenes for stats display
- Constants-driven configuration for easy tweaking

---

## Testing Checklist

- [x] Wave system progresses correctly
- [x] All 3 enemy types spawn and behave correctly
- [x] Enemy shooting mechanics work
- [x] Power-ups drop, float, and can be collected
- [x] Spread shot fires 3 bullets
- [x] Rapid fire doubles fire rate
- [x] Shield blocks one hit
- [x] Score increments correctly for all actions
- [x] High score saves and loads from localStorage
- [x] Game Over screen shows correct stats
- [x] UI updates in real-time
- [x] Wave completion shows bonus message

---

**Build Date**: 2026-02-03
**Milestone**: 2/3
