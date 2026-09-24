import createGlobe, { type Marker, type Arc } from 'cobe'
import { useEffect, useRef } from 'react'
import { useTheme } from '@/store/theme'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

export const GLOBE_MARKERS: Marker[] = [
  { location: [37.77, -122.42], size: 0.07 },
  { location: [40.71, -74.01], size: 0.09 },
  { location: [51.51, -0.13], size: 0.08 },
  { location: [48.86, 2.35], size: 0.05 },
  { location: [52.52, 13.4], size: 0.05 },
  { location: [35.68, 139.69], size: 0.08 },
  { location: [19.08, 72.88], size: 0.07 },
  { location: [1.35, 103.82], size: 0.05 },
  { location: [-33.87, 151.21], size: 0.05 },
  { location: [-23.55, -46.63], size: 0.06 },
  { location: [43.65, -79.38], size: 0.04 },
  { location: [25.2, 55.27], size: 0.04 },
]

const ARCS: Arc[] = [
  { from: [37.77, -122.42], to: [51.51, -0.13] },
  { from: [40.71, -74.01], to: [19.08, 72.88] },
  { from: [51.51, -0.13], to: [35.68, 139.69] },
  { from: [-23.55, -46.63], to: [40.71, -74.01] },
  { from: [1.35, 103.82], to: [-33.87, 151.21] },
]

/** Interactive WebGL globe (drag to spin). Fills its parent's width, square aspect. */
export function Globe({ className, speed = 0.003 }: { className?: string; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<{ x: number; delta: number } | null>(null)
  const dark = useTheme((s) => s.resolved) === 'dark'
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let phi = 0.6
    let velocity = 0
    let width = canvas.offsetWidth
    const dpr = Math.min(window.devicePixelRatio, 2)
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi,
      theta: 0.25,
      dark: dark ? 1 : 0,
      diffuse: dark ? 1.4 : 1.1,
      mapSamples: 16000,
      mapBrightness: dark ? 5 : 8,
      mapBaseBrightness: dark ? 0 : 0.05,
      baseColor: dark ? [0.18, 0.16, 0.26] : [1, 1, 1],
      markerColor: dark ? [0.55, 0.95, 0.35] : [0.45, 0.2, 0.95],
      glowColor: dark ? [0.35, 0.25, 0.7] : [0.92, 0.9, 1],
      markers: GLOBE_MARKERS,
      arcs: ARCS,
      arcColor: dark ? [0.45, 0.85, 1] : [0.45, 0.25, 0.95],
      arcWidth: 0.6,
      arcHeight: 0.35,
      markerElevation: 0.02,
    })

    let raf = 0
    let visible = true
    const loop = () => {
      if (!pointer.current) phi += reduce ? 0 : speed
      phi += velocity
      velocity *= 0.92
      globe.update({ phi, width: width * dpr, height: width * dpr })
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    loop()
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) loop()
    })
    io.observe(canvas)
    const ro = new ResizeObserver(() => (width = canvas.offsetWidth))
    ro.observe(canvas)
    requestAnimationFrame(() => (canvas.style.opacity = '1'))

    const down = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, delta: 0 }
      canvas.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!pointer.current) return
      const dx = e.clientX - pointer.current.x
      pointer.current.x = e.clientX
      velocity = dx / 300
    }
    const up = () => {
      pointer.current = null
      canvas.style.cursor = 'grab'
    }
    canvas.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      globe.destroy()
      canvas.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dark, reduce, speed])

  return (
    <div className={cn('relative aspect-square w-full', className)}>
      <canvas
        ref={canvasRef}
        className="size-full cursor-grab opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
      />
    </div>
  )
}

export default Globe
