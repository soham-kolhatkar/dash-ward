import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '@/store/theme'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { Orb, type ScenePalette } from './Orb'
import { Particles } from './Particles'

let probe: CanvasRenderingContext2D | null = null

/** Resolves a CSS custom property (any color syntax, incl. oklch) to a three.js Color. */
function cssColor(name: string) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!probe) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    probe = c.getContext('2d', { willReadFrequently: true })
  }
  const color = new THREE.Color('#8b5cf6')
  if (!probe || !raw) return color
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = '#000'
  probe.fillStyle = raw
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
  return color.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace)
}

function Rig({ children, pointerRef }: { children: ReactNode; pointerRef: RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    const g = group.current
    const p = pointerRef.current
    if (!g || !p) return
    const fit = Math.min(1, state.viewport.aspect * 1.2)
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, fit, 0.1))
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p.x * 0.28, 0.045)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -p.y * 0.18, 0.045)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, p.x * 0.35, 0.04)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, p.y * 0.25, 0.04)
    state.camera.lookAt(0, 0, 0)
  })
  return <group ref={group}>{children}</group>
}

/** Iridescent noise orb + drifting particle field. Default export so it can be lazy-loaded. */
export default function HeroScene({ className, onReady }: { className?: string; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const resolved = useTheme((s) => s.resolved)
  const mobile = useIsMobile()

  const palette = useMemo<ScenePalette>(
    () => ({
      a: cssColor('--accent'),
      b: cssColor('--accent-2'),
      c: cssColor('--accent-3'),
      dark: resolved === 'dark',
    }),
    [resolved],
  )

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
    }
    onScroll()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      ref={wrap}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] ease-out-expo', ready ? 'opacity-100' : 'opacity-0', className)}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          requestAnimationFrame(() => {
            setReady(true)
            onReady?.()
          })
        }}
      >
        <Rig pointerRef={pointer}>
          <Orb palette={palette} detail={mobile ? 40 : 64} scrollRef={scroll} offsetY={mobile ? -1.85 : 0.42} />
          <Particles count={mobile ? 900 : 2600} palette={palette} pointerRef={pointer} scrollRef={scroll} />
        </Rig>
      </Canvas>
    </div>
  )
}
