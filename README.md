# razza.dev 🎛️

Welcome to my personal landing page. It is a highly interactive, dark-mode single page built with **Nuxt 3**, **Tailwind CSS**, and a custom programmatic synthesizer using the native browser **Web Audio API**.

Live at: [razza.dev](https://razza.dev)

---

## 🌟 The Experience: Two Interactive Modes

The site features two distinct, responsive backdrops and interactive structures that can be toggled using **Space**, the **G** key, or the mode-switcher button in the top right.

### Mode A: Resonance 🌌
* **The Atmosphere:** A minimalist dark-mode layout showcasing my background as a **Staff Software Engineer at Google NYC** based in **Jersey City**, along with my selected personal software projects.
* **Undulating Vector Waves:** The background renders three overlapping, multi-colored harmonic sine waves.
* **Mouse Reactive Warp:** Moving your cursor warps and distorts the waves around your pointer using a trigonometric Gaussian displacement formula.
* **Micro-interaction Chimes:** Hovering over links, project cards, or action buttons triggers real-time, low-pass synth pops and ambient chime hums synthesized programmatically by the browser.

### Mode B: Sandbox 🕹️
* **Physical Gravity Sandbox:** When activated, gravity takes over! The entire site falls to the bottom of your screen.
* **draggable & Flingable Blocks:** Your profile card, project badges, social quicklinks, and interactive physics toys (**橘色 Lacrosse balls** and **Retro cassette tapes**) can be grabbed, dragged, and flung around the screen.
* **Programmatic Impact Soundboard:** Items bounce off the viewport boundaries and each other with full elastic impulse physics. Collisions trigger programmatic tap or wooden block impact sounds synthesized on-the-fly, scaled precisely to their relative collision velocity.
* **Interaction Portals:** Two glowing portal goals (**GitHub Portal** and **LinkedIn Portal**) sit in the bottom corners. Flinging a project badge or social link card into a portal triggers a warm resonant D-major chord and securely redirects the user to the corresponding link.
  * *Note: Portals feature a User-Gesture Gate—they will suck elements in under gravity, but only open tabs when initiated by your explicit drag or fling gesture.*

---

## 🛠️ Selected Engineering Projects

* **smoc 🎧** - A terminal-based, keyboard-driven console music client for streaming services (Subsonic APIs & YouTube Music) built with custom audio visualizers.
* **Leiter ☄** - A high-performance, pure C# image processing library featuring fast matrix kernel convolutions and advanced color space conversions.
* **cctv-occupancy 👁** - A local, smart-home automation computer vision pipeline using OpenCV and YOLOv8/ByteTrack motion tripwire crossings.
* **goose-mm-bridge 🔢** - An asynchronous Python bridge connecting Goose AI agents to Mattermost threads via Model Context Protocol (MCP) transparent streams.

---

## 🚀 Technical Highlights & Architecture

* **Zero Asset Overhead:** Every single audio tone, bounce sound, brand icon, and wave backdrop is synthesized programmatically or drawn using HTML5 Canvas + Web Audio API. 
* **Custom 2D Physics Loop:** Uses a custom, ultra-lightweight, 100% testable 2D collision resolution and impulse-based reflection system coded entirely from scratch in TypeScript (no heavy external physics engines).
* **Fully Tested:** Over 85% statement coverage and 100% function coverage across sound synthesis, vector mathematics, physics loops, and component lifecycle events.

---

## 🛠️ Setup & Development

### Installation
Make sure to install the project dependencies:
```bash
npm install
```

### Running locally
Start the development server on `http://localhost:3000`:
```bash
npm run dev
```

### Build & Production
Build the application for deployment (SSR/SPA compatible):
```bash
npm run build
```

### Run Automated Tests & Coverage
Run the Vitest suite and verify assertions:
```bash
# Run tests once
npm run test

# Run tests and output full code coverage HTML report
npm run test:coverage
```

---

## 📜 License
Apache-2.0. Created by [Matthew Razza](https://github.com/mrazza).
