import Phaser from 'phaser';
import { generateTextures } from '../utils/textures';

/**
 * BootScene
 *
 * The first scene the game boots into. It exists to:
 *   1. Render a brief "loading" splash so the player sees something
 *      while textures are being forged at runtime.
 *   2. Generate every texture the game needs (players, steps, ladder,
 *      particles) via `generateTextures`, so the project ships with
 *      zero binary image assets.
 *   3. Hand off to the main 'Game' scene.
 *
 * Texture generation is idempotent: `generateTextures` skips any key
 * that already exists, so re-entering this scene (e.g. after a hard
 * reset) is safe.
 */
export class BootScene extends Phaser.Scene {
  private loadingLabel: Phaser.GameObjects.Text | null = null;
  private started: boolean = false;

  constructor() {
    super('Boot');
  }

  create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0e1420');

    // Small splash so the (fast) texture generation is visible.
    this.loadingLabel = this.add
      .text(width / 2, height / 2, 'Forging textures…', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#e8eef7',
      })
      .setOrigin(0.5)
      .setAlpha(0.9);

    // Pulse the label gently while we work.
    this.tweens.add({
      targets: this.loadingLabel,
      alpha: 0.35,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // Build all runtime textures (players, steps, ladder, particles).
    generateTextures(this);

    // Give the splash a moment to be seen, then start the game.
    this.time.delayedCall(450, () => {
      this.startGame();
    });
  }

  private startGame(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.scene.start('Game');
  }

  destroy(fromPreload: boolean): void {
    this.loadingLabel?.destroy();
    this.loadingLabel = null;
    super.destroy(fromPreload);
  }
}