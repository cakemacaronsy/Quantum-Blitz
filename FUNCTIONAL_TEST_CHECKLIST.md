# Functional Test Checklist
## Complete Game Testing Guide

---

## 🎯 Pre-Test Setup

### Requirements:
- [ ] Browser console open (F12 → Console tab)
- [ ] No console errors on page load
- [ ] Game loads and shows menu screen
- [ ] Sound working (if applicable)

---

## 📋 Test Categories

---

## 1. MENU & NAVIGATION (5 tests)

### Menu Display
- [ ] Menu shows "RETRO SPACE SHOOTER" title
- [ ] "PRESS SPACE TO START" visible
- [ ] High score displays correctly
- [ ] Background scrolls smoothly
- [ ] Controls legend visible at bottom

### Menu Controls
- [ ] Press SPACE → Game starts
- [ ] Background music plays (if implemented)
- [ ] No console errors during transition

### Return to Menu
- [ ] Start game → Press ESC → Press Q → Returns to menu
- [ ] High score updates if beaten
- [ ] Menu state resets properly

---

## 2. PLAYER CONTROLS (8 tests)

### Movement
- [ ] UP arrow / W key → Player moves up
- [ ] DOWN arrow / S key → Player moves down
- [ ] LEFT arrow / A key → Player moves left
- [ ] RIGHT arrow / D key → Player moves right
- [ ] Player cannot move off-screen (bounds check)
- [ ] Movement is smooth and responsive
- [ ] Diagonal movement works (UP+LEFT, etc.)

### Shooting
- [ ] SPACE bar → Bullet fires
- [ ] Bullets fire at consistent rate (~300ms)
- [ ] Bullets move straight upward
- [ ] Multiple bullets can be on-screen
- [ ] Bullets disappear at top of screen
- [ ] No bullets left behind after many shots

### Pause
- [ ] ESC key pauses game
- [ ] P key also pauses game
- [ ] Game actually pauses (enemies stop)
- [ ] Background still visible when paused

---

## 3. ENEMY BEHAVIOR (12 tests)

### Wave 1-2 (Small Enemies)
- [ ] Small enemies spawn at top
- [ ] Move straight down
- [ ] Die in 1 hit
- [ ] Award 50 points
- [ ] Do NOT shoot bullets
- [ ] Explosion plays on death
- [ ] Body disappears after death

### Wave 3-5 (Small + Medium)
- [ ] Medium enemies appear
- [ ] Move in zigzag pattern
- [ ] Take 2 hits to destroy
- [ ] Award 100 points
- [ ] Shoot red bullets downward
- [ ] Bullets move at reasonable speed

### Wave 6+ (All Types)
- [ ] Large enemies appear
- [ ] Perform dive attacks toward player
- [ ] Take 5 hits to destroy
- [ ] Award 200 points
- [ ] Shoot frequently (70% chance)
- [ ] Screen shakes when large enemy dies

### Enemy Cleanup
- [ ] Enemies disappear below screen
- [ ] No enemies left behind after wave
- [ ] No console errors when enemy dies
- [ ] Flash red when hit (before death)

---

## 4. COLLISION DETECTION (8 tests)

### Player Bullet → Enemy
- [ ] Bullet disappears on contact
- [ ] Enemy takes damage (health decreases)
- [ ] Enemy flashes red briefly
- [ ] Enemy dies after correct # of hits
- [ ] Score increases
- [ ] Combo increases
- [ ] No duplicate collision detection
- [ ] No console errors

### Enemy Bullet → Player
- [ ] Enemy bullet disappears on contact
- [ ] Player flashes white briefly
- [ ] Player loses 1 life
- [ ] Lives display updates
- [ ] Player does NOT die if has shield
- [ ] Shield disappears after hit
- [ ] No console errors

### Enemy → Player (Collision)
- [ ] Enemy is destroyed
- [ ] Player takes damage
- [ ] Lives decrease
- [ ] Both objects properly destroyed
- [ ] No console errors

### Player → PowerUp
- [ ] PowerUp disappears
- [ ] Score increases (+25)
- [ ] PowerUp activates (visual feedback)
- [ ] PowerUp indicator shows at top
- [ ] No console errors

---

## 5. POWERUP SYSTEM (12 tests)

### PowerUp Spawning
- [ ] PowerUps drop from destroyed enemies
- [ ] Drop rate seems reasonable (~15%)
- [ ] Float down slowly
- [ ] Spin/rotate animation plays
- [ ] Different colors for different types
- [ ] Disappear at bottom if not collected

### Spread Shot PowerUp
- [ ] Fires 3 bullets (1 center, 2 angled)
- [ ] Indicator shows "⚡ SPREAD SHOT"
- [ ] Lasts 8 seconds
- [ ] Reverts to normal after duration
- [ ] Can override other powerups
- [ ] No console errors

### Rapid Fire PowerUp
- [ ] Fire rate doubles (faster shooting)
- [ ] Indicator shows "⚡ RAPID FIRE"
- [ ] Lasts 8 seconds
- [ ] Reverts to normal after duration
- [ ] No console errors

### Shield PowerUp
- [ ] Cyan circle appears around player
- [ ] Pulses/animates
- [ ] Indicator shows "⚡ SHIELD"
- [ ] Absorbs ONE hit
- [ ] Disappears after taking hit
- [ ] Player does not lose life when shielded
- [ ] No console errors

---

## 6. SCORING SYSTEM (8 tests)

### Basic Scoring
- [ ] Score displays at top left
- [ ] Score increases when enemies killed
- [ ] Small enemy: +50 points
- [ ] Medium enemy: +100 points
- [ ] Large enemy: +200 points
- [ ] PowerUp: +25 points
- [ ] Wave completion: +100 bonus

### Combo System
- [ ] Killing enemies increases combo
- [ ] Combo displays as "Nx COMBO (Mx)"
- [ ] Combo 1-4: 1x multiplier
- [ ] Combo 5-9: 2x multiplier
- [ ] Combo 10+: 3x multiplier
- [ ] Combo resets after 3 seconds no kills
- [ ] Score properly multiplied by combo
- [ ] Combo text grows with combo count

### High Score
- [ ] High score displays at top
- [ ] Saved between game sessions (localStorage)
- [ ] Updates during game if beaten
- [ ] Shown at game over screen
- [ ] "NEW HIGH SCORE!" message if beaten

---

## 7. WAVE MANAGEMENT (10 tests)

### Wave Progression
- [ ] Wave 1 starts automatically
- [ ] "Wave 1" message displays at start
- [ ] Wave number shows in UI
- [ ] Enemies spawn at reasonable rate
- [ ] Wave completes when all enemies gone
- [ ] "Wave Complete!" message shows
- [ ] Bonus points awarded
- [ ] 2-second pause between waves
- [ ] Next wave starts automatically
- [ ] Wave number increments

### Wave Difficulty
- [ ] Wave 1: 5 enemies (small only)
- [ ] Wave 2: 7 enemies (small only)
- [ ] Wave 3: 9 enemies (small + medium)
- [ ] Wave 5: 13 enemies (small + medium)
- [ ] Wave 6+: Mix of all types
- [ ] Enemy count increases each wave
- [ ] More difficult enemies in later waves
- [ ] Game gets progressively harder

### Wave Cleanup
- [ ] Escaped enemies count toward completion
- [ ] Wave doesn't get stuck if enemies escape
- [ ] No infinite wave bug
- [ ] Wave counter accurate

---

## 8. UI & DISPLAY (8 tests)

### HUD Elements
- [ ] Score displays correctly
- [ ] High score displays correctly
- [ ] Lives display shows current lives
- [ ] Wave number displays correctly
- [ ] PowerUp indicator shows active powerup
- [ ] Combo text shows when combo > 1
- [ ] All text readable and not overlapping

### Visual Feedback
- [ ] Floating score numbers appear on kills
- [ ] "Wave N" message at wave start
- [ ] "Wave Complete!" message at wave end
- [ ] Explosions play on enemy death
- [ ] Player death explosion plays
- [ ] Screen shakes on large enemy death
- [ ] Background scrolls continuously

### Performance
- [ ] Game runs at 60 FPS (smooth)
- [ ] No stuttering or lag
- [ ] No memory leaks (play for 5+ minutes)
- [ ] Browser doesn't slow down

---

## 9. PAUSE MENU (6 tests)

### Pause Functionality
- [ ] ESC or P pauses game
- [ ] "PAUSED" message displays
- [ ] Game actually stops (enemies frozen)
- [ ] Semi-transparent overlay visible
- [ ] Controls shown: ESC/P Resume, R Restart, Q Quit

### Pause Controls
- [ ] ESC or P → Resume game
- [ ] R → Restart from Wave 1
- [ ] Q → Return to main menu
- [ ] No console errors
- [ ] Game state properly restored on resume
- [ ] Score/lives preserved on resume

---

## 10. GAME OVER (6 tests)

### Death Sequence
- [ ] Player dies when lives reach 0
- [ ] Player explosion plays
- [ ] 1-second delay before game over screen
- [ ] Game over screen displays
- [ ] Final score shown
- [ ] Wave reached shown

### Game Over Screen
- [ ] Shows "GAME OVER"
- [ ] Shows final score
- [ ] Shows wave reached
- [ ] Shows high score OR "NEW HIGH SCORE!"
- [ ] Controls shown: SPACE Restart, Q Menu
- [ ] Visual celebration if new high score

### Game Over Controls
- [ ] SPACE → Restart game (Wave 1, fresh)
- [ ] Q → Return to main menu
- [ ] High score updated in menu
- [ ] No console errors

---

## 11. ERROR HANDLING (5 tests)

### No Crashes
- [ ] Play 5+ minutes without freeze
- [ ] Kill 50+ enemies without crash
- [ ] Collect 10+ powerups without crash
- [ ] Die and restart 3+ times without crash
- [ ] Pause and resume 5+ times without crash

### Console Errors
- [ ] No red errors in console during gameplay
- [ ] No yellow warnings (or acceptable ones)
- [ ] If error occurs, alert shows message
- [ ] Game doesn't silently freeze
- [ ] Error messages are helpful

---

## 12. EDGE CASES (8 tests)

### Rapid Actions
- [ ] Spam SPACE (rapid fire) → No crash
- [ ] Spam ESC (rapid pause/unpause) → Works
- [ ] Kill many enemies at once → No crash
- [ ] Collect multiple powerups quickly → Works
- [ ] Die while powerup active → Cleans up properly

### Boundary Conditions
- [ ] Player at screen edge can still shoot
- [ ] Enemy at screen edge behaves correctly
- [ ] Bullets at screen edge disappear properly
- [ ] Wave with 0 enemies (escaped all) → Completes

### State Transitions
- [ ] Pause during wave transition → Works
- [ ] Die during powerup → Cleans up properly
- [ ] Restart during pause → Works correctly
- [ ] Return to menu during game → Cleans up properly

---

## 📊 Test Results Summary

### Pass Rate Calculation:
```
Total Tests: 126
Tests Passed: ___
Pass Rate: ___%

Target: 95%+ pass rate
```

### Category Breakdown:

| Category | Tests | Passed | % |
|----------|-------|--------|---|
| Menu & Navigation | 5 | ___ | ___% |
| Player Controls | 8 | ___ | ___% |
| Enemy Behavior | 12 | ___ | ___% |
| Collision Detection | 8 | ___ | ___% |
| PowerUp System | 12 | ___ | ___% |
| Scoring System | 8 | ___ | ___% |
| Wave Management | 10 | ___ | ___% |
| UI & Display | 8 | ___ | ___% |
| Pause Menu | 6 | ___ | ___% |
| Game Over | 6 | ___ | ___% |
| Error Handling | 5 | ___ | ___% |
| Edge Cases | 8 | ___ | ___% |

---

## 🐛 Bug Report Template

If any test fails, use this format:

```markdown
## Bug: [Short Description]

**Category**: [Test category]
**Test**: [Specific test that failed]
**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:


**Actual Behavior**:


**Console Errors** (if any):


**Screenshots/Video**:


**Environment**:
- Browser:
- OS:
- Date/Time:
```

---

## ✅ Final Verification

### Before Declaring "Production Ready":

- [ ] All 126 tests passed (or documented exceptions)
- [ ] No critical bugs
- [ ] No console errors during 10-minute play session
- [ ] High score persistence works
- [ ] Game is fun to play (subjective but important!)
- [ ] All controls responsive
- [ ] Visual polish complete
- [ ] Audio working (if implemented)

### Performance Benchmarks:

- [ ] Loads in < 3 seconds
- [ ] Maintains 60 FPS during gameplay
- [ ] Memory usage stable over 10 minutes
- [ ] No memory leaks detected

---

## 🎮 Playtest Checklist

### Have 3-5 friends playtest:

**Questions to ask**:
1. Is the game fun?
2. Are the controls intuitive?
3. Is the difficulty progression fair?
4. Did you experience any bugs or crashes?
5. What would make the game better?

**Observe**:
- Do they understand how to play without instructions?
- Do they get frustrated at any point?
- Do they want to keep playing?
- Do they try different strategies?

---

## 📝 Notes Section

Use this space for additional observations:

```
Date:
Tester:
Build Version:

Notes:






```

---

## 🚀 When All Tests Pass

1. **Document**:
   - Create CHANGELOG.md with all changes
   - Update README.md with instructions
   - Add credits and attributions

2. **Package**:
   - Remove console.log statements
   - Minify code (optional)
   - Optimize assets
   - Create build folder

3. **Deploy**:
   - Test on live server
   - Share with friends
   - Gather feedback
   - Iterate and improve

---

**Remember**: Testing is not a one-time thing. Every time you add a feature or fix a bug, run through relevant tests again to prevent regressions.

**Good luck, and have fun testing!** 🎮✨
