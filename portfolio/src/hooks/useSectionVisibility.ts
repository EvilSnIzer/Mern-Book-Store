import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Returns a mutable ref (0..1) that fades a 3D object in/out as its
 * matching DOM section enters/leaves the viewport. All visibility is
 * driven by ScrollTrigger so it shares the exact same scroll source of
 * truth as the camera rig and every DOM reveal.
 */
export function useSectionVisibility(sectionId: string) {
  const amount = useRef(0)

  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) {
      amount.current = 1
      return
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        // Ramp in/out at the section edges, hold 1 through the middle.
        const fade = Math.min(1, self.progress * 6) * Math.min(1, (1 - self.progress) * 6)
        amount.current = fade
      },
    })
    return () => st.kill()
  }, [sectionId])

  return amount
}
