import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { startLenis, stopLenis } from '../../lib/smooth-scroll'

interface CaseStudyProps {
  project: Project
  onClose: () => void
}

const EASE = [0.22, 1, 0.36, 1] as const

const SECTIONS: Array<{ key: keyof Project['caseStudy']; label: string; body?: string }> = [
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'stack', label: 'Stack' },
  { key: 'result', label: 'Result' },
]

/**
 * Full case-study panel: problem → approach → stack → result.
 * Freezes smooth-scroll while open and returns focus on close.
 */
export default function CaseStudy({ project, onClose }: CaseStudyProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    stopLenis()
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      startLenis()
    }
  }, [onClose])

  const { caseStudy } = project

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — case study`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 backdrop-blur-sm md:items-center md:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.55, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="quiet-scroll relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-hairline bg-[#0e0e0e] md:rounded-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-paper/20 text-paper transition-colors hover:border-accent hover:text-accent"
          aria-label="Close case study"
        >
          ✕
        </button>

        <div className="relative">
          <img
            src={project.cover}
            alt={`${project.title} — project cover`}
            className="aspect-[16/8] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 md:left-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              {project.category} · {project.year}
            </p>
            <h2 className="display mt-2 text-4xl text-paper md:text-6xl">{project.title}</h2>
          </div>
        </div>

        <div className="space-y-10 p-6 md:p-10">
          <p className="max-w-2xl text-lg leading-relaxed text-fog">{project.summary}</p>

          <dl className="space-y-10 border-t border-hairline pt-10">
            {SECTIONS.map((s) => (
              <div key={s.key} className="grid gap-3 md:grid-cols-[140px_1fr] md:gap-8">
                <dt className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim md:pt-1.5">
                  {s.label}
                </dt>
                <dd className="text-base leading-relaxed text-paper/85">
                  {s.key === 'stack' ? (
                    <ul className="flex flex-wrap gap-2">
                      {(caseStudy.stack as string[]).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-fog"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    caseStudy[s.key]
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center justify-between border-t border-hairline pt-6">
            <a
              href="https://github.com/EvilSnIzer"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
            >
              View source ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-paper"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
