import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ResonantBackground from '../components/ResonantBackground.vue';

// Mock canvas methods
const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn()
  }),
  fill: vi.fn()
};

describe('ResonantBackground Component', () => {
  it('renders a canvas element', () => {
    // Stub global canvas getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);

    const wrapper = mount(ResonantBackground, {
      props: {
        active: true
      }
    });

    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
    expect(canvas.classes()).toContain('opacity-100');
  });

  it('adjusts opacity when active property is false', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);

    const wrapper = mount(ResonantBackground, {
      props: {
        active: false
      }
    });

    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
    expect(canvas.classes()).toContain('opacity-40');
  });
});
