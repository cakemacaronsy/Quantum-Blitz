# Best Practices Quick Reference Guide

## 🚨 ALWAYS Do These Things

### 1. **Before Using Any Object**
```javascript
// ❌ BAD
this.scene.player.takeDamage();

// ✅ GOOD
if (this.scene?.player?.active && this.scene.player.takeDamage) {
    this.scene.player.takeDamage();
}
```

### 2. **When Creating Timers**
```javascript
// ❌ BAD
this.scene.time.delayedCall(1000, () => {
    this.doSomething();
});

// ✅ GOOD
this.myTimer = this.scene.time.delayedCall(1000, () => {
    if (this.active && this.scene) {
        this.doSomething();
    }
    this.myTimer = null;
});

// In destroy():
destroy() {
    if (this.myTimer) {
        this.myTimer.remove();
        this.myTimer = null;
    }
    super.destroy();
}
```

### 3. **When Creating Tweens**
```javascript
// ❌ BAD
this.scene.tweens.add({
    targets: this,
    alpha: 0,
    repeat: -1
});

// ✅ GOOD
this.myTween = this.scene.tweens.add({
    targets: this,
    alpha: 0,
    repeat: -1
});

// In destroy():
destroy() {
    if (this.myTween) {
        this.myTween.stop();
        this.myTween = null;
    }
    super.destroy();
}
```

### 4. **In Collision Handlers**
```javascript
// ❌ BAD
bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.takeDamage(1);
}

// ✅ GOOD
bulletHitEnemy(bullet, enemy) {
    try {
        if (!bullet?.active || !enemy?.active) return;

        bullet.destroy();

        if (enemy.takeDamage) {
            enemy.takeDamage(1);
        }
    } catch (error) {
        console.error('Collision error:', error);
    }
}
```

### 5. **Accessing Physics Bodies**
```javascript
// ❌ BAD
this.body.velocity.x = 100;

// ✅ GOOD
if (this.body) {
    this.body.velocity.x = 100;
}

// OR use Phaser methods that do the check
this.setVelocityX(100);  // Safe - Phaser checks for you
```

---

## 📝 Code Templates

### Template: Create New Game Object
```javascript
export default class MyObject extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'my-texture');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Initialize arrays for cleanup
        this.timers = [];
        this.tweens = [];
    }

    // Helper method for safe timers
    addTimer(callback, delay) {
        const timer = this.scene.time.delayedCall(delay, () => {
            if (this.active && this.scene) {
                callback();
            }
        });
        this.timers.push(timer);
        return timer;
    }

    // Helper method for safe tweens
    addTween(config) {
        const tween = this.scene.tweens.add({
            ...config,
            targets: this
        });
        this.tweens.push(tween);
        return tween;
    }

    update(time, delta) {
        if (!this.scene || !this.active) return;

        // Your update logic here
    }

    // ALWAYS override destroy!
    destroy(fromScene) {
        // Clean up timers
        this.timers.forEach(timer => {
            if (timer) timer.remove();
        });
        this.timers = [];

        // Clean up tweens
        this.tweens.forEach(tween => {
            if (tween) tween.stop();
        });
        this.tweens = [];

        // Call parent destroy
        super.destroy(fromScene);
    }
}
```

### Template: Collision Handler
```javascript
handleCollision(objA, objB) {
    try {
        // Validate both objects exist and are active
        if (!objA?.active || !objB?.active) {
            return;
        }

        // Do collision logic
        objA.destroy();

        if (objB.takeDamage) {
            objB.takeDamage(1);
        }

    } catch (error) {
        console.error('Collision error:', error);
    }
}
```

### Template: Scene Update Method
```javascript
update(time, delta) {
    try {
        // Always validate before accessing
        if (this.player?.active) {
            this.player.update(time, delta);
        }

        if (this.scoreManager?.update) {
            this.scoreManager.update(time, delta);
        }

        // Your update logic here

    } catch (error) {
        console.error('Update error:', error);
        // Optionally pause on critical error
        // this.scene.pause();
    }
}
```

---

## 🎯 Common Patterns

### Pattern: Flash Effect (Safe)
```javascript
flashRed() {
    // Cancel previous flash
    if (this.flashTween) {
        this.flashTween.stop();
    }

    // Create new flash
    this.flashTween = this.scene.tweens.add({
        targets: this,
        tint: 0xff0000,
        duration: 100,
        yoyo: true,
        onComplete: () => {
            this.flashTween = null;
        }
    });
}

destroy() {
    if (this.flashTween) {
        this.flashTween.stop();
        this.flashTween = null;
    }
    super.destroy();
}
```

### Pattern: Delayed Callback (Safe)
```javascript
scheduleAction(callback, delay) {
    // Cancel previous action
    if (this.scheduledAction) {
        this.scheduledAction.remove();
    }

    // Schedule new action
    this.scheduledAction = this.scene.time.delayedCall(delay, () => {
        if (this.active && this.scene) {
            callback();
        }
        this.scheduledAction = null;
    });
}

destroy() {
    if (this.scheduledAction) {
        this.scheduledAction.remove();
        this.scheduledAction = null;
    }
    super.destroy();
}
```

### Pattern: Animation with Cleanup (Safe)
```javascript
playAnimation(key) {
    try {
        if (!this.anims) return;

        this.play(key);

        // Listen for completion
        const listener = () => {
            // Do something when done
            this.off('animationcomplete', listener);
        };

        this.once('animationcomplete', listener);

    } catch (error) {
        console.error('Animation error:', error);
    }
}
```

---

## 🚫 NEVER Do These Things

### ❌ Don't: Access Without Checking
```javascript
// WRONG
this.scene.player.x = 100;

// RIGHT
if (this.scene?.player?.active) {
    this.scene.player.x = 100;
}
```

### ❌ Don't: Create Unbounded Loops
```javascript
// WRONG - Can cause infinite loop
while (this.enemies.length > 0) {
    this.enemies[0].destroy();
}

// RIGHT - Use for loop or forEach
for (let i = this.enemies.length - 1; i >= 0; i--) {
    this.enemies[i].destroy();
}

// OR BEST - Use Phaser group methods
this.enemies.clear(true, true);
```

### ❌ Don't: Forget to Clean Up
```javascript
// WRONG - Timer never cleaned up
constructor() {
    setInterval(() => {
        this.update();
    }, 1000);
}

// RIGHT - Use Phaser timers and clean up
constructor() {
    this.updateTimer = this.scene.time.addEvent({
        delay: 1000,
        callback: () => this.update(),
        loop: true
    });
}

destroy() {
    if (this.updateTimer) {
        this.updateTimer.remove();
    }
    super.destroy();
}
```

### ❌ Don't: Use Magic Strings
```javascript
// WRONG
this.load.image('player', 'assets/player.png');
this.add.sprite(x, y, 'player');  // Easy to typo

// RIGHT - Use constants
const TEXTURES = {
    PLAYER: 'player'
};

this.load.image(TEXTURES.PLAYER, 'assets/player.png');
this.add.sprite(x, y, TEXTURES.PLAYER);  // Type-safe
```

### ❌ Don't: Silent Failures
```javascript
// WRONG - Error is swallowed
try {
    this.doSomething();
} catch (error) {
    // Nothing
}

// RIGHT - Always log
try {
    this.doSomething();
} catch (error) {
    console.error('Error doing something:', error);
}
```

---

## 🔍 Debugging Checklist

When you get a freeze/crash, check:

1. **Are any timers not cleaned up?**
   - Search for: `time.delayedCall`
   - Check: Is it stored? Is destroy() cleaning it?

2. **Are any tweens not cleaned up?**
   - Search for: `tweens.add`
   - Check: Is it stored? Is destroy() cleaning it?

3. **Are any objects accessed after destroy?**
   - Search for: `destroy()`
   - Check: What happens in callbacks after destroy?

4. **Are there any null pointer access?**
   - Search for: `.scene.` and `.player.`
   - Check: Are they validated before access?

5. **Are physics bodies checked?**
   - Search for: `.body.`
   - Check: Is there a `if (this.body)` check?

---

## 📱 Quick Reference Card

**Print this and keep it next to your keyboard:**

```
┌─────────────────────────────────────────┐
│  GAME DEV SAFETY CHECKLIST              │
├─────────────────────────────────────────┤
│  Before ANY object access:              │
│  ☐ Check if object exists               │
│  ☐ Check if object is active            │
│  ☐ Check if method exists               │
│                                         │
│  For EVERY timer/tween:                 │
│  ☐ Store the reference                  │
│  ☐ Check validity in callback           │
│  ☐ Clean up in destroy()                │
│                                         │
│  In EVERY collision:                    │
│  ☐ Wrap in try-catch                    │
│  ☐ Check both objects active            │
│  ☐ Log any errors                       │
│                                         │
│  For EVERY new class:                   │
│  ☐ Override destroy()                   │
│  ☐ Clean up all timers                  │
│  ☐ Clean up all tweens                  │
│  ☐ Call super.destroy()                 │
│                                         │
│  Before committing:                     │
│  ☐ No console.log left                  │
│  ☐ All errors handled                   │
│  ☐ Tested destroy path                  │
│  ☐ No magic strings                     │
└─────────────────────────────────────────┘
```

---

## 🎓 Learning Resources

### When to Use What:

| Scenario | Use This | Not This |
|----------|----------|----------|
| Delayed action | `scene.time.delayedCall()` | `setTimeout()` |
| Repeated action | `scene.time.addEvent({loop:true})` | `setInterval()` |
| Animation | `scene.tweens.add()` | Manual loop |
| Position object | `setPosition(x, y)` | `this.x = x; this.y = y` |
| Set velocity | `setVelocity(x, y)` | `this.body.velocity.x = x` |
| Destroy sprite | `this.destroy()` | `this.visible = false` |

---

## 💾 Save This File

**Keep this file open when coding!**

Whenever you write code, refer back to this guide.
Whenever you get a bug, check this guide first.
Whenever you're unsure, use the templates here.

---

## 🚀 Quick Start New Feature

When adding a new feature, follow this order:

1. **Plan** (5 minutes)
   - What objects will be created?
   - What timers/tweens needed?
   - What can go wrong?

2. **Code** (20 minutes)
   - Use templates from this guide
   - Add validation as you go
   - Add error handling as you go

3. **Test** (10 minutes)
   - Test happy path
   - Test destroying objects
   - Check browser console
   - Test edge cases

4. **Cleanup** (5 minutes)
   - Remove console.logs
   - Add comments
   - Check all timers cleaned up

**Total: 40 minutes per feature**
**vs**
**Writing fast, debugging for hours: Much longer**

---

*"An ounce of prevention is worth a pound of cure."*
*- Benjamin Franklin*

**Code defensively. Test thoroughly. Debug rarely.**
