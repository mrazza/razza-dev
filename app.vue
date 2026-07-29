<script setup lang="ts">
// Simple, minimalist personal site for Matthew Razza
useHead({
  title: 'Matthew Razza',
  meta: [
    { name: 'description', content: 'Personal website of Matthew Razza, Staff Software Engineer at Google NYC.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-zinc-100 flex flex-col justify-between">
    <!-- Main Content -->
    <main class="max-w-xl mx-auto px-6 pt-24 pb-16 flex-grow flex flex-col justify-center w-full">
      <!-- Intro -->
      <header class="space-y-4 mb-12">
        <h1 class="text-3xl font-semibold tracking-tight text-zinc-100">
          Matthew Razza
        </h1>
        <p class="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Staff Software Engineer @ Google NYC
        </p>
        <p class="text-zinc-400 leading-relaxed text-sm">
          Based in Jersey City, working in adtech and on realtime bidding alongside game engines, network libraries, custom computer vision pipelines, etc.
        </p>
      </header>

      <!-- Projects Section -->
      <section class="space-y-6 mb-12">
        <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-850 pb-2">
          Projects
        </h2>
        <ul class="space-y-6">
          <li>
            <a 
              href="https://github.com/mrazza/coma" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group inline-flex items-center space-x-1 font-medium text-zinc-200 hover:text-zinc-100"
            >
              <span class="border-b border-zinc-800 group-hover:border-zinc-400 transition-colors">coma</span>
              <span class="text-zinc-500 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
            <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              LLM agent architecture written entirely in native Zig, featuring type-safe comptime tool registration and ACP server integration.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/mrazza/smoc" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group inline-flex items-center space-x-1 font-medium text-zinc-200 hover:text-zinc-100"
            >
              <span class="border-b border-zinc-800 group-hover:border-zinc-400 transition-colors">smoc</span>
              <span class="text-zinc-500 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
            <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Keyboard-driven, vim-inspired, terminal audio player streaming Subsonic APIs and YouTube Music.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/mrazza/Leiter" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group inline-flex items-center space-x-1 font-medium text-zinc-200 hover:text-zinc-100"
            >
              <span class="border-b border-zinc-800 group-hover:border-zinc-400 transition-colors">Leiter</span>
              <span class="text-zinc-500 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
            <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              High-performance pure C# image processing library featuring fast matrix kernel convolutions and advanced color space conversions.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/mrazza/cctv-home-occupancy" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group inline-flex items-center space-x-1 font-medium text-zinc-200 hover:text-zinc-100"
            >
              <span class="border-b border-zinc-800 group-hover:border-zinc-400 transition-colors">CCTV Occupancy</span>
              <span class="text-zinc-500 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
            <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Local CPU-optimized computer vision pipeline utilizing OpenCV and YOLOv8/ByteTrack to monitor room state and crossing tripwires.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/mrazza/goose-mm-bridge" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group inline-flex items-center space-x-1 font-medium text-zinc-200 hover:text-zinc-100"
            >
              <span class="border-b border-zinc-800 group-hover:border-zinc-400 transition-colors">goose-mm-bridge</span>
              <span class="text-zinc-500 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
            <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Asynchronous Python bridge connecting Goose AI agents to Mattermost threads using MCP tools for transparent thinking streams.
            </p>
          </li>
        </ul>
      </section>

      <!-- Connections -->
      <section class="space-y-3">
        <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-850 pb-2">
          Connect
        </h2>
        <div class="flex items-center space-x-4 text-xs font-mono">
          <a 
            href="https://github.com/mrazza" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            GitHub
          </a>
          <span class="text-zinc-700">/</span>
          <a 
            href="https://linkedin.com/in/mrazza" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="max-w-xl mx-auto px-6 py-8 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] font-mono text-zinc-600 border-t border-zinc-900/60">
      <span>© {{ new Date().getFullYear() }} Matthew Razza</span>
      <span class="italic max-w-xs sm:text-right text-zinc-700">
        This site is simple because I've had enough of the crazy Gemini/Claude/GPT-generated dev sites.
      </span>
    </footer>
  </div>
</template>

<style>
body {
  background-color: #0a0a0a;
}
.border-zinc-850 {
  border-color: rgba(63, 63, 70, 0.4);
}
</style>
