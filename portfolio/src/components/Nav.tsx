import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { scrollToId } from '../lib/smooth-scroll'

const LINKS = [
  { id: 'section-about', label: 'About' },
  { id: 'section-skills', label: 'Skills' },
  { id: 'section-projects', label: 'Projects' },
  { id: 'section-timeline', label: 'Timeline' },
  { id: 'section-contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 mix-blend-difference"
    >
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <button
          type="button"
          onClick={() => scrollToId('#section-hero', 0)}
          className="font-mono text-sm tracking-[0.2em] text-paper/90 transition-colors hover:text-accent"
          aria-label="Back to top"
        >
          MN<span className="text-accent">.</span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => scrollToId(`#${l.id}`, -12)}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/70 transition-colors hover:text-paper"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/70 transition-colors hover:text-paper"
          >
            GitHub
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-full border border-hairline px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Hire me
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
