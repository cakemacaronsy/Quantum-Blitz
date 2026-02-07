export default class SfxManager {
  constructor(scene) {
    this.scene = scene;
    // Event -> sound key map (fallbacks to existing SFX)
    this.map = {
      'wave-start': 'sfx-shot2',
      'player-bomb': 'sfx-explosion',
      'player-hit': 'sfx-hit',
      'enemy-hit': 'sfx-hit',
      'enemy-explode': 'sfx-explosion',
      'powerup-pickup': 'sfx-shot2',
      'boss-phase-change': 'sfx-hit',
      'boss-warning': 'sfx-hit',
      'laser-start': 'sfx-shot2',
      'missile-launch': 'sfx-shot2',
      'extend': 'sfx-shot2',
    };
  }

  play(event, opts = {}) {
    if (!this.scene || !this.scene.sound) return;
    const key = this.map[event];
    if (!key) return;
    try {
      const sfx = this.scene.sound.add(key, { volume: opts.volume ?? 0.4, loop: false });
      sfx.once('complete', () => sfx.destroy());
      sfx.play();
    } catch (e) {
      // Fail silently if key wasn’t loaded
    }
  }
}

