/**
 * Single source of truth for the personal details shown across the site.
 * Edit these once to update the hero, about, contact and SEO-relevant bits.
 */
export const profile = {
  name: 'Manan Nisar',
  firstName: 'Manan',
  role: 'AI / ML Engineer',
  tagline: 'Building production machine-learning systems — from research to deployment.',
  location: 'Remote · Earth',
  email: 'hello@manannisar.dev',
  github: 'https://github.com/EvilSnIzer',
  githubHandle: 'EvilSnIzer',
  linkedin: 'https://www.linkedin.com/in/manan-nisar', // TODO: verify handle
  resume: '/resume.pdf', // TODO: drop a real resume.pdf into /public
  about: [
    "I'm an AI/ML engineer who cares about the gap between a notebook and production. I design, train and ship models that hold up under real traffic — and I obsess over the last 10%: latency, drift, and the boring infrastructure that makes ML reliable.",
    'Currently I work across the full ML lifecycle: data pipelines, model training, evaluation, and deployment. Lately that has meant LLM systems, retrieval, and computer vision — always with an eye on measurable business outcomes rather than benchmark theatre.',
  ],
  // Short one-liners rendered with an accent index marker — used in the hero.
  focuses: ['Deep Learning', 'LLM Systems', 'MLOps', 'Computer Vision'],
  // TODO: replace with your real numbers.
  stats: [
    { value: '5+', label: 'Years in ML' },
    { value: '12', label: 'Models in production' },
    { value: '3', label: 'Papers & talks' },
  ],
}
