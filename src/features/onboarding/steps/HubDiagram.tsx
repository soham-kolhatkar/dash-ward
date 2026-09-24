import { AnimatePresence, motion } from 'motion/react'
import { LogoMark } from '@/components/ui/logo'
import { INTEGRATIONS } from '@/data/integrations'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'

const W = 640
const H = 260
const CX = W / 2
const CY = H / 2
const HUB_R = 46
const NODE = 40

/** Four sources per side on a gentle outward arc. */
const NODES = INTEGRATIONS.map((it, i) => {
  const side = i % 2 === 0 ? -1 : 1
  const row = Math.floor(i / 2)
  const y = 36 + row * 62.7
  const bulge = Math.abs(y - CY) / (CY - 36)
  const x = side < 0 ? 44 + bulge * 46 : W - 44 - bulge * 46
  const hx = CX + side * HUB_R
  const mid = (x + hx) / 2
  const start = x - side * (NODE / 2)
  const d = `M ${start} ${y} C ${mid} ${y}, ${mid} ${CY}, ${hx} ${CY}`
  return { ...it, x, y, d, side }
})

export function HubDiagram({ connected, pending }: { connected: string[]; pending: string[] }) {
  const reduce = usePrefersReducedMotion()
  return (
    <div className="relative mx-auto aspect-[640/260] w-full max-w-3xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          {NODES.map((n) => (
            <linearGradient key={n.id} id={`hub-g-${n.id}`} gradientUnits="userSpaceOnUse" x1={n.x} y1={n.y} x2={CX} y2={CY}>
              <stop offset="0" stopColor={n.color} />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          ))}
          <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {NODES.map((n) => {
          const on = connected.includes(n.id)
          const busy = pending.includes(n.id)
          return (
            <g key={n.id}>
              <path d={n.d} fill="none" stroke="var(--border-strong)" strokeWidth="1.25" strokeDasharray="3 5" />
              {busy && (
                <motion.path
                  d={n.d}
                  fill="none"
                  stroke={`url(#hub-g-${n.id})`}
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={{ strokeDashoffset: -56, opacity: 0.8 }}
                  transition={{ strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.2 } }}
                />
              )}
              <AnimatePresence>
                {on && (
                  <motion.g key="live" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <motion.path
                      d={n.d}
                      fill="none"
                      stroke={`url(#hub-g-${n.id})`}
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity=".35"
                      filter="url(#hub-glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: ease.outExpo }}
                    />
                    <motion.path
                      d={n.d}
                      fill="none"
                      stroke={`url(#hub-g-${n.id})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: ease.outExpo }}
                    />
                    {!reduce && (
                      <circle r="3.5" fill="white" stroke={n.color} strokeWidth="2">
                        <animateMotion dur="1.9s" repeatCount="indefinite" path={n.d} begin="0.8s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
                      </circle>
                    )}
                  </motion.g>
                )}
              </AnimatePresence>

              <motion.g
                initial={false}
                animate={{ scale: on ? 1.08 : 1, opacity: on || busy ? 1 : 0.55 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: 'view-box' }}
              >
                {on && <rect x={n.x - NODE / 2 - 5} y={n.y - NODE / 2 - 5} width={NODE + 10} height={NODE + 10} rx="16" fill={n.color} opacity=".25" filter="url(#hub-glow)" />}
                <rect
                  x={n.x - NODE / 2}
                  y={n.y - NODE / 2}
                  width={NODE}
                  height={NODE}
                  rx="12"
                  fill={on ? n.color : 'var(--surface)'}
                  stroke={on ? 'transparent' : 'var(--border-strong)'}
                  style={{ transition: 'fill .4s' }}
                />
                <text
                  x={n.x}
                  y={n.y + 4.5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill={on ? 'white' : 'var(--fg-muted)'}
                  style={{ fontFamily: 'var(--font-sans)', transition: 'fill .4s' }}
                >
                  {n.glyph}
                </text>
              </motion.g>
            </g>
          )
        })}
      </svg>

      {/* Hub */}
      <div className="absolute top-1/2 left-1/2 aspect-square w-[14.4%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex size-full items-center justify-center">
          {connected.length > 0 && !reduce && (
            <>
              <span className="absolute inset-0 animate-pulse-ring rounded-[28%] border border-accent/50" />
              <span className="absolute inset-0 animate-pulse-ring rounded-[28%] border border-accent-2/40 [animation-delay:1.2s]" />
            </>
          )}
          <motion.div
            animate={{ scale: connected.length ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 0.5 }}
            key={connected.length}
            className="relative size-full rounded-[28%] shadow-glow"
          >
            <LogoMark className="size-full" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
