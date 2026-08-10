import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import './HeroScene.css'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

function PanelMesh({ pointer, reducedMotion }) {
  const tiltRef = useRef(null)

  useFrame(() => {
    if (!tiltRef.current || reducedMotion) return
    const targetX = pointer.current.y * 0.22
    const targetY = pointer.current.x * 0.32
    tiltRef.current.rotation.x += (targetX - tiltRef.current.rotation.x) * 0.06
    tiltRef.current.rotation.y += (targetY - tiltRef.current.rotation.y) * 0.06
  })

  return (
    <group ref={tiltRef}>
      <Float
        speed={reducedMotion ? 0 : 1.2}
        rotationIntensity={reducedMotion ? 0 : 0.5}
        floatIntensity={reducedMotion ? 0 : 0.7}
      >
        <RoundedBox args={[2.6, 2.6, 0.35]} radius={0.28} smoothness={4}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.2} />
        </RoundedBox>
        <mesh position={[0, 0, 0.34]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial
            color="#dc2626"
            roughness={0.3}
            emissive="#5c0c0c"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  )
}

function Scene({ reducedMotion }) {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function handlePointerMove(e) {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-3, -2, 2]} intensity={1.4} color="#dc2626" />
      <PanelMesh pointer={pointer} reducedMotion={reducedMotion} />
    </>
  )
}

function HeroScene() {
  const [supported, setSupported] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setSupported(hasWebGL())
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (!supported) return null

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

export default HeroScene
