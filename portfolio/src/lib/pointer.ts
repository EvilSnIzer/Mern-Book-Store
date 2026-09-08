/**
 * Shared, normalized pointer state (-1..1, y-up) so 3D features can react
 * to the cursor even though the Canvas itself is `pointer-events: none`
 * (the DOM copy of the content must stay selectable/clickable).
 */

export const pointer = { x: 0, y: 0 }

let installed = false

export function installPointerTracker(): void {
  if (installed || typeof window === 'undefined') return
  installed = true
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}
