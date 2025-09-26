/**
 * Sound System for BuildRoulette
 * Provides subtle audio feedback for user interactions
 */

interface SoundSettings {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private settings: SoundSettings = { enabled: true, volume: 0.3 };
  private isInitialized = false;

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('buildroulette-sound-settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.settings.enabled = false;
    }
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('buildroulette-sound-settings', JSON.stringify(this.settings));
  }

  private async initializeAudio(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio context not available:', error);
      this.settings.enabled = false;
    }
  }

  private async playTone(
    frequency: number,
    duration: number,
    volume: number = 1,
    type: OscillatorType = 'sine'
  ): Promise<void> {
    if (!this.settings.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      const finalVolume = this.settings.volume * volume;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  // Sound Effects
  async clickSound(): Promise<void> {
    await this.initializeAudio();
    await this.playTone(800, 0.1, 0.5, 'square');
  }

  async hoverSound(): Promise<void> {
    await this.initializeAudio();
    await this.playTone(1000, 0.05, 0.3, 'sine');
  }

  async spinStartSound(): Promise<void> {
    await this.initializeAudio();
    // Ascending tone for spin start
    if (!this.audioContext) return;

    const startTime = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(200, startTime);
    oscillator.frequency.linearRampToValueAtTime(400, startTime + 0.3);
    oscillator.type = 'sawtooth';

    const volume = this.settings.volume * 0.4;
    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  }

  async reelStopSound(): Promise<void> {
    await this.initializeAudio();
    await this.playTone(600, 0.15, 0.6, 'square');
  }

  async allReelsStoppedSound(): Promise<void> {
    await this.initializeAudio();
    // Victory chime - two tone harmony
    if (!this.audioContext) return;

    const startTime = this.audioContext.currentTime;
    const playChord = (freq1: number, freq2: number) => {
      [freq1, freq2].forEach(freq => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = 'sine';

        const volume = this.settings.volume * 0.3;
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.8);
      });
    };

    playChord(523, 659); // C5 and E5 - pleasant major third
  }

  async generateIdeasSound(): Promise<void> {
    await this.initializeAudio();
    // Magical swoosh sound
    if (!this.audioContext) return;

    const startTime = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(1200, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, startTime + 0.4);
    oscillator.type = 'sine';

    const volume = this.settings.volume * 0.5;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.4);
  }

  async successSound(): Promise<void> {
    await this.initializeAudio();
    // Success notification - ascending notes
    const notes = [523, 659, 784]; // C5, E5, G5
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        const note = notes[i];
        if (note) {
          this.playTone(note, 0.2, 0.4, 'sine');
        }
      }, i * 100);
    }
  }

  async errorSound(): Promise<void> {
    await this.initializeAudio();
    // Gentle error sound - not harsh
    await this.playTone(300, 0.3, 0.5, 'triangle');
  }

  async settingsOpenSound(): Promise<void> {
    await this.initializeAudio();
    await this.playTone(700, 0.1, 0.4, 'sine');
  }

  async settingsCloseSound(): Promise<void> {
    await this.initializeAudio();
    await this.playTone(500, 0.1, 0.4, 'sine');
  }

  // Settings Management
  toggle(): void {
    this.settings.enabled = !this.settings.enabled;
    this.saveSettings();
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.settings.enabled;
  }

  getVolume(): number {
    return this.settings.volume;
  }

  // Test sound for settings
  async testSound(): Promise<void> {
    await this.clickSound();
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = {
  click: () => soundManager.clickSound(),
  hover: () => soundManager.hoverSound(),
  spinStart: () => soundManager.spinStartSound(),
  reelStop: () => soundManager.reelStopSound(),
  allReelsStopped: () => soundManager.allReelsStoppedSound(),
  generateIdeas: () => soundManager.generateIdeasSound(),
  success: () => soundManager.successSound(),
  error: () => soundManager.errorSound(),
  settingsOpen: () => soundManager.settingsOpenSound(),
  settingsClose: () => soundManager.settingsCloseSound(),
};