import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../Reveal'
import ProjectCard from './ProjectCard'
import CaseStudy from './CaseStudy'
import { projects, type Project } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

/**
 * Projects — horizontal-scroll gallery driven by a single ScrollTrigger
 * scrub (shared scroll source of truth with Lenis). Cards are CSS 3D-tilted
 * planes (perspective + rotate) whose covers act as the "texture"; hover
 * parallax is Framer Motion. Clicking opens a full case-study drawer.
 */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Project | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth)

    const setHeight = () => {
      section.style.height = `${getDist() + window.innerHeight}px`
    }
    setHeight()

    const tween = gsap.to(track, { x: () => -getDist(), ease: 'none' })
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${getDist()}`,
      scrub: 1,
      animation: tween,
      invalidateOnRefresh: true,
    })

    const onResize = () => {
      setHeight()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    return () => {
      st.kill()
      tween.kill()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const open = useCallback((p: Project) => setActive(p), [])
  const close = useCallback(() => setActive(null), [])

  return (
    <section
      id="section-projects"
      ref={sectionRef}
      className="relative"
      aria-labelledby="projects-title"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-24 md:px-10 lg:px-16">
          <Reveal>
            <p className="eyebrow">03 — Selected Work</p>
          </Reveal>
          <Reveal>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-dim md:block">
              Scroll
            </p>
          </Reveal>
        </div>

        <h2 id="projects-title" className="sr-only">
          Selected projects
        </h2>

        <div
          ref={trackRef}
          className="flex w-max items-center gap-[6vw] px-6 will-change-transform md:px-[8vw]"
          style={{ perspective: '1200px' }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={open} />
          ))}

          {/* End cap so the last card has breathing room + a forward CTA */}
          <div className="flex w-[40vw] shrink-0 flex-col justify-center gap-4 md:w-[22vw]">
            <p className="display text-[clamp(1.6rem,3vw,2.6rem)] text-paper">
              More on
              <br />
              <a
                href="https://github.com/EvilSnIzer"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                GitHub →
              </a>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && <CaseStudy project={active} onClose={close} />}
      </AnimatePresence>
    </section>
  )
}
