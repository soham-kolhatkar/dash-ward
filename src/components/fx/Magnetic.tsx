import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode, type PointerEvent } from 'react'
import { useFinePointer } from '@/hooks/useMediaQuery'

/** Pulls its child toward the cursor while hovered. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e: PointerEvent) => {
    if (!fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} className={className ?? 'inline-block'}>
      {children}
    </motion.div>
  )
}
