import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useApp } from '../../context/AppContext'
import { useSectionVisibility } from '../../hooks/useSectionVisibility'
import { pointer } from '../../lib/pointer'

/**
 * Contact section — one small 3D accent object (a glowing wireframe
 * icosahedron). Restrained on purpose: the big CTA typography leads.
 */
export default function ContactAccent() {
  const group = useRef<THREE.Group>(null)
  const wireMat = useRef<THREE.MeshBasicMaterial>(null)
  const coreMat = useRef<THREE.MeshStandardMaterial>(null)
  const { config } = useApp()
  const visible = useSectionVisibility('section-contact')

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (!config.reducedMotion) {
      g.rotation.y += delta * 0.25
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.y * 0.25, Math.min(1, delta * 4))
    }
    const target = visible.current
    if (wireMat.current) {
      wireMat.current.opacity += (target * 0.5 - wireMat.current.opacity) * Math.min(1, delta * 5)
    }
    if (coreMat.current) {
      const s = 0.9 + Math.sin(state.clock.elapsedTime * 2) * 0.08
      coreMat.current.emissiveIntensity += (s - coreMat.current.emissiveIntensity) * Math.min(1, delta * 5)
      coreMat.current.opacity += (target * 0.35 - coreMat.current.opacity) * Math.min(1, delta * 5)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]} scale={0.85}>
      <mesh>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial
          ref={wireMat}
          color="#4f7cff"
          wireframe
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={0.45}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          ref={coreMat}
          color="#0a0a0a"
          emissive="#4f7cff"
          emissiveIntensity={0.9}
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  )
}
