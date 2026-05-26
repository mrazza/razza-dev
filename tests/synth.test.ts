import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioSynth } from '../utils/synth';

describe('AudioSynth Unit Tests', () => {
  let synth: AudioSynth;

  beforeEach(() => {
    // Reset global window mocks if any
    vi.restoreAllMocks();
    synth = new AudioSynth();
  });

  it('should initialize with default master volume', () => {
    expect(synth.getMasterVolume()).toBe(0.15);
    expect(synth.getMuteStatus()).toBe(false);
  });

  it('should accept custom master volume in constructor', () => {
    const customSynth = new AudioSynth({ masterVolume: 0.5 });
    expect(customSynth.getMasterVolume()).toBe(0.5);
  });

  it('should clamp master volume to range 0.0 - 1.0', () => {
    synth.setMasterVolume(1.5);
    expect(synth.getMasterVolume()).toBe(1.0);

    synth.setMasterVolume(-0.5);
    expect(synth.getMasterVolume()).toBe(0.0);

    synth.setMasterVolume(0.45);
    expect(synth.getMasterVolume()).toBe(0.45);
  });

  it('should toggle mute state correctly', () => {
    expect(synth.getMuteStatus()).toBe(false);
    
    const isMutedFirst = synth.toggleMute();
    expect(isMutedFirst).toBe(true);
    expect(synth.getMuteStatus()).toBe(true);

    const isMutedSecond = synth.toggleMute();
    expect(isMutedSecond).toBe(false);
    expect(synth.getMuteStatus()).toBe(false);
  });

  it('should handle initialization failure gracefully outside browser environment', () => {
    // Inside node/vitest, window.AudioContext is undefined
    const initSuccess = synth.init();
    expect(initSuccess).toBe(false);

    // Calling play methods should not throw errors even if not initialized
    expect(() => synth.playTick()).not.toThrow();
    expect(() => synth.playImpact(5.0)).not.toThrow();
    expect(() => synth.playChord(220, 'major')).not.toThrow();
    expect(() => synth.playDrone(110)).not.toThrow();
  });

  it('should initialize and play sounds correctly when window.AudioContext is present', async () => {
    // Create detailed mock structure for Web Audio API
    const mockSetValueAtTime = vi.fn();
    const mockExponentialRampToValueAtTime = vi.fn();
    const mockLinearRampToValueAtTime = vi.fn();
    const mockSetTargetAtTime = vi.fn();
    const mockConnect = vi.fn();
    const mockStart = vi.fn();
    const mockStop = vi.fn();

    const mockParam = {
      setValueAtTime: mockSetValueAtTime,
      exponentialRampToValueAtTime: mockExponentialRampToValueAtTime,
      linearRampToValueAtTime: mockLinearRampToValueAtTime,
      setTargetAtTime: mockSetTargetAtTime,
      value: 1
    };

    const mockOscillator = {
      type: 'sine',
      frequency: { ...mockParam, value: 440 },
      connect: mockConnect,
      start: mockStart,
      stop: mockStop
    };

    const mockGainNode = {
      gain: { ...mockParam, value: 1 },
      connect: mockConnect
    };

    // Use regular ES5 function so it works as a constructor
    const mockAudioContextImpl = function(this: any) {
      this.currentTime = 100;
      this.state = 'suspended';
      this.createOscillator = vi.fn().mockReturnValue(mockOscillator);
      this.createGain = vi.fn().mockReturnValue(mockGainNode);
      this.destination = {};
      this.resume = vi.fn().mockResolvedValue(undefined);
    };

    const mockAudioContext = vi.fn().mockImplementation(mockAudioContextImpl as any);

    // Mock global window AudioContext
    vi.stubGlobal('window', {
      AudioContext: mockAudioContext
    });

    // Now test initialization
    const initSuccess = synth.init();
    expect(initSuccess).toBe(true);

    // Resume method
    const resumeSuccess = await synth.resume();
    expect(resumeSuccess).toBe(true);

    // Test volume adjustment propagates to native gain node
    synth.setMasterVolume(0.8);
    expect(mockSetTargetAtTime).toHaveBeenCalledWith(0.8, 100, 0.05);

    // Test muting propagates to native gain node
    synth.toggleMute();
    expect(mockSetTargetAtTime).toHaveBeenCalledWith(0, 100, 0.05);

    // Test playTick triggers nodes
    synth.playTick();
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();

    // Test playImpact triggers multiple oscillators
    mockOscillator.start.mockClear();
    synth.playImpact(8.0);
    // playImpact triggers 4 harmonics, so start/stop should be called 4 times
    expect(mockOscillator.start).toHaveBeenCalledTimes(4);

    // Test playChord triggers multiple oscillators
    mockOscillator.start.mockClear();
    synth.playChord(220, 'resonant', 2.0);
    expect(mockOscillator.start).toHaveBeenCalledTimes(5); // resonant has 5 ratios

    // Test playDrone triggers osc & lfo
    mockOscillator.start.mockClear();
    synth.playDrone(110, 5);
    expect(mockOscillator.start).toHaveBeenCalledTimes(2); // drone osc + lfo
  });
});
