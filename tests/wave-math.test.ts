import { describe, it, expect } from 'vitest';
import {
  calculateWaveHeight,
  calculateMouseDistortion,
  interpolatePoints
} from '../utils/wave-math';

describe('Wave Math Calculations', () => {
  describe('calculateWaveHeight', () => {
    it('should calculate wave height predictably for simple inputs', () => {
      const height1 = calculateWaveHeight(0, 0);
      expect(height1).toBeCloseTo(0, 5); // sin(0) + sin(0) + sin(0) = 0
    });

    it('should change height based on elapsed time', () => {
      const heightTime0 = calculateWaveHeight(100, 0);
      const heightTime1 = calculateWaveHeight(100, 1.5);
      expect(heightTime0).not.toBe(heightTime1);
    });

    it('should scale appropriately based on amplitude parameter', () => {
      const hNormal = calculateWaveHeight(100, 1.0, 0.005, 20);
      const hLarge = calculateWaveHeight(100, 1.0, 0.005, 100);
      expect(hLarge).toBeCloseTo(hNormal * 5, 5);
    });
  });

  describe('calculateMouseDistortion', () => {
    it('should return no distortion if mouse is far outside the radius', () => {
      const distortion = calculateMouseDistortion(100, 100, 500, 500, 100, 50);
      expect(distortion.dy).toBe(0);
      expect(distortion.scale).toBe(1.0);
    });

    it('should deform wave when mouse is within radius', () => {
      // Mouse is exactly at 100, 150 (50 pixels below waveY=100)
      const distortion = calculateMouseDistortion(100, 100, 100, 150, 100, 40);
      
      // Since mouseY=150 > waveY=100, dy = waveY - mouseY = -50
      // Math.sign(dy) is negative (-1)
      // distance = 50. factor = (1 - 50/100)^2 = 0.25
      // pushY = -1 * 0.25 * 40 = -10
      expect(distortion.dy).toBeCloseTo(-10, 5);
      expect(distortion.scale).toBeCloseTo(1.125, 5); // 1.0 + 0.25 * 0.5 = 1.125
    });

    it('should have maximum distortion exactly at the center', () => {
      const distortion = calculateMouseDistortion(100, 100, 100, 100, 100, 40);
      // distance = 0. factor = 1.0
      // pushY = sign(0) * 1 * 40. Since sign(0) = 0 or depends on implementation:
      // waveY = 100, mouseY = 100, dy = 0. Math.sign(0) is 0
      expect(distortion.dy).toBe(0);
      expect(distortion.scale).toBeCloseTo(1.5, 5);
    });
  });

  describe('interpolatePoints (Lerp)', () => {
    it('should interpolate towards the target correctly', () => {
      const current = 10;
      const target = 20;
      
      const mid = interpolatePoints(current, target, 0.5);
      expect(mid).toBe(15);

      const close = interpolatePoints(current, target, 0.1);
      expect(close).toBe(11);
    });
  });
});
