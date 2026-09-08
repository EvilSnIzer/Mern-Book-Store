import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import { profile } from '../data/profile'
import { useApp } from '../context/AppContext'

const EASE = [0.76, 0, 0.24, 1] as const

interface PreloaderProps {
  onDone: () => void
}

/**
 * Branded preloader with a REAL asset-loading progress bar — `useProgress`
 * from drei tracks every async resource in the suspended R3F tree, so the
 * bar only completes when textures/fonts actually resolve.
 */
export default function Preloader({ onDone }: PreloaderProps) {
  const { progress, active, item } = useProgress()
  const { config } = useApp()
  const [minElapsed, setMinElapsed] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const done = useRef(false)

  // No WebGL → no R3F asset pipeline to wait on.
  const no3d = config.tier === 'minimal'

  // Load the webfont early so the canvas word textures render crisply.
  useEffect(() => {
    let mounted = true
    Promise.all([
      typeof document.fonts?.load === 'function'
        ? document.fonts.load('500 64px "Inter"').catch(() => {})
        : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1200)), // minimum brand moment
    ]).then(() => {
      if (mounted) setMinElapsed(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof document.fonts?.ready?.then === 'function') {
      let mounted = true
      document.fonts.ready.then(() => mounted && setFontsReady(true))
      return () => {
        mounted = false
      }
    }
    setFontsReady(true)
  }, [])

  // Reveal when assets are done AND the minimum brand moment has passed.
  const assetDone = no3d ? true : !active && progress >= 100
  const ready = assetDone && minElapsed && fontsReady

  useEffect(() => {
    if (ready && !done.current) {
      done.current = true
      const t = setTimeout(onDone, 250)
      return () => clearTimeout(t)
    }
  }, [ready, onDone])

  const pct = Math.round(progress)

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 md:px-12"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: EASE }}
      aria-hidden="true"
    >
      {/* Brand mark */}
      <div className="flex items-center justify-between">
        <span className="display text-2xl text-paper">
          {profile.firstName}
          <span className="text-accent">.</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          Portfolio
        </span>
      </div>

      {/* Centre status */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="preloader-dot h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="preloader-dot h-1.5 w-1.5 rounded-full bg-accent [animation-delay:0.2s]" />
          <span className="preloader-dot h-1.5 w-1.5 rounded-full bg-accent [animation-delay:0.4s]" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">
          {!assetDone ? `Loading ${item || 'assets'}…` : 'Ready'}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-end justify-between pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
            {profile.role}
          </span>
          <span className="display text-5xl tabular-nums text-paper md:text-7xl">{pct}%</span>
        </div>
        <div className="h-px w-full bg-hairline">
          <motion.div
            className="h-px bg-accent"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
