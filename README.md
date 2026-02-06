# Retro Space Shooter - Milestone 3 Complete

A classic vertical-scrolling space shooter built with Phaser 3.

## Current Features (Milestone 3)

### Core Gameplay
- Player ship with keyboard controls (Arrow Keys/WASD)
- Spacebar to shoot lasers
- 3 lives system
- Smooth collision detection

### Wave System
- Wave-based enemy spawning with progressive difficulty
- Wave completion bonuses
- Visual wave announcements
- 5 enemies starting, increases by 2 each wave (max 15)
- 3-second break between waves

### Enemy Types
- **Small Enemies**: Fast, 1 HP, 50 points, straight movement
- **Medium Enemies**: Moderate speed, 2 HP, 100 points, zigzag movement, shoots back
- **Large Enemies**: Slow, 4 HP, 200 points, diving attacks, shoots frequently

### Power-Ups (8 second duration)
- **Spread Shot** (Blue): Fires 3 bullets at once
- **Rapid Fire** (Green): Doubles fire rate
- **Shield** (Cyan): Absorbs one hit with visual indicator
- 15% drop chance from destroyed enemies

### Scoring System
- Points for destroying enemies (50/100/200 based on type)
- +25 points for collecting power-ups
- +100 bonus for completing each wave
- High score persistence (localStorage)
- New high score celebration

### Enhanced UI
- Real-time score display
- High score tracking
- Lives counter
- Wave number indicator
- Active power-up display with icon

### Visual Effects
- Parallax scrolling space background
- Explosion animations
- Enemy flash on hit
- Power-up floating and rotation animations
- Shield visual effect

## How to Run

### Option 1: Simple HTTP Server (Recommended)

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
http-server -p 8000

# Then open: http://localhost:8000
```

### Option 2: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Any Local Web Server

You can use any local web server. Just serve the project directory and open `index.html` in your browser.

## Controls

- **Arrow Keys** or **WASD**: Move ship
- **Spacebar**: Shoot
- **Space** (on Game Over screen): Restart

## Game Objective

Survive as long as possible by destroying enemy ships while avoiding collisions!

## Project Structure

```
shooting-game/
├── index.html              # Game entry point
├── assets/                 # Game assets
│   ├── player/            # Player ship sprites
│   ├── enemies/           # Enemy sprites
│   ├── projectiles/       # Bullet sprites
│   ├── effects/           # Explosion effects
│   └── backgrounds/       # Background images
└── src/
    ├── main.js            # Phaser configuration
    ├── scenes/
    │   ├── GameScene.js   # Main gameplay scene
    │   └── GameOverScene.js # Game over screen
    ├── entities/
    │   ├── Player.js      # Player ship class
    │   ├── Enemy.js       # Enemy ship class
    │   └── Bullet.js      # Bullet class
    └── utils/
        └── constants.js   # Game constants

```

## Gameplay Tips

- Collect power-ups to gain temporary advantages
- Shield power-ups are great for risky situations
- Spread shot helps clear multiple enemies
- Enemy patterns change by wave - adapt your strategy
- Medium and large enemies shoot back - stay mobile!

### Boss Fights (every 5 waves)
- Multi-phase boss with health bar
- Phase 1 (100-50% HP): Side-to-side movement, basic shooting
- Phase 2 (50-25% HP): Faster movement, 3-way bullet spread
- Phase 3 (<25% HP): Aggressive dive attacks, 5-way bullet spread
- Victory screen on boss defeat with option to continue

### Audio
- Shooting sound effects
- Explosion sounds
- Hit sounds

### Visual Polish
- Parallax scrolling background (3 layers)
- Player thruster particle effects
- Screen shake on explosions and damage
- Boss death multi-explosion sequence

### Difficulty Scaling
- Enemy speed increases +5% per wave
- Enemy shoot chance increases +3% per wave
- Progressive caps to prevent unfairness

---

**Milestone**: 3/3 Complete
**Status**: Fully Complete with Boss Fights, Audio, Parallax, and Polish
