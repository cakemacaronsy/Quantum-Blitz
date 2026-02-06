# Features Checklist
Verify these after ANY code change to prevent regressions.

## Core Gameplay
- [ ] Player moves with Arrow Keys / WASD
- [ ] Player constrained to screen boundaries
- [ ] Spacebar shoots bullets
- [ ] Player has 3 lives
- [ ] Player flash effect on damage
- [ ] Player death triggers explosion + Game Over after delay
- [ ] God mode toggle with key 1

## Enemies
- [ ] Small enemies spawn and move downward (straight pattern)
- [ ] Medium enemies spawn with zigzag movement
- [ ] Large enemies spawn with dive attacks
- [ ] All enemies have correct HP (Small: 1, Medium: 2, Large: 5)
- [ ] Enemies flash red when hit
- [ ] Enemies shoot projectiles (Medium/Large)
- [ ] Enemies award correct points (50/100/200)
- [ ] Enemies drop power-ups (15% chance)
- [ ] Enemies have subtle red tint for visibility
- [ ] Enemies have alpha pulse glow effect
- [ ] Enemy bullets move downward and damage player
- [ ] Enemies destroyed when off-screen (below)

## Boss System
- [ ] Boss spawns every 5 waves (or key 2 for debug)
- [ ] Boss warning sequence plays before spawn (red flash, text, shake)
- [ ] Boss enters from top and stops at arena position
- [ ] Phase 1 (100-50% HP): Side-to-side, single shots
- [ ] Phase 2 (50-25% HP): Faster, 3-way spread shots
- [ ] Phase 3 (<25% HP): Dive attacks, 5-way spread shots
- [ ] Boss health bar displayed at top of screen
- [ ] Boss phase transition shows floating text + screen shake
- [ ] Boss death: multi-explosion sequence, screen shake
- [ ] Victory scene after boss defeat with stats

## Wave System
- [ ] Waves progress automatically (5 enemies +2/wave, max 20)
- [ ] Wave announcement text appears
- [ ] Wave completion awards +100 bonus
- [ ] Delay between waves (2s)
- [ ] Enemy types scale with wave number
- [ ] Difficulty scaling: enemy speed +5%/wave, shoot chance +3%/wave

## Power-Ups
- [ ] Spread Shot (cyan): fires 3 bullets
- [ ] Rapid Fire (green): doubles fire rate
- [ ] Shield (yellow): absorbs one hit, visual circle
- [ ] Power-ups drift downward
- [ ] Power-ups have rotation + float + scale pulse + alpha pulse
- [ ] Power-ups last 8 seconds
- [ ] Active power-up shown in UI
- [ ] Collecting power-up awards +25 points

## Obstacles
- [ ] Small asteroids spawn (wave 3+)
- [ ] Large asteroids spawn with rotation (wave 5+)
- [ ] Space mines spawn with sine-wave bob (wave 7+)
- [ ] Obstacles damage player on contact
- [ ] Obstacles destroyed by player bullets
- [ ] No obstacles during boss waves

## Scoring & Combo
- [ ] Score displays and updates in real-time
- [ ] High score persists in localStorage
- [ ] Combo system: 5+ kills = 2x, 10+ kills = 3x
- [ ] Combo timer (3s window)
- [ ] Combo display shown when active

## UI / HUD
- [ ] Score (top-left)
- [ ] High score (top-center-left, yellow)
- [ ] Lives (top-right)
- [ ] Wave number display
- [ ] Power-up indicator
- [ ] Combo counter with scale effect

## Scenes
- [ ] Menu: title, subtitle, controls, high score, SPACE to start
- [ ] Game: full gameplay loop
- [ ] Pause: ESC/P to pause, R restart, Q quit
- [ ] Game Over: score, wave, high score, new high score celebration
- [ ] Victory: score, wave, high score, SPACE continue, Q menu

## Audio
- [ ] Shooting sound on player fire
- [ ] Hit sound on enemy damage
- [ ] Explosion sound on enemy/boss death
- [ ] BGM plays during normal gameplay (random track from gameplay/)
- [ ] BGM switches to boss music during boss fights
- [ ] BGM crossfades between gameplay and boss tracks
- [ ] BGM loops continuously

## Visual Polish
- [ ] Parallax background (3 layers at different speeds)
- [ ] Player thruster particle effect
- [ ] Screen shake on damage/explosions
- [ ] Floating score text on kills

## Key Bindings
- [ ] Arrow Keys / WASD: Move
- [ ] Space: Shoot / Start / Restart
- [ ] ESC / P: Pause
- [ ] R (pause): Restart
- [ ] Q (pause/game over/victory): Main menu
- [ ] 1: God mode toggle
- [ ] 2: Debug boss spawn
