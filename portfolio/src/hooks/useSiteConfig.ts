import { useMemo } from 'react'
import { isTouchDevice, prefersReducedMotion } from '../lib/accessibility'

export type Tier = 'high' | 'low' | 'minimal'

export interface SiteConfig {
  /** high = full 3D · low = reduced 3D · minimal = 2D-only */
  tier: Tier
  reducedMotion: boolean
  touch: boolean
  /** Approximate device pixel-ratio budget. */
  dpr: number
  supportsWebGL: boolean
}

/**
 * Reads device capabilities once at mount and returns a stable config the
 * whole tree uses to decide how much 3D to run. This is how we keep mobile
 * at 60fps: fewer particles, no camera fly-through, ambient rotation only.
 *
 * Tuning note: touch + reduced-motion are the strong signals; hardware
 * concurrency is only used as a last-resort guard (<=1), because many
 * mid-range laptops legitimately report 4 logical cores.
 */
export function useSiteConfig(): SiteConfig {
  return useMemo<SiteConfig>(() => {
    const reducedMotion = prefersReducedMotion()
    const touch = isTouchDevice()

    // Cheap, safe WebGL probe.
    let supportsWebGL = true
    try {
      const canvas = document.createElement('canvas')
      supportsWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
      )
    } catch {
      supportsWebGL = false
    }

    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8

    let tier: Tier = 'high'
    if (!supportsWebGL) tier = 'minimal'
    else if (reducedMotion || touch || cores <= 1) tier = 'low'

    const dpr = Math.min(window.devicePixelRatio || 1, tier === 'low' ? 1.5 : 2)

    return { tier, reducedMotion, touch, dpr, supportsWebGL }
  }, [])
}

/** Safe static default (SSR / before mount). */
export const defaultSiteConfig: SiteConfig = {
  tier: 'minimal',
  reducedMotion: false,
  touch: false,
  dpr: 1,
  supportsWebGL: false,
}
