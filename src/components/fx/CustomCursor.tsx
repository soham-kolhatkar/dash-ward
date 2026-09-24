import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/** Trailing ring cursor that grows over interactive elements. Desktop only. */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduce = usePrefersReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)

  useEffect(() => {
    if (!fine || reduce) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement
      setHover(!!t.closest('a, button, [role="button"], input, [data-cursor="hover"]'))
    }
    const d = () => setDown(true)
    const u = () => setDown(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', d)
    window.addEventListener('pointerup', u)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', d)
      window.removeEventListener('pointerup', u)
    }
  }, [fine, reduce, x, y])

  if (!fine || reduce) return null
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-fg/40 mix-blend-difference"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hover ? 56 : 32, height: hover ? 56 : 32, scale: down ? 0.8 : 1, backgroundColor: hover ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  )
}
