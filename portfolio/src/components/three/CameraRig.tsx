import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

/**
 * The ONE signature 3D interaction: a scroll-driven camera path.
 *
 * A single GSAP timeline (scrubbed by a single ScrollTrigger over the whole
 * page) interpolates camera.position and a look-at target. On low-power /
 * touch / reduced-motion devices there is NO fly-through — just a gentle,
 * ambient orbit — and on the minimal (no-WebGL) tier this component is not
 * mounted at all.
 */
export default function CameraRig() {
  const { camera } = useThree()
  const { config } = useApp()
  const look = useRef(new THREE.Vector3(0, 0, 0))
  const orbit = useRef(0)

  useEffect(() => {
    if (config.tier !== 'high') {
      camera.position.set(0, 0.15, 8)
      return
    }

    camera.position.set(0, 0, 7)
    look.current.set(0, 0, 0)

    const tl = gsap.timeline({ defaults: { ease: 'none', duration: 1 } })

    // — Camera position keyframes (one per section index) —
    tl.to(camera.position, { x: 0, y: 0, z: 7 }, 0) // hero
    tl.to(camera.position, { x: 2.9, y: 0.2, z: 4.4 }, 1) // about → morph left
    tl.to(camera.position, { x: 0, y: 0.5, z: 7.8 }, 2) // skills field
    tl.to(camera.position, { x: 0, y: 0.1, z: 6.6 }, 3) // projects (pass-through)
    tl.to(camera.position, { x: 0, y: 1.8, z: 6.0 }, 4) // timeline (look down)
    tl.to(camera.position, { x: 0, y: 0.15, z: 4.9 }, 5) // contact (close-up)
    tl.to(camera.position, { x: 0, y: 0, z: 7 }, 6) // ease back out

    // — Look-at target keyframes —
    tl.to(look.current, { x: 0, y: 0, z: 0 }, 0)
    tl.to(look.current, { x: -2.6, y: 0, z: 0 }, 1) // morph geometry
    tl.to(look.current, { x: 0, y: 0, z: -0.6 }, 2) // skill word field
    tl.to(look.current, { x: 0, y: 0, z: 0 }, 3)
    tl.to(look.current, { x: 0, y: -0.3, z: 0 }, 4) // timeline tube
    tl.to(look.current, { x: 0, y: 0, z: 0 }, 5)

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      animation: tl,
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [camera, config.tier])

  useFrame((_, delta) => {
    if (config.tier === 'low') {
      // Ambient rotation only — no scroll fly-through on constrained devices.
      orbit.current += delta * 0.06
      const r = 8
      camera.position.set(Math.sin(orbit.current) * r * 0.45, 0.2, Math.cos(orbit.current) * r)
      camera.lookAt(0, 0, 0)
      return
    }
    camera.lookAt(look.current.x, look.current.y, look.current.z)
  })

  return null
}
