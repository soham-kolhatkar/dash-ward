import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Counts up to `value` when scrolled into view, and re-animates when `value` changes. */
export function NumberTicker({
  value,
  format = (n) => Math.round(n).toLocaleString('en-US'),
  duration = 1.6,
  className,
  startOnView = true,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
  startOnView?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(format(0))
  useMotionValueEvent(mv, 'change', (v) => setDisplay(format(v)))

  useEffect(() => {
    if (startOnView && !inView) return
    if (reduce) {
      mv.set(value)
      return
    }
    const c = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [value, inView, startOnView, duration, mv, reduce])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {display}
    </span>
  )
}
