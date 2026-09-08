import Reveal from '../Reveal'
import { profile } from '../../data/profile'

/**
 * Contact — minimal. One small 3D accent object (canvas), a large CTA, and
 * direct links. Footer carries the legal/credits.
 */
export default function Contact() {
  return (
    <section
      id="section-contact"
      className="relative flex min-h-screen flex-col justify-between px-6 pb-10 pt-32 md:px-10 lg:px-16"
      aria-labelledby="contact-title"
    >
      <div className="flex flex-1 flex-col items-start justify-center">
        <Reveal>
          <p className="eyebrow mb-6">05 — Contact</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            id="contact-title"
            className="display text-[clamp(2.8rem,8vw,7.5rem)] text-paper"
          >
            Let's build
            <br />
            something <span className="text-stroke-accent">intelligent.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-md text-base leading-relaxed text-fog md:text-lg">
            Currently open to full-time roles and interesting consulting work. If you have a hard
            ML problem worth solving, my inbox is open.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent"
            >
              {profile.email}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-7 py-3 text-sm text-paper transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-7 py-3 text-sm text-paper transition-colors hover:border-accent hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="mt-24 flex flex-col gap-3 border-t border-hairline pt-8 text-sm text-dim md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name} — {profile.role}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
          Built with React · Three.js · GSAP · Lenis
        </p>
      </footer>
    </section>
  )
}
