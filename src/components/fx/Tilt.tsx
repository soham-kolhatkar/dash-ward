import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { ReactNode, PointerEvent } from 'react'
import { useFinePointer } from '@/hooks/useMediaQuery'

export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const fine = useFinePointer()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 18 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={() => {
          px.set(0.5)
          py.set(0.5)
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
