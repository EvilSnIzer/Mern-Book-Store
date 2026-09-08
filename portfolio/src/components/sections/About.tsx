import Reveal from '../Reveal'
import { profile } from '../../data/profile'

export default function About() {
  return (
    <section
      id="section-about"
      className="relative flex min-h-screen items-center px-6 py-32 md:px-10 lg:px-16"
      aria-labelledby="about-title"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        {/* Left column is intentionally empty on desktop — the morphing
            geometry lives in the 3D scene behind it. */}
        <div className="hidden lg:block" aria-hidden="true" />

        <div className="lg:pl-8">
          <Reveal>
            <p className="eyebrow mb-6">01 — About</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="about-title"
              className="display text-[clamp(2.4rem,5.5vw,4.6rem)] text-paper"
            >
              From notebook
              <br />
              <span className="text-stroke-accent">to production.</span>
            </h2>
          </Reveal>

          <div className="mt-8 max-w-xl space-y-6">
            {profile.about.map((para, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="text-base leading-relaxed text-fog md:text-lg">{para}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-hairline pt-8">
            {profile.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.15 + i * 0.06}>
                <p className="display text-3xl text-paper md:text-5xl">
                  {s.value}
                  <span className="text-accent">.</span>
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
