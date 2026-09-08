import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AppContext } from './context/AppContext'
import { useSiteConfig } from './hooks/useSiteConfig'
import { initSmoothScroll } from './lib/smooth-scroll'
import Scene from './components/three/Scene'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Timeline from './components/sections/Timeline'
import Contact from './components/sections/Contact'
import ScrollProgress from './components/ScrollProgress'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const config = useSiteConfig()
  const [ready, setReady] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)

  // Lenis + ScrollTrigger integration — the single scroll source of truth.
  useEffect(() => {
    initSmoothScroll()
    const t = setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => clearTimeout(t)
  }, [])

  // Once the preloader lifts, layout settles → re-measure triggers.
  useEffect(() => {
    if (ready) {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [ready])

  const value = useMemo(() => ({ config, ready }), [config, ready])

  const handlePreloaderDone = () => {
    setReady(true)
    setShowPreloader(false)
  }

  return (
    <AppContext.Provider value={value}>
      <div className="relative min-h-screen bg-ink text-paper">
        {/* Film grain overlay — non-plastic, premium finish */}
        <div className="grain" aria-hidden="true" />

        {/* Decorative 3D layer (behind all DOM content) */}
        <Scene />

        {/* DOM content — the real, accessible, SEO source of truth */}
        <main className="relative z-10">
          <Nav />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Timeline />
          <Contact />
        </main>

        <ScrollProgress />

        <AnimatePresence>
          {showPreloader && <Preloader onDone={handlePreloaderDone} />}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  )
}
