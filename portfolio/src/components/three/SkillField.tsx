import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { skillTags } from '../../data/skills'
import { useApp } from '../../context/AppContext'
import { useSectionVisibility } from '../../hooks/useSectionVisibility'
import { useVectorSprings } from '../../hooks/useSprings'
import { pointer } from '../../lib/pointer'

interface TagEntry {
  word: string
  tex: THREE.CanvasTexture
  width: number // world-space plane width
  accent: boolean
}

/** Deterministic-ish spread of tags across a flattened disc (no overlaps up front). */
function layoutPositions(count: number): THREE.Vector3[] {
  const R = 4.5
  const out: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    const golden = i * 2.399963229728653
    const r = Math.sqrt((i + 0.5) / count) * R
    const x = Math.cos(golden) * r
    const y = Math.sin(golden) * r * 0.62
    const z = ((i * 2654435761) % 1000) / 1000 * 2.2 - 1.1 // pseudo-random z
    out.push(new THREE.Vector3(x, y, z - 0.4))
  }
  return out
}

function makeWordTexture(word: string, accent: boolean): { tex: THREE.CanvasTexture; width: number } {
  const height = 128
  const font = '600 64px "Inter", system-ui, sans-serif'
  const measure = document.createElement('canvas').getContext('2d')!
  measure.font = font
  const textWidth = measure.measureText(word).width
  const pad = 28
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(textWidth + pad * 2)
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.font = font
  ctx.textBaseline = 'middle'
  ctx.fillStyle = accent ? '#4f7cff' : '#f2f2f0'
  ctx.fillText(word, pad, height / 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  return { tex, width: (canvas.width / canvas.height) * 0.52 }
}

/**
 * Skill tags as floating 3D planes — gentle drift + cursor repulsion via
 * dampened springs (no physics engine). `pointer-events-none` Canvas means
 * repulsion uses the shared window pointer store. Decorative only: the real
 * skill list lives in the DOM (Skills section).
 */
export default function SkillField() {
  const group = useRef<THREE.Group>(null)
  const { config } = useApp()
  const { camera } = useThree()
  const visible = useSectionVisibility('section-skills')

  const homes = useMemo(() => layoutPositions(skillTags.length), [])
  const [entries, setEntries] = useState<TagEntry[] | null>(null)

  // Build crisp word textures once the webfont is actually loaded.
  useEffect(() => {
    let mounted = true
    async function build() {
      try {
        await document.fonts?.load('600 64px "Inter"')
      } catch {
        /* fall through to whatever font is available */
      }
      const next: TagEntry[] = skillTags.map((word, i) => {
        const { tex, width } = makeWordTexture(word, i % 6 === 0)
        return { word, tex, width, accent: i % 6 === 0 }
      })
      if (mounted) setEntries(next)
    }
    build()
    return () => {
      mounted = false
    }
  }, [])

  const { springs, tick } = useVectorSprings(entries ? entries.length : 0, {
    stiffness: 90,
    damping: 13,
  })

  // Initialise spring anchors once entries exist.
  useEffect(() => {
    if (!entries) return
    springs.current.forEach((s, i) => {
      s.home.copy(homes[i])
      s.target.copy(homes[i])
      s.pos.copy(homes[i])
      s.vel.set(0, 0, 0)
    })
  }, [entries, homes, springs])

  const mouseWorld = useMemo(() => new THREE.Vector3(), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g || !entries) return

    tick()

    // Project the cursor onto the tag plane (z ≈ -0.4) for repulsion.
    if (config.tier === 'high' && !config.reducedMotion) {
      const ndc = new THREE.Vector2(pointer.x, pointer.y)
      ray.setFromCamera(ndc, camera)
      const dir = ray.ray.direction
      const t = (-0.4 - ray.ray.origin.z) / (dir.z || 1e-6)
      mouseWorld.copy(ray.ray.origin).addScaledVector(dir, t)
    }

    const time = state.clock.elapsedTime
    const children = g.children
    for (let i = 0; i < children.length; i++) {
      const s = springs.current[i]
      if (!s) continue

      // Gentle autonomous wander around home
      s.target.set(
        s.home.x + Math.sin(time * 0.32 + i * 1.7) * 0.18,
        s.home.y + Math.cos(time * 0.27 + i * 2.1) * 0.18,
        s.home.z + Math.sin(time * 0.21 + i * 0.9) * 0.12,
      )

      // Cursor repulsion impulse (dampened spring eases it back)
      if (config.tier === 'high' && !config.reducedMotion) {
        const dx = s.pos.x - mouseWorld.x
        const dy = s.pos.y - mouseWorld.y
        const dist = Math.hypot(dx, dy)
        const R = 1.1
        if (dist < R && dist > 1e-4) {
          const falloff = 1 - dist / R
          s.vel.x += (dx / dist) * falloff * 0.06
          s.vel.y += (dy / dist) * falloff * 0.06
        }
      }

      const mesh = children[i] as THREE.Mesh
      mesh.position.copy(s.pos)
      mesh.quaternion.copy(camera.quaternion) // billboard to camera

      // Fade with section
      const mat = mesh.material as THREE.MeshBasicMaterial
      const target = visible.current * 0.95
      mat.opacity += (target - mat.opacity) * Math.min(1, delta * 5)
    }
  })

  if (!entries) return <group ref={group} />

  return (
    <group ref={group}>
      {entries.map((e) => (
        <mesh key={e.word} frustumCulled={false}>
          <planeGeometry args={[e.width, 0.52]} />
          <meshBasicMaterial
            map={e.tex}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
