/**
 * Centralised accessibility flags. The `html` element gets `reduce-motion`
 * and `is-touch` classes from an inline script in index.html BEFORE first
 * paint, so these helpers are safe to read synchronously anywhere.
 */

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('reduce-motion')
  )
}

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    document.documentElement.classList.contains('is-touch')
  )
}

export const isCoarsePointer = isTouchDevice
