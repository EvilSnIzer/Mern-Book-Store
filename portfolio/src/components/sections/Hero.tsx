import { motion } from 'framer-motion'
import SplitText from '../SplitText'
import { profile } from '../../data/profile'
import { useApp } from '../../context/AppContext'

export default function Hero() {
  const { ready, config } = useApp()

  return (
    <section
      id="section-hero"
      className="relative flex min-h-screen flex-col justify-end px-6 pb-24 pt-28 md:px-10 lg:px-16"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="eyebrow mb-8"
      >
        {profile.role} — Portfolio · 2026
      </motion.p>

      <h1 className="display text-[clamp(3.4rem,13vw,12.5rem)] text-paper">
        <SplitText text="Manan" play={ready} delay={0.15} />
        <br />
        <span className="text-stroke">
          <SplitText text="Nisar" play={ready} delay={0.3} />
        </span>
      </h1>

      <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md text-base leading-relaxed text-fog md:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap gap-x-5 gap-y-2"
        >
          {profile.focuses.map((f, i) => (
            <li key={f} className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
              <span className={i === 0 ? 'text-accent' : ''}>/</span> {f}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Scroll cue — decorative only, no scroll interaction of its own */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden="true"
      >
        {!config.reducedMotion && <span className="scroll-cue-line" />}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">Scroll</span>
      </motion.div>
    </section>
  )
}
