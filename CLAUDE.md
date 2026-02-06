# Retro Space Shooter

## Project Overview
A browser-based retro space shooter built with **Phaser 3.70.0** (loaded via CDN). Pure ES6 modules, no build step, no bundler. Open `index.html` directly or serve with any static file server.

## Running the Game
```bash
# Any static server works. Examples:
npx serve .
python3 -m http.server 8000
```
Then open `http://localhost:<port>` in a browser. The game does NOT work by opening `index.html` directly via `file://` due to ES6 module CORS restrictions.

## Architecture
```
index.html                    Entry point (loads Phaser CDN + src/main.js)
src/
  main.js                     Phaser game config, global error handlers
  utils/constants.js          All game tuning values (speeds, rates, scales, boss config)
  entities/
    Player.js                 Player ship (movement, shooting, powerups, shield, audio)
    Enemy.js                  3 enemy types with AI patterns (straight/zigzag/dive)
    Boss.js                   Multi-phase boss (side-to-side, spread, aggressive)
    Bullet.js                 Player projectiles
    EnemyBullet.js            Enemy projectiles
    PowerUp.js                3 types: spread shot, rapid fire, shield
    Obstacle.js               Asteroids and space mines
  managers/
    ScoreManager.js           Score tracking, combo system, high score (localStorage)
    WaveManager.js            Progressive wave spawning, boss waves, difficulty scaling
  scenes/
    MenuScene.js              Title screen
    GameScene.js              Main gameplay loop (spawning, collisions, HUD, audio, parallax)
    PauseScene.js             Pause overlay
    GameOverScene.js          End screen with stats
    VictoryScene.js           Boss defeat celebration with stats
assets/
  audio/
    bgm/
      gameplay/               Background music for normal gameplay (add files here)
      boss/                   Background music for boss fights (add files here)
    explosion.wav             Explosion SFX
    hit.wav                   Hit SFX
    shot 1.wav                Shooting SFX
    shot 2.wav                Alt shooting SFX
```

## BGM Setup
Music files go in `assets/audio/bgm/`. The game randomly picks one track from each folder.
- `gameplay/` — Tracks that play during normal waves. Currently expects files to be added by user.
- `boss/` — Tracks that play during boss fights. Currently expects files to be added by user.
- Supported formats: `.mp3`, `.ogg`, `.wav`
- Files should be named descriptively (e.g. `track1.mp3`, `intense-battle.ogg`)
- To add more categories in the future, create new subfolders under `bgm/`

## Key Patterns
- All entities extend `Phaser.Physics.Arcade.Sprite`
- Groups use `runChildUpdate: true` so each entity's `update()` is called automatically
- Explosion animation is created from 5 individual PNGs (explosion1-5), registered globally via `this.anims`
- Scene transitions: `this.scene.start('SceneName', data)` for full switch, `this.scene.launch()` for overlay (pause)
- Defensive: try-catch in collision handlers and update loop; null checks on `this.scene` / `this.active` before accessing destroyed objects

## Important Gotchas
- `this.scene` becomes `undefined` after `this.destroy()` on any Phaser game object. Always save a scene reference before destroying.
- The `'explode'` animation uses the global anim manager. Guard with `this.anims.exists('explode')` before re-creating on scene restart.
- `checkWorldBounds` / `outOfBoundsKill` are Phaser 2 APIs; in Phaser 3, handle cleanup manually in `preUpdate()`.
- PowerUp has both a physics velocity AND tweens on `y`. The velocity wins; the float tween is cosmetic only because physics overrides position each frame.

## Game Config Quick Reference
All tuning constants are in `src/utils/constants.js`:
- Game: 800x600, arcade physics, no gravity
- Player: 300 speed, 3 lives, 300ms fire rate
- Enemies: SMALL (1HP/150spd), MEDIUM (2HP/110spd/zigzag), LARGE (5HP/75spd/dive)
- Boss: 50HP, 120spd, 3 phases (side-to-side → spread → aggressive), spawns every 5 waves
- Waves: start 5 enemies, +2/wave, max 20, 2s between waves
- Difficulty scaling: +5% enemy speed/wave, +3% shoot chance/wave (capped)
- Power-ups: 8s duration, 15% drop chance
- Combos: 5+ kills = 2x, 10+ kills = 3x, 3s window
- Audio: shot, explosion, hit sounds (WAV)

## Controls
- Arrow keys / WASD: Move
- Space: Shoot
- ESC / P: Pause
- R (pause): Restart
- Q (pause/game over): Main menu
