import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../context/AppContext'
import { useSectionVisibility } from '../../hooks/useSectionVisibility'

gsap.registerPlugin(ScrollTrigger)

// Compact 3D simplex noise (Ashima / Ian McEwan, MIT) — GLSL
const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;

  varying float vDisp;
  varying vec3 vPosW;
  varying vec3 vNormalW;

  ${SNOISE}

  float displacement(vec3 p) {
    float n1 = snoise(p * 0.9 + uTime * 0.16);
    float n2 = snoise(p * 2.2 - uTime * 0.10);
    float n3 = snoise(p * 4.0 + uTime * 0.06);
    return (n1 * 0.55 + n2 * 0.25 + n3 * 0.12) * uProgress * 0.55;
  }

  void main() {
    float d = displacement(position);
    vec3 displaced = position + normal * d;

    // Cheap displaced normal via finite differences
    float e = 0.02;
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 p0 = position + normal * d;
    vec3 p1 = position + tangent * e + normal * displacement(position + tangent * e);
    vec3 p2 = position + bitangent * e + normal * displacement(position + bitangent * e);
    vec3 n = normalize(cross(p1 - p0, p2 - p0));

    vDisp = d;
    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uProgress;
  uniform float uOpacity;

  varying float vDisp;
  varying vec3 vPosW;
  varying vec3 vNormalW;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vPosW);
    vec3 L = normalize(vec3(0.55, 0.85, 0.5));

    float ndl = max(dot(N, L), 0.0);
    float fres = pow(1.0 - abs(dot(N, V)), 2.2);

    vec3 col = uColor * (0.30 + ndl * 0.55);
    col += uAccent * fres * (0.22 + 0.5 * uProgress); // rim grows as it morphs
    col += uAccent * (vDisp * 0.5 + 0.5) * 0.10;

    gl_FragColor = vec4(col, uOpacity);
  }
`

/**
 * The About-section centrepiece: a TorusKnot whose surface morphs toward an
 * organic, neural-looking form (vertex-shader noise displacement) as the
 * user scrolls through the section. Scroll → uProgress via ScrollTrigger.
 */
export default function MorphGeometry() {
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const { config } = useApp()
  const visible = useSectionVisibility('section-about')

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.TorusKnotGeometry(1.05, 0.34, 220, 36)
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color('#141414') },
      uAccent: { value: new THREE.Color('#4f7cff') },
      uOpacity: { value: 0 },
    }
    return { geometry: geo, uniforms }
  }, [])

  useEffect(() => {
    const el = document.getElementById('section-about')
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        uniforms.uProgress.value = THREE.MathUtils.clamp(self.progress, 0, 1)
      },
    })
    return () => st.kill()
  }, [uniforms])

  useFrame((state, delta) => {
    if (!group.current || !material.current) return
    if (!config.reducedMotion) {
      group.current.rotation.y += delta * 0.12
      uniforms.uTime.value = state.clock.elapsedTime
    }
    // Fade in/out with the section
    const current = material.current.uniforms.uOpacity.value
    const next = current + (visible.current - current) * Math.min(1, delta * 5)
    material.current.uniforms.uOpacity.value = next
    material.current.transparent = next < 0.999
  })

  return (
    <group ref={group} position={[-2.6, 0, 0]}>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
        />
      </mesh>
    </group>
  )
}
