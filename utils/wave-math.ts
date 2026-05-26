// Core wave-form mathematics for the Resonant Background
// Isolated calculations to ensure 100% test coverage of simulation mechanics.

export interface WaveSegment {
  x: number;
  y: number;
  amplitude: number;
}

/**
 * Calculates a standard animated wave displacement using multiple superimposed sine waves.
 * @param x Horizontal pixel position
 * @param time Elapsed time factor (for animation)
 * @param baseFrequency Base scale frequency of the waves
 * @param baseAmplitude Peak height of the waves
 */
export function calculateWaveHeight(
  x: number,
  time: number,
  baseFrequency: number = 0.005,
  baseAmplitude: number = 20
): number {
  const sin1 = Math.sin(x * baseFrequency + time);
  const sin2 = Math.sin(x * baseFrequency * 2.5 - time * 0.7) * 0.4;
  const sin3 = Math.sin(x * baseFrequency * 0.5 + time * 0.3) * 0.6;
  
  return (sin1 + sin2 + sin3) * baseAmplitude;
}

/**
 * Calculates mouse-induced distortion (warp) at a given point on the wave.
 * Deforms the wave with a beautiful Lorentzian/Gaussian bell curve profile based on proximity.
 * @param x Point coordinate on screen
 * @param waveY Original calculated wave Y coordinate
 * @param mouseX Current mouse X coordinate
 * @param mouseY Current mouse Y coordinate
 * @param radius Distance threshold for mouse interaction
 * @param strength Distortion push/pull multiplier
 */
export function calculateMouseDistortion(
  x: number,
  waveY: number,
  mouseX: number,
  mouseY: number,
  radius: number = 150,
  strength: number = 40
): { dy: number; scale: number } {
  const dx = x - mouseX;
  const dy = waveY - mouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= radius) {
    return { dy: 0, scale: 1.0 };
  }

  // Smooth Gaussian drop-off factor: 1 at center, approaching 0 at outer radius
  const factor = Math.pow(1 - distance / radius, 2);
  
  // Push wave vertically away from the mouse
  const pushY = Math.sign(dy) * factor * strength;
  
  return {
    dy: pushY,
    scale: 1.0 + factor * 0.5 // slightly swell the amplitude near the mouse
  };
}

/**
 * Calculates a grid-based particle/point position for mouse attraction.
 * Used for beautiful trailing resonance nodes.
 */
export function interpolatePoints(
  current: number,
  target: number,
  lerpFactor: number = 0.1
): number {
  return current + (target - current) * lerpFactor;
}
