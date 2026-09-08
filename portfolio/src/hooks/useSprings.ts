import { useEffect, useMemo, useRef } from 'react'
import { Vector3 } from 'three'

export interface VectorSpringOptions {
  /** Spring stiffness. Higher = snappier return to target. */
  stiffness?: number
  /** Damping. Higher = less oscillation. */
  damping?: number
  /** Fixed timestep (seconds). */
  dt?: number
}

export interface VectorSpring {
  /** Current position — write to your mesh each frame. */
  pos: Vector3
  /** Current velocity. */
  vel: Vector3
  /** Desired rest position (e.g. home + gentle wander). */
  target: Vector3
  /** Original anchor the spring returns to. */
  home: Vector3
}

/**
 * A tiny dampened-spring simulation (no physics engine) for N objects in
 * 3D space. `tick()` advances every spring one step; `pos` is the eased
 * position. Use for gentle drift + cursor repulsion: nudge `vel` (impulse)
 * and the spring will ease back toward `target`.
 */
export function useVectorSprings(count: number, opts: VectorSpringOptions = {}) {
  const { stiffness = 120, damping = 16, dt = 1 / 60 } = opts

  const springs = useRef<VectorSpring[]>([])

  if (springs.current.length !== count) {
    springs.current = Array.from({ length: count }, () => ({
      pos: new Vector3(),
      vel: new Vector3(),
      target: new Vector3(),
      home: new Vector3(),
    }))
  }

  const springsRef = springs

  const tick = useMemo(
    () => () => {
      const list = springsRef.current
      for (let i = 0; i < list.length; i++) {
        const s = list[i]
        // acc = -k*(pos-target) - c*vel
        s.vel.addScaledVector(s.target, stiffness * dt)
        s.vel.addScaledVector(s.pos, -stiffness * dt)
        s.vel.multiplyScalar(Math.max(0, 1 - damping * dt))
        s.pos.addScaledVector(s.vel, dt)
      }
    },
    [stiffness, damping, dt, springsRef],
  )

  useEffect(() => {
    return () => {
      springsRef.current.length = 0
    }
  }, [springsRef])

  return { springs: springsRef, tick }
}
