// Web Audio Synthesizer for razza.dev
// Generates ambient sounds, clicks, chord transitions, and collision impacts programmatically.

export interface SynthOptions {
  masterVolume?: number;
}

export class AudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.15; // default comfortable master volume (0.0 to 1.0)

  constructor(options?: SynthOptions) {
    if (options && options.masterVolume !== undefined) {
      this.volume = options.masterVolume;
    }
  }

  /**
   * Safe lazy initialization of AudioContext on user interaction to comply with browser autoplay policies.
   */
  init(): boolean {
    if (this.ctx) return true;
    
    const AudioContextClass = typeof window !== 'undefined' 
      ? (window.AudioContext || (window as any).webkitAudioContext) 
      : null;

    if (!AudioContextClass) {
      // Return false in Node environments/tests unless mocked
      return false;
    }

    try {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      return true;
    } catch (e) {
      console.warn('Failed to initialize AudioContext:', e);
      return false;
    }
  }

  /**
   * Resumes the audio context if it was suspended (browser-specific behavior).
   */
  async resume(): Promise<boolean> {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
      return true;
    }
    return !!this.ctx;
  }

  /**
   * Set Master Volume (0.0 to 1.0)
   */
  setMasterVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  getMasterVolume(): number {
    return this.volume;
  }

  /**
   * Toggle mute status
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  getMuteStatus(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a subtle, soft click sound (perfect for UI hover/interaction)
   */
  playTick() {
    if (!this.init() || !this.ctx || !this.masterGain) return;
    
    const now = this.ctx.currentTime;
    
    // An elegant bandpass-filtered pop
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    // Fast frequency sweep for a "tick" character
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
    
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Plays a chime-like impact tone based on collision velocity
   * @param velocity relative intensity of the collision (typically 0.0 to 10.0+)
   */
  playImpact(velocity: number) {
    if (!this.init() || !this.ctx || !this.masterGain) return;

    const scale = Math.min(Math.max(velocity, 0.1), 15);
    const volumeFactor = Math.min(scale / 10, 1.2);
    
    // Choose fundamental frequency based on velocity (stronger hits sound slightly higher pitch / brighter)
    const baseFreq = 180 + (volumeFactor * 240); // 180Hz - 420Hz

    const now = this.ctx.currentTime;
    const duration = 0.15 + (volumeFactor * 0.35); // longer ring-out for heavier hits

    // Dynamic physical modeling: combine 3 sine waves in odd ratios to simulate metal/wood resonance
    const partials = [1, 1.48, 2.21, 3.12];
    const amplitudes = [1.0, 0.4, 0.2, 0.1];

    partials.forEach((ratio, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      // Higher partials decay faster (realistic physics)
      const partialDecay = duration / (1 + idx * 0.5);

      gain.gain.setValueAtTime(amplitudes[idx] * volumeFactor * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + partialDecay);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + partialDecay);
    });
  }

  /**
   * Plays a gentle wave of notes (chord) on transitions or special interactions
   * Uses major pentatonic / ambient scales for beautiful consonant harmonies
   */
  playChord(rootFreq: number = 220, chordType: 'major' | 'minor' | 'suspended' | 'resonant' = 'resonant', duration: number = 1.5) {
    if (!this.init() || !this.ctx || !this.masterGain) return;

    // Scale frequency ratios
    const ratios = {
      major: [1, 1.25, 1.5, 1.875, 2], // Root, M3, 5th, M7, Octave
      minor: [1, 1.189, 1.5, 1.782, 2], // Root, m3, 5th, m7, Octave
      suspended: [1, 1.333, 1.5, 1.898, 2.25], // Root, p4, 5th, M7, 9th
      resonant: [1, 1.5, 2, 2.5, 3] // Open natural physical harmonics
    }[chordType];

    const now = this.ctx.currentTime;

    ratios.forEach((ratio, index) => {
      if (!this.ctx || !this.masterGain) return;
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      // Soft triangle waves for warm, vintage ambient texture
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(rootFreq * ratio, now);

      // Stagger notes slightly for a beautiful, organic strum/arpeggio effect
      const staggerDelay = index * 0.08;
      const startTime = now + staggerDelay;
      
      gainNode.gain.setValueAtTime(0, now);
      // Soft attack
      gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.15);
      // Long, lush release
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  /**
   * Programmatic drone hum that swells and breathes
   */
  playDrone(freq: number = 110, duration: number = 4) {
    if (!this.init() || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // LFO to modulate the sound's volume and give it "breathing" movement
    lfo.frequency.setValueAtTime(0.3, now); // slow breath 0.3Hz
    lfoGain.gain.setValueAtTime(0.03, now); // subtle variation

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.06, now + duration * 0.3); // swell in
    gainNode.gain.linearRampToValueAtTime(0.06, now + duration * 0.7); // hold
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // fade

    // Connect LFO modulation
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    lfo.start(now);
    osc.start(now);

    lfo.stop(now + duration);
    osc.stop(now + duration);
  }
}
