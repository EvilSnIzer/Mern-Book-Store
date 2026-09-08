# Portfolio — AI/ML Engineer

A single-page, scroll-driven portfolio with a clean, premium 3D experience.
Near-monochrome (off-black `#0a0a0a` / off-white `#f2f2f0`) with a single
electric-blue accent (`#4f7cff`), big variable-width type, and **one**
signature 3D interaction: a camera path driven by scroll.

Built with **React + Vite**, **Three.js** (`@react-three/fiber` /
`@react-three/drei`), **GSAP + ScrollTrigger**, **Lenis**, **Framer Motion**
and **Tailwind CSS**. Deploy target: **Vercel**.

---

## Quick start

```bash
cd portfolio
npm install
npm run dev          # http://localhost:5173
```

Other commands:

```bash
npm run build        # production build → dist/
npm run preview      # serve the production build locally
npm run gen:covers   # regenerate the placeholder project covers
```

> The repo also contains the original `mern-client` / `mern-server` MERN app.
> This portfolio lives entirely in **`/portfolio`** and has no dependency on
> the MERN app.

---

## Sections

| # | Section    | What happens                                                                 |
|---|------------|------------------------------------------------------------------------------|
| 0 | Preloader  | Branded curtain + **real** asset-loading progress bar (`useProgress`).        |
| 1 | Hero       | Full-viewport R3F canvas, GPU-instanced particle field reacting to cursor.   |
| 2 | About      | Camera flies forward; a TorusKnot morphs toward an organic/neural form via a vertex-shader displacement scrubbed by scroll. |
| 3 | Skills     | Skill tags as floating 3D planes with dampened-spring drift + cursor repulsion. |
| 4 | Projects   | Horizontal-scroll gallery of tilted 3D planes; click → full case study.      |
| 5 | Timeline   | Curved 3D tube; milestone markers light up as their dates scroll past.       |
| 6 | Contact    | Minimal — one 3D accent object, large CTA type, email / GitHub / LinkedIn.   |

---

## Architecture

```
portfolio/
├─ index.html              # SEO meta, OG tags, early reduced-motion flags
├─ public/
│  ├─ favicon.svg
│  ├─ og-image.png         # Open Graph image (replace with your own)
│  └─ covers/              # project cover images (placeholders, replace with screenshots)
├─ scripts/
│  └─ gen-covers.mjs       # generates placeholder SVG covers (no deps)
└─ src/
   ├─ App.jsx              # composition + Lenis init + preloader gating
   ├─ main.jsx
   ├─ index.css            # Tailwind layers, display type, grain, marquee, cue
   ├─ styles/fonts.css     # self-host font placeholders + Inter stand-in
   ├─ lib/
   │  ├─ smooth-scroll.ts  # Lenis + ScrollTrigger integration (single scroll source)
   │  ├─ pointer.ts        # shared normalized cursor (canvas is pointer-events:none)
   │  ├─ accessibility.ts  # prefers-reduced-motion / touch flags
   │  └─ utils.ts
   ├─ context/AppContext.tsx
   ├─ hooks/
   │  ├─ useSiteConfig.ts  # high / low / minimal device tiering
   │  ├─ useSprings.ts     # dampened spring simulation (no physics engine)
   │  └─ useSectionVisibility.ts
   ├─ data/
   │  ├─ profile.ts        # ← YOUR name, bio, stats, links
   │  ├─ projects.ts       # ← YOUR projects (case studies)
   │  ├─ timeline.ts       # ← YOUR career milestones
   │  └─ skills.ts         # ← YOUR skills
   ├─ components/
   │  ├─ Preloader.tsx
   │  ├─ Nav.tsx
   │  ├─ ScrollProgress.tsx
   │  ├─ Reveal.tsx / SplitText.tsx
   │  ├─ sections/         # Hero, About, Skills, Projects, ProjectCard, CaseStudy, Timeline, Contact
   │  └─ three/            # Scene, CameraRig, Particles, MorphGeometry, SkillField, TimelineTube, ContactAccent
   └─ ...
```

**Key design decision — one source of truth for scroll.** Lenis owns the
actual scrolling and drives GSAP via `gsap.ticker`:

```ts
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
```

This is the current Lenis v1 recommended integration. Lenis v1 scrolls the
native window (no `transform` on a wrapper), so ScrollTrigger tracks the
window scroller directly and `scrollerProxy` is *not* required — it is only
needed when Lenis runs in `wrapper`/transform mode. Every camera move, every
3D fade, every DOM reveal and the horizontal gallery all read from
ScrollTrigger, so there is a single scroll source of truth and zero
independent `scroll` listeners.

---

## Swapping in real data & images

Everything editable lives in `src/data/`. No component needs touching.

### 1. Personal details — `src/data/profile.ts`

Name, role, tagline, email, GitHub, LinkedIn, bio paragraphs and the hero
focus chips. `github` is already set to `https://github.com/EvilSnIzer`.

### 2. Projects — `src/data/projects.ts`

Each entry has a `cover` (image path) and a `caseStudy`
(problem → approach → stack → result). To add a project:

1. Drop a **1200×800** screenshot (JPG/PNG) into `public/covers/`.
2. Add/point an entry's `cover` to `/covers/your-image.jpg`.
3. Fill in `summary` + the four case-study fields.

The placeholder covers are generated SVGs (`npm run gen:covers`). Replace
them with real screenshots — the gallery, case-study drawer and preloader
all read from the same `cover` path automatically.

### 3. Timeline — `src/data/timeline.ts`

Year, role, company and a description per milestone. The 3D tube positions
its markers automatically from this array.

### 4. Skills — `src/data/skills.ts`

Clusters → skill tags. The 3D word field and the DOM list both render from
this file.

### 5. Font — `src/styles/fonts.css`

The goal is a **self-hosted** "Neue Montreal" (or General Sans). Drop the
`.woff2` files into `src/assets/fonts/`, uncomment the `@font-face` blocks in
`fonts.css`, then delete the Google Fonts `<link>` in `index.html`. Until
then, **Inter** (via Google Fonts) is used as a close, freely-available
stand-in.

### 6. OG image / favicon / resume

- Replace `public/og-image.png` (1200×630) with your own branded card.
- Replace `public/favicon.svg` if you like.
- Drop a `resume.pdf` into `public/` and update `profile.resume`.

### 7. `TODO` markers

Real content is clearly marked `TODO` in `src/data/*.ts` (project statements,
timeline details, LinkedIn handle, stats). `grep -rn "TODO" src` to find them
all.

---

## Performance & responsiveness

The app tiers itself automatically in `useSiteConfig.ts`:

| Tier     | When                                 | Behaviour                                            |
|----------|--------------------------------------|------------------------------------------------------|
| `high`   | Desktop, WebGL, motion OK            | Full camera fly-through, 3200 particles, full field |
| `low`    | Touch, reduced-motion, or ≤4 cores   | Ambient orbit only, 1200 particles, no fly-through  |
| `minimal`| No WebGL                             | Canvas skipped entirely — pure DOM experience        |

Other perf choices: GPU-instanced points (one draw call), no stacked
post-processing (no bloom/SSAO — the single glow is additive material
blending, which is cheap), `dpr` clamped to 2, and `<Preload all />` to warm
up shaders after load.

## Accessibility

- The 3D layer is `pointer-events: none` + `aria-hidden` — it is decorative.
  **All** text lives in semantic HTML (`h1`/`h2`, lists, `dl` for case
  studies) so screen readers read everything.
- `prefers-reduced-motion: reduce` disables the camera fly-through, particle
  drift, marquee and grain animation; content stays fully readable.
- Keyboard: case studies open/close via a real `<button>`, close with `Esc`,
  focus is returned to the close button on open.
- `noscript` fallback in `index.html`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel → **New Project** → import the repo.
3. Set **Root Directory** to `portfolio` (or add the `portfolio/` prefix to
   build/publish settings if you prefer the UI fields):
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. `vercel.json` in `/portfolio` already sets the framework.

> SEO meta, canonical URL and OG image are in `portfolio/index.html` — update
> `your-domain.com` placeholders before shipping.
