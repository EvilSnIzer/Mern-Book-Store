import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * The single source of truth for scroll position.
 *
 * Lenis owns the actual scrolling; GSAP ScrollTrigger is wired to Lenis via
 * `scrollerProxy` so every ScrollTrigger in the app reads the SAME scroll
 * value. No component adds its own scroll listener.
 */

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function initSmoothScroll(): Lenis {
  if (lenis) return lenis

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduced,
    // Touch devices already scroll natively — let the browser handle it.
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  // Drive ScrollTrigger from Lenis's internal rAF loop.
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis(): Lenis | null {
  return lenis
}

export function stopLenis(): void {
  lenis?.stop()
}

export function startLenis(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis?.start()
}

export function scrollToId(id: string, offset = 0): void {
  const el = document.querySelector(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset, duration: 1.4 })
  } else {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
