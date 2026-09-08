import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, useTexture } from '@react-three/drei'
import { useApp } from '../../context/AppContext'
import { installPointerTracker } from '../../lib/pointer'
import { projects } from '../../data/projects'
import CameraRig from './CameraRig'
import Particles from './Particles'
import MorphGeometry from './MorphGeometry'
import SkillField from './SkillField'
import TimelineTube from './TimelineTube'
import ContactAccent from './ContactAccent'

installPointerTracker()

/** If the 3D layer ever throws (driver/asset issue), drop it — never white-screen the DOM. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * Preloads the project cover images through THREE's loading manager so the
 * preloader's `useProgress` reflects REAL asset loading. The textures are
 * discarded (the DOM <img> elements re-use the browser cache).
 */
function CoverPreloader() {
  useTexture(projects.map((p) => p.cover))
  return null
}

/**
 * The single fixed WebGL layer behind all DOM content. It is decorative:
 * `pointer-events-none` + `aria-hidden` so every piece of real content is
 * read/selected from the DOM, never from the canvas.
 */
export default function Scene() {
  const { config } = useApp()

  // No WebGL (or forced minimal tier) — render nothing; DOM sections stand alone.
  if (config.tier === 'minimal') return null

  const isHigh = config.tier === 'high'

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={config.dpr}
        camera={{ fov: 45, near: 0.1, far: 140, position: [0, 0, 7] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <CameraRig />
            {/* Particle backdrop is shared across the whole scroll (continuous scene) */}
            <Particles count={isHigh ? 3200 : 1200} />
            <MorphGeometry />
            <SkillField />
            <TimelineTube />
            <ContactAccent />
            <CoverPreloader />
            {/* Warm up shaders/geometry once everything is loaded */}
            <Preload all />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
    </div>
  )
}
