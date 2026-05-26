<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, markRaw } from 'vue';
import { AudioSynth } from './utils/synth';

// Custom SVG Icons to avoid ANY Lucide SSR / hydration mismatch or client-side mounting runtime crashes!
const GithubIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' }),
  h('path', { d: 'M9 18c-4.51 2-5-2-7-2' })
]);

const LinkedinIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }),
  h('rect', { width: '4', height: '12', x: '2', y: '9' }),
  h('circle', { cx: '4', cy: '4', r: '2' })
]);

const Volume2Icon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('polygon', { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }),
  h('path', { d: 'M15.54 8.46a5 5 0 0 1 0 7.07' }),
  h('path', { d: 'M19.07 4.93a10 10 0 0 1 0 14.14' })
]);

const VolumeXIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('polygon', { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }),
  h('line', { x1: '22', y1: '9', x2: '16', y2: '15' }),
  h('line', { x1: '16', y1: '9', x2: '22', y2: '15' })
]);

const SparklesIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('path', { d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' }),
  h('path', { d: 'm5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z' }),
  h('path', { d: 'm19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z' })
]);

const FlameIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('path', { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' })
]);

const TerminalIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('polyline', { points: '4 17 10 11 4 5' }),
  h('line', { x1: '12', y1: '19', x2: '20', y2: '19' })
]);

const CodeIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('polyline', { points: '16 18 22 12 16 6' }),
  h('polyline', { points: '8 6 2 12 8 18' })
]);

const EyeIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('path', { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }),
  h('circle', { cx: '12', cy: '12', r: '3' })
]);

const TrendingUpIcon = (props: any) => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  ...props
}, [
  h('polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
  h('polyline', { points: '16 7 22 7 22 13' })
]);

// State
const mode = ref<'resonance' | 'sandbox'>('resonance');
const mute = ref(false);
const synth = new AudioSynth();
const activeProject = ref<string | null>(null);

const projects = [
  {
    id: 'smoc',
    title: 'smoc',
    subtitle: 'Console Audio Client',
    description: 'Beautiful, keyboard-driven music player streaming Subsonic APIs & YouTube Music to your terminal, complete with custom audio drivers.',
    icon: markRaw(TerminalIcon),
    url: 'https://github.com/mrazza/smoc',
    color: 'from-amber-500/10 to-orange-500/20 text-orange-400'
  },
  {
    id: 'leiter',
    title: 'Leiter',
    subtitle: 'Image Processing Library',
    description: 'A modern, high-performance, self-contained pure C# image processing library featuring fast matrix kernel convolutions and advanced color space conversions.',
    icon: markRaw(SparklesIcon),
    url: 'https://github.com/mrazza/Leiter',
    color: 'from-indigo-500/10 to-purple-500/20 text-indigo-400'
  },
  {
    id: 'cctv',
    title: 'CCTV Occupancy',
    subtitle: 'Smart Home Presence Tracker',
    description: 'A local, CPU-optimized computer vision pipeline utilizing OpenCV and YOLOv8/ByteTrack to monitor room state and crossing tripwires.',
    icon: markRaw(EyeIcon),
    url: 'https://github.com/mrazza/cctv-home-occupancy',
    color: 'from-emerald-500/10 to-teal-500/20 text-teal-400'
  },
  {
    id: 'goose-mm-bridge',
    title: 'goose-mm-bridge',
    subtitle: 'Mattermost Agent Bridge',
    description: 'An asynchronous Python bridge connecting Goose AI agents to Mattermost threads, utilizing MCP tools for transparent thinking streams.',
    icon: markRaw(CodeIcon),
    url: 'https://github.com/mrazza/goose-mm-bridge',
    color: 'from-blue-500/10 to-sky-500/20 text-sky-400'
  }
];

const toggleMode = () => {
  synth.resume();
  mode.value = mode.value === 'resonance' ? 'sandbox' : 'resonance';
  
  if (!mute.value) {
    if (mode.value === 'sandbox') {
      synth.playChord(146.83, 'suspended', 2.2);
    } else {
      synth.playChord(220, 'major', 1.8);
    }
  }
};

const toggleMute = () => {
  mute.value = !mute.value;
  synth.toggleMute();
  if (!mute.value) {
    synth.playTick();
  }
};

const triggerHover = () => {
  if (!mute.value) {
    synth.playTick();
  }
};

const triggerProjectClick = (url: string) => {
  if (!mute.value) {
    synth.playChord(220, 'resonant', 1.0);
  }
  window.open(url, '_blank', 'noopener,noreferrer');
};

const handleOpenLinkFromSandbox = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  if (key === ' ' || key === 'g') {
    e.preventDefault();
    toggleMode();
  } else if (key === 'm') {
    toggleMute();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  setTimeout(() => {
    if (!mute.value) {
      synth.playDrone(110, 4.5);
    }
  }, 1000);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="relative w-full min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
    <!-- Active Backdrops -->
    <ResonantBackground :active="mode === 'resonance'" />
    <TactilePhysicsSandbox 
      v-if="mode === 'sandbox'" 
      :active="mode === 'sandbox'" 
      :mute="mute" 
      @open-link="handleOpenLinkFromSandbox" 
    />

    <!-- Header & Controls (ALWAYS VISIBLE & clickable) -->
    <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      <!-- Logo -->
      <div class="flex items-center space-x-3 pointer-events-auto group">
        <div class="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold tracking-tight shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
          R
          <div class="absolute inset-0 rounded-lg bg-indigo-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold tracking-wide uppercase font-mono bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">razza.dev</span>
          <span class="text-[10px] text-gray-500 font-mono">matthew razza</span>
        </div>
      </div>

      <!-- Settings Block -->
      <div class="flex items-center space-x-3 pointer-events-auto">
        <!-- Audio Mute Button -->
        <button 
          @click="toggleMute"
          @mouseenter="triggerHover"
          class="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200 text-gray-400 hover:text-white"
          :title="mute ? 'Unmute Audio (M)' : 'Mute Audio (M)'"
        >
          <VolumeXIcon v-if="mute" class="w-4 h-4" />
          <Volume2Icon v-else class="w-4 h-4" />
        </button>

        <!-- Dynamic Mode Switcher -->
        <button 
          @click="toggleMode"
          @mouseenter="triggerHover"
          class="flex items-center space-x-2 px-4 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200"
          :title="'Switch Mode (Space)'"
        >
          <span class="text-[11px] font-mono tracking-widest text-gray-400 uppercase hidden sm:inline">Mode:</span>
          <span class="text-xs font-semibold font-mono tracking-wide flex items-center space-x-1.5" :class="mode === 'resonance' ? 'text-indigo-400' : 'text-orange-400'">
            <SparklesIcon v-if="mode === 'resonance'" class="w-3.5 h-3.5 animate-pulse" />
            <FlameIcon v-else class="w-3.5 h-3.5 animate-bounce" />
            <span>{{ mode === 'resonance' ? 'Resonance' : 'Sandbox' }}</span>
          </span>
        </button>
      </div>
    </header>

    <!-- UI Overlay for Mode: RESONANCE -->
    <main 
      v-if="mode === 'resonance'"
      class="relative min-h-screen z-20 flex flex-col items-center justify-center px-6 py-24 select-none pointer-events-none transition-all duration-700 opacity-100 translate-y-0"
    >
      <div class="max-w-4xl w-full flex flex-col items-center space-y-16 pointer-events-auto">
        
        <!-- Hero Section -->
        <div class="text-center space-y-6">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-300 font-mono">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>Bridging Terminals, Interfaces, and the Real World</span>
          </div>
          
          <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent pb-1">
            Matthew Razza
          </h1>
          
          <div class="max-w-xl mx-auto space-y-3">
            <p class="text-base sm:text-lg text-indigo-300 font-medium">
              Staff Software Engineer @ <span class="text-white font-semibold">Google NYC</span>
            </p>
            <p class="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
              Based in <span class="text-white">Jersey City</span>, working in <span class="text-white">adtech</span> and <span class="text-white">realtime bidding</span> alongside <span class="text-white">game engines</span>, <span class="text-white">network libraries</span>, and custom <span class="text-white">computer vision pipelines</span>.
            </p>
          </div>

          <!-- External Quicklinks -->
          <div class="flex items-center justify-center space-x-4 pt-2">
            <a 
              href="https://github.com/mrazza" 
              target="_blank" 
              rel="noopener"
              @mouseenter="triggerHover"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 active:scale-95 transition-all duration-200 text-sm text-gray-300 hover:text-white"
            >
              <GithubIcon class="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://linkedin.com/in/mrazza" 
              target="_blank" 
              rel="noopener"
              @mouseenter="triggerHover"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 active:scale-95 transition-all duration-200 text-sm text-gray-300 hover:text-white"
            >
              <LinkedinIcon class="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        <!-- Featured Projects Grid -->
        <div class="w-full space-y-6">
          <div class="flex items-center space-x-3 border-b border-white/5 pb-2">
            <h2 class="text-xs font-mono tracking-widest text-gray-400 uppercase">Selected Engineering</h2>
            <div class="flex-grow h-[1px] bg-white/5"></div>
            <span class="text-[10px] text-gray-600 font-mono">[interactive chimes enabled]</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="project in projects" 
              :key="project.id"
              @mouseenter="() => { triggerHover(); activeProject = project.id; }"
              @mouseleave="activeProject = null"
              @click="triggerProjectClick(project.url)"
              class="group relative p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm cursor-pointer hover:border-white/15 transition-all duration-300 overflow-hidden flex flex-col justify-between h-[160px]"
            >
              <!-- Glowing dynamic background block on hover -->
              <div 
                class="absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
                :class="project.color"
              ></div>

              <!-- Project Header -->
              <div class="relative z-10 flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors duration-200 flex items-center space-x-2">
                    <span>{{ project.title }}</span>
                  </h3>
                  <p class="text-[11px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">{{ project.subtitle }}</p>
                </div>
                <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors duration-200">
                  <component :is="project.icon" class="w-4 h-4" />
                </div>
              </div>

              <!-- Project Description -->
              <p class="relative z-10 text-xs text-gray-400 leading-relaxed line-clamp-2 mt-3 group-hover:text-gray-300 transition-colors duration-200">
                {{ project.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer / Shortcuts Guide -->
        <div class="text-[10px] text-gray-500 font-mono text-center flex items-center justify-center space-x-4 border-t border-white/5 pt-8 w-full max-w-sm">
          <span>[Space / G] toggle gravity sandbox</span>
          <span class="text-gray-700">•</span>
          <span>[M] mute chimes</span>
        </div>

      </div>
    </main>

    <!-- UI Overlay for Mode: SANDBOX -->
    <main 
      v-else
      class="relative min-h-screen z-30 select-none pointer-events-none flex flex-col justify-between p-6 transition-all duration-700 opacity-100 translate-y-0"
    >
      <!-- Top instructions header -->
      <div class="w-full flex justify-center pt-20">
        <div class="flex items-center space-x-3 px-4 py-2.5 rounded-full border border-orange-500/20 bg-orange-950/20 backdrop-blur-md text-xs text-orange-300 font-mono shadow-lg shadow-orange-950/20 animate-pulse pointer-events-auto">
          <FlameIcon class="w-3.5 h-3.5" />
          <span>Interactive Sandbox: Drag and fling components & toys into portals!</span>
        </div>
      </div>

      <!-- Bottom instruction guides -->
      <div class="w-full flex items-center justify-between font-mono text-[10px] text-gray-500 pointer-events-auto bg-black/20 backdrop-blur-sm border border-white/5 px-4 py-2 rounded-xl max-w-xl mx-auto mb-4">
        <div class="flex items-center space-x-1.5 text-orange-400">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
          <span>Throw items into Portals to open links!</span>
        </div>
        <div class="flex items-center space-x-4">
          <span>[Space] back to tranquility</span>
          <span class="text-gray-700">•</span>
          <span>Physics: 2D custom Canvas Loop</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Smooth glassmorphic transitions & glow shadows */
body {
  background-color: #0a0a0c;
}
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>