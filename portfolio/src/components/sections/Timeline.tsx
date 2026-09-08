import Reveal from '../Reveal'
import { timeline } from '../../data/timeline'

/**
 * Timeline — vertical section with alternating milestones. The curved 3D
 * tube + lighting markers live in the canvas (decorative, driven by
 * ScrollTrigger on these DOM items); this list is the readable content.
 */
export default function Timeline() {
  return (
    <section
      id="section-timeline"
      className="relative px-6 py-32 md:px-10 lg:px-16"
      aria-labelledby="timeline-title"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="eyebrow mb-6">04 — Timeline</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            id="timeline-title"
            className="display text-[clamp(2.4rem,5.5vw,4.6rem)] text-paper"
          >
            The path <span className="text-stroke-accent">so far.</span>
          </h2>
        </Reveal>

        <ol className="mt-20 space-y-16 md:space-y-24">
          {timeline.map((m, i) => {
            const yearRight = i % 2 === 1
            return (
              <li
                key={m.id}
                id={`timeline-${m.id}`}
                className="relative grid gap-4 md:grid-cols-2 md:gap-12"
              >
                <Reveal className={yearRight ? 'md:order-2 md:text-right' : ''}>
                  <p className="display text-6xl text-paper/90 md:text-8xl">
                    {m.year}
                    <span className="text-accent">.</span>
                  </p>
                </Reveal>
                <Reveal delay={0.08} className={yearRight ? 'md:order-1' : ''}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                    {m.org}
                  </p>
                  <h3 className="display mt-3 text-2xl text-paper md:text-4xl">{m.title}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-fog">
                    {m.description}
                  </p>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
