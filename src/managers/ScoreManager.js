export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.highScore = this.loadHighScore();

        // Combo system
        this.combo = 0;
        this.comboMultiplier = 1;
        this.comboTimer = 0;
        this.maxComboTime = 3000; // 3 seconds to keep combo alive
    }

    addScore(points) {
        // Apply multiplier if points come from enemy kills (usually > 0)
        // We can infer it's a kill if points > 0.
        // For powerups/wave bonus, we might want to exclude multiplier, but applying it feels good too.
        // Let's apply it generally for satisfaction.

        const finalPoints = points * this.comboMultiplier;
        this.score += finalPoints;

        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }

        return finalPoints; // Return actual points added for floating text
    }

    increaseCombo() {
        this.combo++;
        this.comboTimer = this.maxComboTime;

        // Update multiplier
        if (this.combo >= 10) {
            this.comboMultiplier = 3;
        } else if (this.combo >= 5) {
            this.comboMultiplier = 2;
        } else {
            this.comboMultiplier = 1;
        }
    }

    resetCombo() {
        this.combo = 0;
        this.comboMultiplier = 1;
        this.comboTimer = 0;
    }

    update(time, delta) {
        if (this.combo > 0) {
            this.comboTimer -= delta;
            if (this.comboTimer <= 0) {
                this.resetCombo();
            }
        }
    }

    getScore() {
        return this.score;
    }

    getHighScore() {
        return this.highScore;
    }

    getCombo() {
        return this.combo;
    }

    getMultiplier() {
        return this.comboMultiplier;
    }

    getComboTimerPct() {
        if (this.combo <= 0) return 0;
        return Math.max(0, this.comboTimer / this.maxComboTime);
    }

    resetScore() {
        this.score = 0;
        this.resetCombo();
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem('spaceShooterHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            return 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('spaceShooterHighScore', this.highScore.toString());
        } catch (e) {
            console.warn('Could not save high score');
        }
    }
}
