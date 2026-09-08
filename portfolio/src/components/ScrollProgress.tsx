import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Thin accent progress line at the top — another ScrollTrigger scrub. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress })
      },
    })
    return () => st.kill()
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  )
}
