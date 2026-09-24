import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { NumberTicker } from '@/components/fx'
import { useLiveSeries } from '@/hooks/useLiveSeries'
import { smoothPath } from '../paths'

const W = 320
const H = 120

export function LiveStreamWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const data = useLiveSeries({ size: 28, interval: 1200, base: 1200, volatility: 0.09, paused: !inView })
  const values = data.map((d) => d.v)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = Math.max(200, hi - lo)
  const p = smoothPath(values, W, H, 10, lo - span * 0.25, hi + span * 0.15)
  const last = p.points[p.points.length - 1]
  const current = values[values.length - 1]
  const prev = values[values.length - 2]
  const up = current >= prev

  return (
    <div ref={ref} className="flex h-full flex-col justify-end">
      <div className="flex items-end justify-between px-6 sm:px-7">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-fg-subtle uppercase">Events / sec</p>
          <NumberTicker value={current} startOnView={false} duration={0.9} className="text-3xl font-semibold tracking-tight" />
        </div>
        <span
          className={
            up
              ? 'rounded-full bg-success/12 px-2 py-0.5 text-xs font-medium text-success'
              : 'rounded-full bg-accent-4/12 px-2 py-0.5 text-xs font-medium text-accent-4'
          }
        >
          {up ? '▲' : '▼'} {Math.abs(((current - prev) / prev) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="relative mt-4 h-32 w-full">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="live-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="live-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="var(--accent-2)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <motion.path initial={{ d: p.area }} animate={{ d: p.area }} transition={{ duration: 0.9, ease: 'easeInOut' }} fill="url(#live-fill)" />
          <motion.path
            initial={{ d: p.line }}
            animate={{ d: p.line }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            fill="none"
            stroke="url(#live-stroke)"
            strokeWidth="2.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <motion.span
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          animate={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
        </motion.span>
      </div>
    </div>
  )
}
