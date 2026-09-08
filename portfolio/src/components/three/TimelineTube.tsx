import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { timeline } from '../../data/timeline'
import { useSectionVisibility } from '../../hooks/useSectionVisibility'

gsap.registerPlugin(ScrollTrigger)

/**
 * Timeline section — a curved tube in 3D with milestone markers that light
 * up (emissive intensity) as their matching DOM milestone scrolls past.
 * The DOM list carries the actual content; this is purely decorative.
 */
export default function TimelineTube() {
  const group = useRef<THREE.Group>(null)
  const shellMat = useRef<THREE.MeshStandardMaterial>(null)
  const coreMat = useRef<THREE.MeshBasicMaterial>(null)
  const markers = useRef<(THREE.Mesh | null)[]>([])
  const visible = useSectionVisibility('section-timeline')

  const { curve, tubeGeometry, coreGeometry } = useMemo(() => {
    const pts = [
      new THREE.Vector3(-6.5, -0.5, 0.3),
      new THREE.Vector3(-4.2, 0.4, -0.2),
      new THREE.Vector3(-2.1, -0.35, 0.25),
      new THREE.Vector3(0, 0.45, -0.2),
      new THREE.Vector3(2.1, -0.35, 0.2),
      new THREE.Vector3(4.2, 0.4, -0.15),
      new THREE.Vector3(6.5, -0.5, 0.2),
    ]
    const c = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
    return {
      curve: c,
      tubeGeometry: new THREE.TubeGeometry(c, 220, 0.02, 12, false),
      coreGeometry: new THREE.TubeGeometry(c, 220, 0.006, 8, false),
    }
  }, [])

  // Marker world positions (evenly spaced along the curve)
  const markerData = useMemo(() => {
    return timeline.map((m, i) => {
      const t = (i + 0.5) / timeline.length
      return { id: m.id, position: curve.getPointAt(t) }
    })
  }, [curve])

  // One ScrollTrigger per milestone → emissive + scale reaction.
  useEffect(() => {
    const triggers = timeline.map((m, i) => {
      const el = document.getElementById(`timeline-${m.id}`)
      const mesh = markers.current[i]
      if (!el || !mesh) return null
      const mat = mesh.material as THREE.MeshStandardMaterial
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        end: 'top 40%',
        scrub: true,
        onUpdate: (self) => {
          const p = THREE.MathUtils.clamp(self.progress, 0, 1)
          mat.emissiveIntensity = 0.15 + p * 2.2
          mesh.scale.setScalar(0.7 + p * 0.55)
        },
      })
    })
    return () => triggers.forEach((t) => t && t.kill())
  }, [markerData])

  useFrame((state, delta) => {
    const target = visible.current
    if (shellMat.current) {
      shellMat.current.opacity += (target - shellMat.current.opacity) * Math.min(1, delta * 5)
      shellMat.current.transparent = shellMat.current.opacity < 0.999
    }
    if (coreMat.current) {
      const pulse = 0.5 + 0.2 * Math.sin(state.clock.elapsedTime * 1.4)
      coreMat.current.opacity += (target * pulse - coreMat.current.opacity) * Math.min(1, delta * 5)
      coreMat.current.transparent = true
    }
    // Markers share the section fade
    for (const mesh of markers.current) {
      if (!mesh) continue
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity += (target - mat.opacity) * Math.min(1, delta * 5)
      mat.transparent = mat.opacity < 0.999
    }
  })

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* Faint outer shell */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          ref={shellMat}
          color="#0a0a0a"
          emissive="#4f7cff"
          emissiveIntensity={0.25}
          roughness={0.35}
          metalness={0.3}
          transparent
          opacity={0}
        />
      </mesh>
      {/* Bright accent core */}
      <mesh geometry={coreGeometry}>
        <meshBasicMaterial
          ref={coreMat}
          color="#4f7cff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Milestone markers */}
      {markerData.map((m, i) => (
        <mesh
          key={m.id}
          ref={(el) => {
            markers.current[i] = el
          }}
          position={m.position}
          scale={0.7}
        >
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshStandardMaterial
            color="#0a0a0a"
            emissive="#4f7cff"
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.4}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}
