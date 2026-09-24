import { motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const mixc = (c: string, p: number) => `color-mix(in oklab, ${c} ${p}%, transparent)`

const hourLabel = (h: number) => (h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`)

/** Day × hour activity grid. rows: `{ day, hours: number[24] }[]` with values 0–100. */
export function Heatmap({
  rows,
  color = 'var(--accent)',
  unit = 'activity index',
  className,
}: {
  rows: { day: string; hours: number[] }[]
  color?: string
  unit?: string
  className?: string
}) {
  const [hover, setHover] = useState<{ day: string; hour: number; v: number } | null>(null)
  const max = Math.max(...rows.flatMap((r) => r.hours), 1)
  return (
    <div className={className}>
      <div className="mb-3 flex h-5 items-center justify-between gap-4 text-xs">
        <span className="text-fg-subtle tabular-nums">
          {hover ? (
            <>
              <span className="font-medium text-fg">
                {hover.day} {hourLabel(hover.hour)}–{hourLabel((hover.hour + 1) % 24)}
              </span>{' '}
              · {hover.v} {unit}
            </>
          ) : (
            'Hover a cell to inspect'
          )}
        </span>
        <span className="flex items-center gap-1.5 text-fg-subtle">
          Less
          {[10, 30, 55, 80, 100].map((p) => (
            <span key={p} className="size-2.5 rounded-[3px]" style={{ background: `linear-gradient(${mixc(color, p)}, ${mixc(color, p)}), var(--surface-2)` }} />
          ))}
          More
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-none" onMouseLeave={() => setHover(null)}>
        <div className="grid min-w-[560px] grid-cols-[2.25rem_repeat(24,minmax(0,1fr))] gap-[3px]">
          {rows.map((r, ri) => (
            <div key={r.day} className="contents">
              <div className="flex items-center text-[11px] text-fg-subtle">{r.day}</div>
              {r.hours.map((v, h) => {
                const p = Math.round(6 + Math.pow(v / max, 1.4) * 94)
                const on = hover?.day === r.day && hover.hour === h
                return (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: (ri * 24 + h) * 0.0025 + ri * 0.02, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHover({ day: r.day, hour: h, v })}
                    className={cn(
                      'aspect-square rounded-[4px] transition-shadow duration-150',
                      on && 'relative z-10 ring-2 ring-fg/40',
                      hover && (hover.day === r.day || hover.hour === h) && !on && 'ring-1 ring-fg/10',
                    )}
                    style={{ background: `linear-gradient(${mixc(color, p)}, ${mixc(color, p)}), var(--surface-2)` }}
                  />
                )
              })}
            </div>
          ))}
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="pt-1 text-center font-mono text-[10px] text-fg-subtle">
              {h % 3 === 0 ? hourLabel(h) : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
