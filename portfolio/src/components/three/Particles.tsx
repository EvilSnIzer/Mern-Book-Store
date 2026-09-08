import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useApp } from '../../context/AppContext'
import { pointer } from '../../lib/pointer'

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uStrength;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aRandom;
  attribute float aScale;

  varying float vRandom;

  void main() {
    vRandom = aRandom;
    vec3 p = position;

    // Gentle autonomous drift (frozen when uStrength == 0 for reduced motion)
    float t = uTime * 0.09;
    p.x += sin(t + aRandom * 6.28318) * 0.20 * uStrength;
    p.y += cos(t * 0.9 + aRandom * 6.28318) * 0.20 * uStrength;
    p.z += sin(t * 1.35 + aRandom * 6.28318) * 0.20 * uStrength;

    // Cursor parallax — nearer points move more
    float depth = clamp((p.z + 7.0) / 12.0, 0.0, 1.0);
    p.x += uMouse.x * depth * 0.45 * uStrength;
    p.y += uMouse.y * depth * 0.45 * uStrength;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;

  varying float vRandom;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.02, d);
    // Per-particle twinkle (frozen visually when time is not advancing)
    float tw = 0.72 + 0.28 * sin(uTime * 0.7 + vRandom * 6.28318);
    gl_FragColor = vec4(uColor * tw, a * uOpacity);
  }
`

interface ParticlesProps {
  count: number
}

export default function Particles({ count }: ParticlesProps) {
  const { config } = useApp()
  const material = useRef<THREE.ShaderMaterial>(null)

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const aRandom = new Float32Array(count)
    const aScale = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Flattened sphere shell distribution
      const r = 3.6 + Math.pow(Math.random(), 0.6) * 4.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
      positions[i * 3 + 2] = r * Math.cos(phi) - 1.2
      aRandom[i] = Math.random()
      aScale[i] = 0.5 + Math.random() * 1.6
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1))
    geo.setAttribute('aScale', new THREE.BufferAttribute(aScale, 1))

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uStrength: { value: config.reducedMotion ? 0 : 1 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: 0.02 },
      uColor: { value: new THREE.Color('#f2f2f0') },
      uOpacity: { value: 0.85 },
    }

    return { geometry: geo, uniforms }
  }, [count, config.reducedMotion])

  useFrame((state, delta) => {
    if (!material.current) return
    const u = material.current.uniforms
    u.uTime.value = state.clock.elapsedTime
    // Smooth the cursor toward the shared pointer state
    const target = config.reducedMotion ? { x: 0, y: 0 } : pointer
    u.uMouse.value.x += (target.x - u.uMouse.value.x) * Math.min(1, delta * 3)
    u.uMouse.value.y += (target.y - u.uMouse.value.y) * Math.min(1, delta * 3)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
