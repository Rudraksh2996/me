<div align="center">

# ⛩️ RUDRAKSH SHARMA — CINEMATIC PORTFOLIO

<p align="center">
  <strong>An Awwwards-inspired, highly interactive developer portfolio built with Next.js, Tailwind CSS v4, GSAP, and Lenis.</strong>
</p>

<p align="center">
  <a href="https://github.com/Rudraksh2996/me"><img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="https://gsap.com"><img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock" alt="GSAP" /></a>
  <a href="https://lenis.darkroom.engineering/"><img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-white?style=for-the-badge" alt="Lenis" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
</p>

</div>

---

## 🌒 Overview

A high-performance personal portfolio created with the **"KAGE" (影)** and **"Afterlight" (残光)** visual and motion aesthetic. The experience combines fine Japanese landscape iconography, multi-plane SVG parallax, interactive particle physics, and choreographed scroll-driven timelines.

- **Developer**: Rudraksh Sharma (B.Tech Information Technology · Python Developer & AWS Certified CloudOps Engineer)
- **Live Concept**: Inspired by modern award-winning interactive design studios and digital craft showcases.

---

## ✨ Key Motion & Visual Features

### 🌸 1. Interactive Sakura Cursor Physics
- **Dynamic Particle Emission**: Real-time HTML5 Canvas system shedding individual cherry blossom petals and full 5-petal sakura blooms as the pointer travels.
- **Physics Simulation**: Scaled to cursor velocity with rotational inertia, 3D cosine flip flutter, gravitational descent, air drag, and sine-wave wind drift.
- **Magnetic Ring Pointer**: Custom trailing ring cursor with a glowing crimson core dot and reactive hover expansion states.

### 🎭 2. Cinematic Split-Curtain Preloader
- Displays an atmospheric crimson kanji emblem (`影`), smooth 000 → 100 numeric counter, and synchronized loading rail.
- Splits into a 6-column curtain that retracts in an outward stagger, lifting to reveal the hero scene.

### ⛩️ 3. Multi-Layered "KAGE" Hero Scene
- **Centerpiece Monolith (`RUDRAKSH`)**: A massive typographic centerpiece resting behind the grassy hill crest.
- **Masked Gradient Scrub**: GSAP ScrollTrigger translates each letter upward while panning an internal gradient from silvery bone-white into blazing crimson ember.
- **Layered Scenic Parallax**: Independent depth translation for the blood moon, passing cloud bands, pagoda temple with glowing shoji windows, torii shrine gate, flickering stone tōrō lantern, overhanging sakura boughs, and grass ridges.

### 📜 4. The Chapters

- **Chapter 00 — The Prologue**: Hero scene assembly, vertical Japanese calligraphy (`ルドラクシュ` / `影の道`), and interactive chapter selectors.
- **Chapter 01 — Origin (`起源`)**: Masked line reveals and dual-direction horizontal text drift (*"Forged in Python. Bound for Agentic AI."*), academic credentials, AWS Cloud certifications, and core coursework tags.
- **Chapter 02 — Works (`作品`)**: Pinned horizontal viewport gallery translating project cards across the screen with individual card parallax, progress tracking, and direct GitHub source links.
- **Chapter 03 — Afterlight (`残光`)**: Pinned 48-bar audio-style equalizer indicating scroll depth and pulsing with active category transitions across Frontend, Backend, Cloud, and Tools.
- **Chapter 04 — Contact (`連絡`)**: Direct contact hub with interactive links for Email, Resume, GitHub, LinkedIn, and LeetCode.
- **Dynamic Rails & Navigation**: Minimalist auto-hiding fixed navigation bar coupled with a vertical `01`–`04` scroll-position indicator.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components + Client Islands)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with pure CSS `@theme` variables (`bg-ink`, `text-bone`, `text-ember`, etc.)
- **Motion & Timelines**: [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/scrolltrigger/) via `@gsap/react` and `matchMedia`
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) synchronized with GSAP's central RAF ticker
- **Typography**: [Google Fonts](https://fonts.google.com/) (`Inter Tight` for sleek body & UI typography, `Cormorant Garamond` for classical display headings)
- **Icons**: [Lucide React](https://lucide.dev/) + inline SVG brand glyphs

---

## 📁 Project Structure

```text
cinematic-portfolio/
├── public/
│   └── resume.pdf                 # Resume document
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind v4 @theme, grain animation, equalizer styles
│   │   ├── layout.tsx             # Root layout with fonts, Lenis, Preloader, and Cursor
│   │   └── page.tsx               # Sequential chapter assembly
│   ├── components/
│   │   ├── fx/
│   │   │   ├── CursorSakura.tsx   # Canvas petal physics and ring cursor
│   │   │   └── Preloader.tsx      # Split-curtain preloader with numeric counter
│   │   ├── hero/
│   │   │   ├── Hero.tsx           # Pinned hero parallax & typography centerpiece
│   │   │   └── SceneLayers.tsx    # SVG artwork (Moon, Temple, Torii, Sakura, Hill)
│   │   ├── Afterlight.tsx         # Chapter 03 equalizer timeline
│   │   ├── ChapterHeader.tsx      # Chapter title primitive with animated rules
│   │   ├── ChapterRail.tsx        # Fixed 01-04 side progress rail
│   │   ├── Contact.tsx            # Chapter 04 contact links & footer
│   │   ├── Icons.tsx              # Brand icon SVGs
│   │   ├── Nav.tsx                # Auto-hiding header navigation
│   │   ├── Origin.tsx             # Chapter 01 bio, credentials & statement
│   │   ├── RevealText.tsx         # Staggered typography reveal primitive
│   │   ├── SmoothScroll.tsx       # Lenis + GSAP RAF synchronization provider
│   │   └── Works.tsx              # Chapter 02 pinned horizontal scroll gallery
│   ├── data/
│   │   └── portfolio.ts           # Centralized profile, projects, stack & contact data
│   └── lib/
│       ├── gsap.ts                # Client-safe GSAP & ScrollTrigger registry
│       └── intro.ts               # Preloader-to-Hero transition signals
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Rudraksh2996/me.git
cd me
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 👤 Author

**Rudraksh Sharma**  
- GitHub: [@Rudraksh2996](https://github.com/Rudraksh2996)  
- LinkedIn: [Rudraksh Sharma](https://www.linkedin.com/in/rudraksh2996/)  
- Email: [sharmarudraksh840@gmail.com](mailto:sharmarudraksh840@gmail.com)  
- LeetCode: [@Rudraksh_29](https://leetcode.com/u/Rudraksh_29/)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

