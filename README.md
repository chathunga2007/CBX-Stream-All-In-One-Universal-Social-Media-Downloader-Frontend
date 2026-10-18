# ⚡ CBX-Stream Universal Social Media Downloader — Frontend

> **State-of-the-Art, Glassmorphic Web Client for Universal Social Media Archiving & Streaming**  
> Architected by **Chathunga Bimsara** (Institute of Software Engineering - IJSE).  
> Designed to integrate 100% seamlessly with `CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Backend`.

---

## 🌟 Visual & Architectural Highlights

- **Chameleon Glass UI Engine**:
  - Dynamically extracts and shifts CSS custom properties (`--cbx-primary`, `--cbx-secondary`, `--cbx-glow`, `--cbx-gradient`) in real-time as users type or analyze YouTube (Red), TikTok (Cyan/Pink), Instagram (Magenta/Orange), Twitter/X (Sky Blue), Reddit (Orange), Spotify (Emerald), Twitch (Purple), and 1,000+ streaming sites.
- **Deep Obsidian Backdrop & Aurora Mesh Blobs**:
  - High-performance GPU-accelerated animated aurora blobs float seamlessly behind a 20px frosted glass aesthetic.
- **Media Bento Grid Dashboard**:
  - Left Column: Proxied HD/4K preview, uploader handle, duration, view count, like count, and one-click metadata copier.
  - Right Column (4 Action Tabs):
    1. **Video Streams**: 4K Ultra HD, 2K, 1080p, 720p profiles with DASH audio merging indicators and custom filenames.
    2. **Studio Audio Transcoder**: 320kbps MP3, 192kbps MP3, M4A, Lossless WAV with ID3v2 tag and cover art embedding.
    3. **Precision Keyframe Clipper**: Sub-second start/end timestamp trimmer for MP4 clips or extracted MP3 audio.
    4. **Carousel & Gallery Bundler**: Multi-photo/video slide selector with instant ZIP package compiler.
- **Live WebSocket Telemetry**:
  - Connects to `/ws/progress/{task_id}` for 60fps liquid glass progress bars, download speed (MB/s), downloaded bytes, and ETA.
- **Slide-Over Download Queue Drawer**:
  - Manages active download threads and persistent completed history with subtle celebratory confetti (`canvas-confetti`).
- **Batch / Playlist Mode**:
  - Concurrently analyzes up to 50 URLs or entire playlists with multi-select queueing.
- **Architect Spotlight Modal**:
  - Interactive profile highlighting **Chathunga Bimsara**, IJSE background, technical skills, and social links.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS (Obsidian & Chameleon palettes) + PostCSS + Autoprefixer
- **Motion & Transitions**: Framer Motion
- **Icons**: Lucide React
- **Network**: Axios + Native WebSockets
- **Feedback**: Canvas Confetti
- **Class Merging**: clsx + tailwind-merge

---

## 📁 Directory Structure

```text
CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Frontend/
├── public/
│   └── favicon.svg                  # Holographic CBX neon shield favicon
├── src/
│   ├── main.tsx                     # React 18 root entry point
│   ├── App.tsx                      # Master app orchestrator
│   ├── index.css                    # Frosted glass utilities & dynamic variables
│   ├── types/
│   │   └── media.ts                 # TypeScript schemas matching FastAPI Backend 1:1
│   ├── config/
│   │   ├── env.ts                   # API, WebSocket, and Reverse Proxy URL resolvers
│   │   ├── platforms.ts             # Instant client-side platform & color theme detector
│   │   └── creator.ts               # Official developer bio for Chathunga Bimsara
│   ├── services/
│   │   ├── api.ts                   # Axios service for analyze, batch, download, trim, ZIP, health
│   │   └── ws.ts                    # Resilient WebSocket progress listener with keepalive ping
│   ├── hooks/
│   │   ├── useChameleonTheme.ts     # Dynamic CSS variable injector
│   │   ├── useDownloadManager.ts    # Download state, WebSocket hooks, localStorage & confetti
│   │   └── useClipboardDetect.ts    # One-click smart clipboard URL detector
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AmbientBackground.tsx# Deep obsidian canvas with animated Chameleon Aurora
│   │   │   ├── Navbar.tsx           # Glass header with live FastAPI health check pill
│   │   │   └── Footer.tsx           # Credits to Chathunga Bimsara & IJSE credentials
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx      # Animated typography & interactive platform pills
│   │   │   └── SpotlightCommandBar.tsx # Frosted glass URL input bar with Smart Paste
│   │   ├── media/
│   │   │   ├── MediaBentoDashboard.tsx # Bento layout coordinating preview & action tabs
│   │   │   ├── MediaPreviewCard.tsx # Proxied HD thumbnail, uploader & stats
│   │   │   ├── VideoFormatsTab.tsx  # 4K/2K/1080p/720p/480p quality selector cards
│   │   │   ├── AudioFormatsTab.tsx  # Studio 320kbps MP3 + ID3 cover art embedder
│   │   │   ├── VideoTrimmerTab.tsx  # Precision start/end timestamp clipper
│   │   │   └── CarouselGalleryTab.tsx# Multi-slide album selector & ZIP packager
│   │   ├── batch/
│   │   │   └── BatchPlaylistView.tsx# 50-URL queue & playlist downloader
│   │   ├── progress/
│   │   │   ├── ActiveDownloadCard.tsx# Liquid glass progress bar with speed & ETA
│   │   │   └── DownloadQueueDrawer.tsx # Slide-over active & history manager
│   │   └── creator/
│   │       └── CreatorSpotlightModal.tsx # "Meet the Architect" interactive modal
├── .env.example
├── .env
├── .gitignore
├── vercel.json
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js 18+** or **Node.js 20+**
- **npm** or **pnpm** or **yarn**
- Running instance of `CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Backend` (port `8000`)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Verify `.env` points to your backend instance:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_BASE_URL=ws://localhost:8000
```

### 4. Start Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 5. Build for Production
```bash
npm run build
```
Generates an optimized, tree-shaken static production bundle in `dist/`.

---

## 👨‍💻 Architect & Credits

Architected and developed with precision by **Chathunga Bimsara (CBX)**:
- **Institution**: Institute of Software Engineering (IJSE)
- **Role**: Software Architect & Distributed Systems Engineer
- **GitHub**: [@chathungabimsara](https://github.com/chathungabimsara)
- **LinkedIn**: [Chathunga Bimsara](https://linkedin.com/in/chathunga-bimsara)

---

## 📄 License
This project is licensed under the MIT License.
