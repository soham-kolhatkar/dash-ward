import { motion } from 'motion/react'
import { TriangleAlert } from 'lucide-react'
import { smoothPath } from '../paths'

const W = 640
const H = 170
const actual = [52, 55, 53, 58, 57, 60, 59, 62, 61, 64, 63, 66, 40, 44, 56, 63, 65, 67, 66, 69]
const upper = actual.map((_, i) => 60 + i * 0.75 + 7)
const lower = actual.map((_, i) => 60 + i * 0.75 - 13)
const A = 12

const line = smoothPath(actual, W, H, 12, 30, 80)
const up = smoothPath(upper, W, H, 12, 30, 80)
const lo = smoothPath(lower, W, H, 12, 30, 80)
const band = `${up.line} L${lo.points[lo.points.length - 1][0]},${lo.points[lo.points.length - 1][1]} ${[...lo.points]
  .reverse()
  .map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`)
  .join(' ')} Z`
const spike = line.points[A]

export function AnomalyWidget() {
  return (
    <div className="flex h-full flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:px-7 sm:pb-7">
      <div className="relative min-h-44 min-w-0 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="anom-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset={String(A / (actual.length - 1) - 0.04)} stopColor="var(--accent)" />
              <stop offset={String(A / (actual.length - 1))} stopColor="var(--danger)" />
              <stop offset={String(A / (actual.length - 1) + 0.08)} stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
          <path d={band} fill="var(--accent)" opacity="0.08" />
          <path d={up.line} fill="none" stroke="var(--accent)" strokeOpacity="0.25" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          <path d={lo.line} fill="none" stroke="var(--accent)" strokeOpacity="0.25" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          <motion.path
            d={line.line}
            fill="none"
            stroke="url(#anom-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-accent-2 to-transparent"
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        />
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(spike[0] / W) * 100}%`, top: `${(spike[1] / H) * 100}%` }}
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-danger" />
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-danger [animation-delay:1.2s]" />
          <span className="relative block size-3.5 rounded-full border-2 border-surface bg-danger" />
        </span>
        <span
          className="absolute top-full mt-1 -translate-x-1/2 font-mono text-[10px] text-fg-subtle"
          style={{ left: `${(spike[0] / W) * 100}%` }}
        >
          Tue 14:02
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0 rounded-2xl border border-danger/25 bg-danger/[0.06] p-4 sm:w-60"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-danger">
          <TriangleAlert className="size-3.5" /> Anomaly · 3.4σ below forecast
        </div>
        <p className="mt-2 text-sm font-medium text-fg">Checkout conversion −38%</p>
        <p className="mt-1 text-xs leading-relaxed text-fg-muted">Isolated to iOS Safari 18.2 after release v4.12. Root cause: hidden postcode validation.</p>
        <div className="mt-3 flex gap-1.5 text-[11px]">
          <span className="rounded-full bg-fg px-2.5 py-1 font-medium text-bg">Open incident</span>
          <span className="rounded-full border border-border px-2.5 py-1 text-fg-muted">Mute</span>
        </div>
      </motion.div>
    </div>
  )
}
