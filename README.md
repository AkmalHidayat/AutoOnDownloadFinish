# AutoOnDownloadFinish

An intelligent, lightweight desktop utility for Windows built with Electron and TypeScript that monitors network download throughput in real-time and automatically executes scheduled power actions (Shutdown, Restart, Sleep, or Hibernate) once large downloads finish.

---

## Features

- **Modern Bento Grid & Glassmorphism UI**: High-contrast, clean layout designed with frosted acrylic blur effects, responsive fluid cards, and theme support (Dark, Light, and Windows System auto-sync).
- **Resource Efficient Architecture**:
  - **Eco Saver Mode**: Configurable polling intervals (0.5s, 1.0s, 2.0s) reducing CPU/WMI overhead by up to 70%.
  - **Smart Throttling**: Automatically stops canvas rendering loops when the application window is minimized, hidden, or docked in the system tray.
  - **Page-Aware Lifecycle**: Halts non-essential background drawing tasks when navigating away from the dashboard.
- **Real-Time Bandwidth Visualization**: Live 60-second throughput canvas chart with auto-scaling metrics, peak speed tracking, and session data counters.
- **Configurable Thresholds & Failsafes**:
  - Speed threshold trigger (configurable in MB/s or Mbps).
  - Sustained low-speed confirmation duration before trigger activation.
  - Interactive countdown timer with audio chime and instant abort/cancel button.
  - Initial grace period buffer to allow download startup before monitoring engages.
- **Physical Network Interface Filtering**: Automatically filters out virtual and loopback adapters to monitor true physical traffic (Ethernet, Wi-Fi).
- **Internationalization (i18n)**: Full native localization support for 7 languages:
  - English (Default)
  - Indonesian (Bahasa Indonesia)
  - Japanese (日本語)
  - Simplified Chinese (简体中文)
  - Spanish (Español)
  - Russian (Русский)
  - German (Deutsch)
- **Windows Integration**: System tray minimization, background operation, auto-start on boot option, and native toast notifications.

---

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) (Chromium + Node.js)
- **Build Tool**: [Electron-Vite](https://electron-vite.org/) / Vite
- **Language**: TypeScript
- **Hardware & Network Telemetry**: `systeminformation`
- **UI Engine**: Vanilla HTML5, Modern CSS Glassmorphism, Canvas 2D Rendering

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- Windows 10 / Windows 11 (64-bit)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/AutoOnDownloadFinish.git
   cd AutoOnDownloadFinish
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the application in development mode:
   ```bash
   npm run dev
   ```

---

## Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript and builds production bundles for main, preload, and renderer processes.
- `npm run preview`: Previews the compiled production build locally.
- `npm run package`: Generates standalone Windows NSIS installers and portable executables into the `dist/` directory.

---

## Packaging & Distribution

To generate a production `.exe` installer:
```bash
npm run package
```
The output executable will be placed in the `dist/` folder.

---

## Project Structure

```text
AutoOnDownloadFinish/
├── build/                 # Application icons and packaging assets
│   └── icon.png
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts              # App lifecycle, IPC routing, window management
│   │   ├── network-monitor.ts    # Hardware network traffic telemetry
│   │   ├── power-actions.ts      # Native Windows shutdown/sleep/restart handlers
│   │   ├── store.ts              # Persistent settings and JSON activity logging
│   │   ├── threshold-checker.ts  # Speed threshold evaluation state engine
│   │   └── tray.ts               # Windows system tray menu and interaction
│   ├── preload/           # Context bridge and IPC type definitions
│   │   └── index.ts
│   └── renderer/          # Frontend user interface
│       ├── app.ts                # UI state, canvas chart rendering, i18n
│       ├── index.html            # Bento grid markup
│       └── styles/
│           └── main.css          # Glassmorphism design tokens & styles
├── electron-builder.yml   # Windows packaging configuration
├── electron.vite.config.ts# Vite multi-target build pipeline
├── package.json           # Scripts and dependencies
└── tsconfig.json          # TypeScript compiler configuration
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Credits

Crafted by **Akmal (NexttarSan)**.
