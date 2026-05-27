# razza.dev

Welcome to my personal landing page. It is an interactive, dark-mode single-page website built with Nuxt 3, Tailwind CSS, and a custom programmatic synthesizer using the native Web Audio API.

Live at: [razza.dev](https://razza.dev)

---

## Features and Modes

The site features two main interactive modes. You can toggle between them using the **Space** key, the **G** key, or the mode switcher button in the top right.

### Resonance Mode
This is the default minimalist layout showcasing my background as a Staff Software Engineer at Google NYC and a collection of personal software projects.
* **Vector Waves:** The background renders three overlapping, multi-colored harmonic sine waves.
* **Warp Effect:** Moving the cursor warps and distorts the waves around the pointer using a trigonometric Gaussian displacement formula.
* **Audio Micro-interactions:** Hovering over links, project cards, or buttons triggers real-time, low-pass synth pops and ambient chime hums synthesized programmatically.

### Sandbox Mode
Pressing the toggle activates a physical gravity sandbox where the page elements drop to the bottom of the screen.
* **Interactive Physics:** The profile card, project badges, social links, and interactive toys (orange lacrosse balls and retro cassette tapes) can be dragged and flung around the screen.
* **Elastic Collisions:** Elements bounce off the viewport boundaries and each other with full impulse physics. Collisions trigger programmatic tap or wooden block impact sounds, scaled to the relative velocity of the impact.
* **Interaction Portals:** Two glowing portal goals (GitHub and LinkedIn) sit in the bottom corners. Flinging an item into a portal triggers a warm resonant D-major chord and redirects the user to the corresponding link.
  * *Note: To avoid unsolicited popups, the portal redirection requires an explicit user drag or fling gesture.*

---

## Featured Projects

* **smoc** – A terminal-based, keyboard-driven console music client for Subsonic APIs and YouTube Music, complete with custom audio visualizers.
* **Leiter** – A high-performance, pure C# image processing library featuring fast matrix kernel convolutions and color space conversions.
* **cctv-occupancy** – A local, smart-home automation computer vision pipeline using OpenCV and YOLOv8/ByteTrack motion tripwire crossings.
* **goose-mm-bridge** – An asynchronous Python bridge connecting Goose AI agents to Mattermost threads via Model Context Protocol (MCP) streams.

---

## Technical Architecture

* **Zero Asset Overhead:** Every sound, bounce, icon, and backdrop is synthesized programmatically or drawn dynamically via HTML5 Canvas and the Web Audio API. No external audio files or image assets are loaded.
* **Custom 2D Physics Loop:** Uses a lightweight, impulse-based reflection and collision resolution system coded from scratch in TypeScript, avoiding heavy external physics libraries.
* **Test Coverage:** Over 85% statement coverage and 100% function coverage across sound synthesis, vector mathematics, physics loops, and component lifecycle events.

---

## Setup and Development

### Installation
Install dependencies:
```bash
npm install
```

### Running locally
Start the development server:
```bash
npm run dev
```

### Production Build
Build the application for deployment:
```bash
npm run build
```

### Running Tests
Run the Vitest suite and verify assertions:
```bash
# Run tests
npm run test

# Run tests with HTML coverage report
npm run test:coverage
```

---

## License
Apache-2.0. Created by [Matthew Razza](https://github.com/mrazza).
