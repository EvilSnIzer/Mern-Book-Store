/**
 * Generates tasteful placeholder project covers (SVG) so the gallery,
 * the 3D texture preloader and the case-study drawer all work out of the
 * box. Replace each file with a real screenshot (JPG/PNG) and update the
 * `cover` path in `src/data/projects.ts` — see the README.
 *
 * Usage: node scripts/gen-covers.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'covers')
mkdirSync(outDir, { recursive: true })

const covers = [
  {
    file: 'latent-rag.svg',
    title: 'Latent RAG',
    tag: 'LLM Systems',
    a: '#4f7cff',
    b: '#1f2f6b',
  },
  {
    file: 'defect-vision.svg',
    title: 'Defect Vision',
    tag: 'Computer Vision',
    a: '#4f7cff',
    b: '#0e2a52',
  },
  {
    file: 'churn-forecast.svg',
    title: 'Churn Forecast',
    tag: 'MLOps',
    a: '#2b8cff',
    b: '#0c1a3a',
  },
  {
    file: 'gen-ui.svg',
    title: 'Generative UI',
    tag: 'Applied AI',
    a: '#6f9bff',
    b: '#131a33',
  },
]

const svg = ({ title, tag, a, b }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a0a"/>
      <stop offset="1" stop-color="#0e0e12"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.28" r="0.9">
      <stop offset="0" stop-color="${a}" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="${b}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>

  <g stroke="${a}" stroke-opacity="0.14" stroke-width="1">
    <circle cx="860" cy="220" r="260" fill="none"/>
    <circle cx="860" cy="220" r="360" fill="none"/>
    <circle cx="860" cy="220" r="460" fill="none"/>
  </g>

  <text x="70" y="610" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="120" font-weight="600" fill="#f2f2f0" letter-spacing="-2">${title}</text>
  <text x="74" y="668" font-family="monospace" font-size="22" letter-spacing="6" fill="${a}">${tag.toUpperCase()} · 2024</text>
  <text x="74" y="736" font-family="monospace" font-size="15" letter-spacing="2" fill="#5a5a5a">PLACEHOLDER COVER — replace with a real screenshot</text>

  <rect width="1200" height="800" filter="url(#grain)" opacity="1"/>
</svg>`

for (const c of covers) {
  const target = join(outDir, c.file)
  writeFileSync(target, svg(c))
  console.log('wrote', target)
}
