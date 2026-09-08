import Reveal from '../Reveal'
import { skills, skillTags } from '../../data/skills'

/**
 * Skills — the floating 3D word field lives in the canvas behind this
 * section (decorative). The DOM copy here is the accessible/SEO source of
 * truth and also powers a CSS marquee strip for extra typographic texture.
 */
export default function Skills() {
  return (
    <section
      id="section-skills"
      className="relative flex min-h-screen flex-col px-6 py-32 md:px-10 lg:px-16"
      aria-labelledby="skills-title"
    >
      <div className="flex w-full flex-1 flex-col justify-between gap-16">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-6">02 — Skills</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="skills-title"
              className="display text-[clamp(2.4rem,5.5vw,4.6rem)] text-paper"
            >
              A full-stack
              <br />
              ML <span className="text-stroke">toolkit.</span>
            </h2>
          </Reveal>
        </div>

        {/* Accessible cluster list (screen readers + no-JS) */}
        <ul className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {skills.map((cluster, i) => (
            <Reveal key={cluster.label} delay={0.05 + i * 0.06}>
              <li>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                  {cluster.label}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {cluster.skills.map((s) => (
                    <li key={s} className="text-sm text-fog md:text-base">
                      {s}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Marquee strip — decorative duplicate of the skill names */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-14 overflow-hidden"
        aria-hidden="true"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {skillTags.map((s) => (
                <span key={s} className="display whitespace-nowrap text-[2.6rem] text-paper/[0.07] md:text-[3.6rem]">
                  {s} <span className="text-accent/[0.35]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
