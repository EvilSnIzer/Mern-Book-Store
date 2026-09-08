import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (p: Project) => void
}

/**
 * A tilted 3D plane (CSS perspective + rotate) with the project cover as
 * its texture. Cursor-tracked tilt + image parallax via Framer Motion
 * springs. Real DOM content → readable, focusable, SEO-friendly.
 */
export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const rotateY = useSpring(useTransform(mx, [0, 1], [-14, 6]), { stiffness: 120, damping: 18 })
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -7]), { stiffness: 120, damping: 18 })
  const imgX = useSpring(useTransform(mx, [0, 1], ['4%', '-4%']), { stiffness: 120, damping: 18 })
  const imgY = useSpring(useTransform(my, [0, 1], ['4%', '-4%']), { stiffness: 120, damping: 18 })

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      className="group relative w-[76vw] shrink-0 sm:w-[48vw] lg:w-[36vw]"
    >
      <div className="relative overflow-hidden rounded-xl border border-hairline bg-[#111111]">
        {/* Cover "texture" */}
        <motion.div style={{ x: imgX, y: imgY, scale: 1.08 }} className="aspect-[4/3]">
          <img
            src={project.cover}
            alt={`${project.title} — project cover`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        {/* Index */}
        <span className="absolute left-5 top-5 font-mono text-xs text-paper/60">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Caption */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              {project.category} · {project.year}
            </p>
            <h3 className="display mt-2 text-2xl text-paper md:text-4xl">{project.title}</h3>
          </div>
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/25 text-paper transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-ink"
            aria-hidden="true"
          >
            ↗
          </span>
        </div>
      </div>

      {/* Full-card hit target / a11y */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        aria-label={`Open case study: ${project.title}`}
      />
    </motion.article>
  )
}
