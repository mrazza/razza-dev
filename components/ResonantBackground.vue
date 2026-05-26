<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { calculateWaveHeight, calculateMouseDistortion } from '../utils/wave-math';

const props = defineProps<{
  active: boolean;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mouse = ref({ x: -1000, y: -1000 });
let animationFrameId: number;
let time = 0;

const handleMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  mouse.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

const handleMouseLeave = () => {
  mouse.value = { x: -1000, y: -1000 };
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Animation Loop
const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Extremely subtle trailing clear for smooth glow persistence
  ctx.fillStyle = 'rgba(10, 10, 12, 0.12)';
  ctx.fillRect(0, 0, w, h);

  if (!props.active) {
    animationFrameId = requestAnimationFrame(draw);
    return;
  }

  time += 0.015;

  // We render 3 layered harmonic waves for depth
  const waves = [
    { freq: 0.002, amp: 55, color: 'rgba(99, 102, 241, 0.25)', speedOffset: 0 },       // Indigo-200
    { freq: 0.0035, amp: 35, color: 'rgba(168, 85, 247, 0.22)', speedOffset: 1.5 },    // Purple-200
    { freq: 0.0015, amp: 75, color: 'rgba(45, 212, 191, 0.15)', speedOffset: -1.2 }     // Teal-200
  ];

  waves.forEach((wave, waveIdx) => {
    ctx.beginPath();
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = waveIdx === 0 ? 2 : 1.5;

    // Add glow effect using shadow properties (keep it light to avoid canvas slowing down)
    ctx.shadowBlur = waveIdx === 0 ? 12 : 6;
    ctx.shadowColor = wave.color;

    const centerY = h * (0.4 + waveIdx * 0.15); // distribute vertically

    for (let x = 0; x <= w; x += 8) {
      // 1. Calculate natural wave height
      const rawHeight = calculateWaveHeight(x, time + wave.speedOffset, wave.freq, wave.amp);
      const waveY = centerY + rawHeight;

      // 2. Add mouse warp distortion
      const distortion = calculateMouseDistortion(x, waveY, mouse.value.x, mouse.value.y, 180, 50);
      const finalY = waveY + distortion.dy;

      if (x === 0) {
        ctx.moveTo(x, finalY);
      } else {
        ctx.lineTo(x, finalY);
      }
    }
    ctx.stroke();
  });

  // Reset shadow for next render iteration
  ctx.shadowBlur = 0;

  // Draw a subtle soft mouse light halo
  if (mouse.value.x > 0) {
    const radialGlow = ctx.createRadialGradient(
      mouse.value.x, mouse.value.y, 0,
      mouse.value.x, mouse.value.y, 120
    );
    radialGlow.addColorStop(0, 'rgba(139, 92, 246, 0.04)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(mouse.value.x, mouse.value.y, 120, 0, Math.PI * 2);
    ctx.fill();
  }

  animationFrameId = requestAnimationFrame(draw);
};

onMounted(() => {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
  }

  draw();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousemove', handleMouseMove);
    canvasRef.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 w-full h-full bg-[#0a0a0c] pointer-events-auto z-0 transition-opacity duration-1000"
    :class="{ 'opacity-100': active, 'opacity-40': !active }"
  />
</template>
