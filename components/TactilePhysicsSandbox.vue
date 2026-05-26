<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { PhysicsWorld, type PhysicsBody } from '../utils/physics';
import { AudioSynth } from '../utils/synth';

const props = defineProps<{
  active: boolean;
  mute: boolean;
}>();

const emit = defineEmits<{
  (e: 'open-link', url: string): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const synth = new AudioSynth();
let world: PhysicsWorld;
let animationFrameId: number;

// We preserve a list of link open timers to avoid spawning hundreds of tabs
const openedUrls = new Set<string>();

// Interaction Portal Zones (e.g. "Throw items here to open links")
interface InteractivePortal {
  id: string;
  label: string;
  url: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  pulse: number;
}

const portals = ref<InteractivePortal[]>([]);
const lastError = ref<string | null>(null);
const debugInfo = ref<string>('');

const initializePhysics = () => {
  const canvas = canvasRef.value;
  if (!canvas) {
    console.warn('[razza-dev] initializePhysics called but canvas is null');
    return;
  }

  const w = window.innerWidth || 800;
  const h = window.innerHeight || 600;
  canvas.width = w;
  canvas.height = h;

  console.log(`[razza-dev] Initializing physics world with canvas size: ${w}x${h}`);

  // Set up world
  world = new PhysicsWorld(w, h);
  world.gravityY = 0.55; // satisfying downward gravity
  world.friction = 0.985; // slight drag

  // Position Portal Goals on left and right walls or bottom
  portals.value = [
    {
      id: 'github-portal',
      label: 'GitHub Portal',
      url: 'https://github.com/mrazza',
      x: w * 0.15,
      y: h * 0.82,
      radius: 65,
      color: 'rgba(99, 102, 241, 0.45)', // Indigo
      pulse: 0
    },
    {
      id: 'linkedin-portal',
      label: 'LinkedIn Portal',
      url: 'https://linkedin.com/in/mrazza',
      x: w * 0.85,
      y: h * 0.82,
      radius: 65,
      color: 'rgba(59, 130, 246, 0.45)', // Blue
      pulse: 0
    }
  ];

  // 1. Add Social & Profile Cards (Rectangles)
  world.addBody({
    id: 'profile-card',
    type: 'rectangle',
    x: w * 0.5,
    y: h * 0.2,
    vx: 0,
    vy: 0,
    mass: 12,
    width: 260,
    height: 100,
    restitution: 0.45,
    label: 'profile'
  });

  world.addBody({
    id: 'github-card',
    type: 'rectangle',
    x: w * 0.35,
    y: h * 0.35,
    vx: -4,
    vy: 2,
    mass: 5,
    width: 140,
    height: 55,
    restitution: 0.6,
    label: 'link-github'
  });

  world.addBody({
    id: 'linkedin-card',
    type: 'rectangle',
    x: w * 0.65,
    y: h * 0.35,
    vx: 4,
    vy: 2,
    mass: 5,
    width: 140,
    height: 55,
    restitution: 0.6,
    label: 'link-linkedin'
  });

  // 2. Add Project Cards
  const projectCards = [
    { id: 'proj-smoc', label: 'smoc client', x: w * 0.25 },
    { id: 'proj-celestial', label: 'CelestialEngine', x: w * 0.45 },
    { id: 'proj-cctv', label: 'cctv tracker', x: w * 0.65 },
    { id: 'proj-bitmapnet', label: 'BitmapNet', x: w * 0.8 }
  ];

  projectCards.forEach((p, idx) => {
    world.addBody({
      id: p.id,
      type: 'rectangle',
      x: p.x,
      y: h * 0.5 + idx * 10,
      vx: (Math.random() - 0.5) * 6,
      vy: -2,
      mass: 6,
      width: 155,
      height: 60,
      restitution: 0.5,
      label: p.id
    });
  });

  // 3. Add Playable Physics Toys (Lacrosse Balls)
  for (let i = 0; i < 4; i++) {
    world.addBody({
      id: `lax-ball-${i}`,
      type: 'circle',
      x: w * 0.2 + i * (w * 0.18),
      y: h * 0.1 + (Math.random() * 50),
      vx: (Math.random() - 0.5) * 8,
      vy: 1,
      mass: 3,
      radius: 18,
      restitution: 0.85, // extremely bouncy
      label: 'lax-ball'
    });
  }

  // 4. Add Playable Cassette Tapes (for smoc)
  for (let i = 0; i < 2; i++) {
    world.addBody({
      id: `cassette-${i}`,
      type: 'rectangle',
      x: w * 0.4 + i * 150,
      y: h * 0.15,
      vx: (Math.random() - 0.5) * 4,
      vy: 2,
      mass: 4,
      width: 60,
      height: 38,
      restitution: 0.55,
      label: 'cassette'
    });
  }
};

const handlePointerDown = (e: PointerEvent) => {
  if (!props.active || !canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Set up synth on user interaction
  synth.resume();

  const dragged = world.startDrag(x, y);
  if (dragged) {
    (dragged as any).wasDragged = true; // Mark that user explicitly interacted with this item
    if (!props.mute) synth.playTick();
    canvasRef.value.setPointerCapture(e.pointerId);
  }
};

const handlePointerMove = (e: PointerEvent) => {
  if (!props.active || !canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  world.updateDrag(x, y);
};

const handlePointerUp = (e: PointerEvent) => {
  if (!props.active || !canvasRef.value) return;
  world.endDrag();
  try {
    canvasRef.value.releasePointerCapture(e.pointerId);
  } catch (err) {}
};

// Physics Simulation & Render Cycle
const renderLoop = () => {
  if (!canvasRef.value) {
    animationFrameId = requestAnimationFrame(renderLoop);
    return;
  }
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) {
    animationFrameId = requestAnimationFrame(renderLoop);
    return;
  }

  const w = canvasRef.value.width;
  const h = canvasRef.value.height;

  // Clear Canvas cleanly
  ctx.clearRect(0, 0, w, h);

  if (!props.active) {
    animationFrameId = requestAnimationFrame(renderLoop);
    return;
  }

  // Self-heal: if world is not initialized or contains no bodies, re-initialize it
  if (!world || world.bodies.length === 0) {
    console.log('[razza-dev] Self-healing: initializing or repopulating physics world...');
    initializePhysics();
    if (!world || world.bodies.length === 0) {
      animationFrameId = requestAnimationFrame(renderLoop);
      return;
    }
  }

  // 1. Advance Physics Engine
  let collisions = [];
  try {
    if (!world) {
      debugInfo.value = 'No world initialized';
    } else {
      collisions = world.step();
      debugInfo.value = `World running: ${world.bodies.length} bodies, canvas: ${w}x${h}`;
    }
  } catch (err: any) {
    console.error('[razza-dev] Error during physics step:', err);
    lastError.value = 'Step error: ' + (err?.message || err);
    animationFrameId = requestAnimationFrame(renderLoop);
    return;
  }

  // 2. Play programmatic collision sounds
  if (!props.mute) {
    collisions.forEach(col => {
      // Scale intensity based on impact relative velocity
      if (col.intensity > 1.2) {
        // Customize chime sound based on what hit what
        if (col.bodyA.label === 'lax-ball' || col.bodyB.label === 'lax-ball') {
          // Bouncy lacrosse ball high pitch clink
          synth.playImpact(col.intensity * 1.5);
        } else if (col.bodyA.label === 'cassette' || col.bodyB.label === 'cassette') {
          // cassette woody block tap
          synth.playImpact(col.intensity * 0.9);
        } else {
          // standard resonating body hit
          synth.playImpact(col.intensity * 0.65);
        }
      }
    });
  }

  // 3. Render Interaction Goals (Portal Gates)
  portals.value.forEach(portal => {
    portal.pulse += 0.04;
    const pulseRadius = portal.radius + Math.sin(portal.pulse) * 4;

    // Draw glowing backfield halo
    const glowGradient = ctx.createRadialGradient(
      portal.x, portal.y, 0,
      portal.x, portal.y, pulseRadius * 1.4
    );
    glowGradient.addColorStop(0, portal.color);
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(portal.x, portal.y, pulseRadius * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Draw dash border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(portal.x, portal.y, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Text Label in Portal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(portal.label, portal.x, portal.y - 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillText('[Throw item here]', portal.x, portal.y + 12);
  });

  // 4. Check Portal Gate Goals
  world.bodies.forEach(body => {
    // We only trigger portals for relevant interactive elements
    const isInteractive = 
      body.label.startsWith('link-') || 
      body.label.startsWith('proj-') || 
      body.label === 'profile' || 
      body.label === 'lax-ball';

    if (!isInteractive) return;

    portals.value.forEach(portal => {
      const dx = body.x - portal.x;
      const dy = body.y - portal.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < portal.radius + 15) {
        // Object entered the portal!
        let targetUrl = portal.url;
        
        // Context-aware redirects:
        // If they throw the "smoc" project card into any portal, open smoc GitHub
        if (body.label === 'proj-smoc') {
          targetUrl = 'https://github.com/mrazza/smoc';
        } else if (body.label === 'proj-celestial') {
          targetUrl = 'https://github.com/mrazza/CelestialEngine';
        } else if (body.label === 'proj-cctv') {
          targetUrl = 'https://github.com/mrazza/cctv-home-occupancy';
        } else if (body.label === 'proj-bitmapnet') {
          targetUrl = 'https://github.com/mrazza/BitmapNet';
        } else if (body.label === 'link-github') {
          targetUrl = 'https://github.com/mrazza';
        } else if (body.label === 'link-linkedin') {
          targetUrl = 'https://linkedin.com/in/mrazza';
        }

        // ONLY open link if the user has explicitly dragged/flung this item!
        if ((body as any).wasDragged) {
          // Only open link once per portal-entry event to avoid browser popup blocks
          if (!openedUrls.has(targetUrl)) {
            openedUrls.add(targetUrl);
            
            if (!props.mute) {
              synth.playChord(293.66, 'resonant', 2.0); // Play glowing D Major / resonant chord
            }

            emit('open-link', targetUrl);

            // Allow reopening after 3 seconds
            setTimeout(() => {
              openedUrls.delete(targetUrl);
            }, 3000);
          }
        }

        // Apply visual portal gravitational pull: suck item into center & blast outward!
        body.vx = (portal.x - body.x) * 0.15;
        body.vy = (portal.y - body.y) * 0.15;
      }
    });
  });

  // 5. Draw Physical Bodies
  try {
    world.bodies.forEach(body => {
    const isDragged = body.id === world.getDraggedBodyId();

    ctx.save();
    ctx.translate(body.x, body.y);

    if (body.type === 'circle' && body.radius) {
      // Render Lacrosse Ball
      const rad = body.radius;
      
      // Shadow glow
      ctx.shadowBlur = isDragged ? 15 : 6;
      ctx.shadowColor = 'rgba(249, 115, 22, 0.6)'; // bright orange

      // Ball base gradient
      const ballGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, rad);
      ballGrad.addColorStop(0, '#ffedd5'); // orange-100
      ballGrad.addColorStop(0.3, '#f97316'); // orange-500
      ballGrad.addColorStop(1, '#7c2d12'); // orange-900

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();

      // Ball seam curves (making it look like an authentic Lacrosse ball)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Draw arc on left side
      ctx.arc(-rad * 0.65, 0, rad * 0.65, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      // Draw arc on right side
      ctx.arc(rad * 0.65, 0, rad * 0.65, Math.PI * 0.6, -Math.PI * 0.6);
      ctx.stroke();

    } else if (body.type === 'rectangle' && body.width && body.height) {
      const wRect = body.width;
      const hRect = body.height;

      // Card container shadow glow
      ctx.shadowBlur = isDragged ? 20 : 8;
      ctx.shadowColor = body.label.startsWith('link-') 
        ? 'rgba(59, 130, 246, 0.45)' 
        : 'rgba(255, 255, 255, 0.15)';

      // Card base gradient (glassmorphic dark metallic)
      const cardGrad = ctx.createLinearGradient(-wRect / 2, -hRect / 2, wRect / 2, hRect / 2);
      cardGrad.addColorStop(0, 'rgba(30, 30, 36, 0.95)');
      cardGrad.addColorStop(1, 'rgba(15, 15, 18, 0.98)');
      ctx.fillStyle = cardGrad;

      // Draw rounded rectangle with modern & legacy browser fallback
      const radius = 8;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-wRect / 2, -hRect / 2, wRect, hRect, radius);
      } else {
        const x = -wRect / 2;
        const y = -hRect / 2;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + wRect - radius, y);
        ctx.quadraticCurveTo(x + wRect, y, x + wRect, y + radius);
        ctx.lineTo(x + wRect, y + hRect - radius);
        ctx.quadraticCurveTo(x + wRect, y + hRect, x + wRect - radius, y + hRect);
        ctx.lineTo(x + radius, y + hRect);
        ctx.quadraticCurveTo(x, y + hRect, x, y + hRect - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
      }
      ctx.fill();

      // Border highlight (bright metallic glow)
      ctx.strokeStyle = isDragged 
        ? 'rgba(99, 102, 241, 0.6)' 
        : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isDragged ? 2 : 1;
      ctx.stroke();

      ctx.shadowBlur = 0; // reset

      // Content-specific text & badges
      if (body.label === 'profile') {
        // Title / Profile Card
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Matthew Razza', 0, -18);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '11px ui-monospace, monospace';
        ctx.fillText('@razza', 0, 2);

        ctx.fillStyle = 'rgba(168, 85, 247, 0.9)'; // Purple
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillText('✦ Interactive Sandbox ✦', 0, 22);

      } else if (body.label === 'link-github') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GitHub ↗', 0, 0);

      } else if (body.label === 'link-linkedin') {
        ctx.fillStyle = '#3b82f6'; // Blue text
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LinkedIn ↗', 0, 0);

      } else if (body.label === 'cassette') {
        // Draw Cassette Tape Details!
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(-wRect / 2 + 5, -hRect / 2 + 5, wRect - 10, hRect - 10);
        ctx.strokeStyle = '#f59e0b'; // amber color cassette lines
        ctx.lineWidth = 1;
        ctx.strokeRect(-wRect / 2 + 8, -hRect / 2 + 8, wRect - 16, hRect - 16);

        // Cassette spools (rotate based on velocity/time)
        const spoolRot = Date.now() * 0.003 * Math.sqrt(body.vx * body.vx + body.vy * body.vy + 0.1);
        
        ctx.fillStyle = '#4b5563';
        // Left Spool
        ctx.save();
        ctx.translate(-14, 0);
        ctx.rotate(spoolRot);
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
        ctx.restore();

        // Right Spool
        ctx.save();
        ctx.translate(14, 0);
        ctx.rotate(-spoolRot);
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
        ctx.restore();

        // Label Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '7px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('smoc.cassette', 0, -11);

      } else {
        // General project/custom cards
        const labelText = 
          body.label === 'proj-smoc' ? 'smoc 🎧' :
          body.label === 'proj-celestial' ? 'CelestialEngine ☄' :
          body.label === 'proj-cctv' ? 'cctv-occupancy 👁' :
          body.label === 'proj-bitmapnet' ? 'BitmapNet 🔢' : body.label;

        ctx.fillStyle = '#f3f4f6';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, 0, -8);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '9px ui-monospace, monospace';
        ctx.fillText('[drag & fling]', 0, 11);
      }
    }

    ctx.restore();
    });
  } catch (drawErr: any) {
    console.error('[razza-dev] Error during draw:', drawErr);
    lastError.value = 'Draw error: ' + (drawErr?.message || drawErr);
  }

  // Draw debug overlay on canvas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(debugInfo.value, 10, h - 20);
  if (lastError.value) {
    ctx.fillStyle = '#ef4444';
    ctx.fillText(lastError.value, 10, h - 35);
  }

  animationFrameId = requestAnimationFrame(renderLoop);
};

// Handle window resizing
const handleResize = () => {
  if (!canvasRef.value) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvasRef.value.width = w;
  canvasRef.value.height = h;
  if (world) {
    world.resize(w, h);
  }
};

watch(() => props.active, (newActive) => {
  if (newActive) {
    // Lazy-init on transition to active state
    initializePhysics();
  } else {
    if (world) world.clear();
  }
});

onMounted(() => {
  if (props.active) {
    initializePhysics();
  }
  window.addEventListener('resize', handleResize);
  renderLoop();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
  if (world) world.clear();
});
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 w-full h-full pointer-events-auto touch-none z-10 select-none bg-[#0a0a0c]/60"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
  />
</template>