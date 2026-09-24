import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export interface DonutDatum {
  name: string
  value: number
  color: string
}

/** Donut with hover highlight + center readout. Pass `active`/`onActiveChange` to sync with a legend. */
export function Donut({
  data,
  format = (v) => v.toLocaleString('en-US'),
  centerLabel = 'Total',
  size = 200,
  thickness = 22,
  active: activeProp,
  onActiveChange,
  className,
}: {
  data: DonutDatum[]
  format?: (v: number) => ReactNode
  centerLabel?: string
  size?: number
  thickness?: number
  active?: number | null
  onActiveChange?: (i: number | null) => void
  className?: string
}) {
  const [inner, setInner] = useState<number | null>(null)
  const active = activeProp !== undefined ? activeProp : inner
  const setActive = (i: number | null) => (onActiveChange ? onActiveChange(i) : setInner(i))
  const total = data.reduce((a, d) => a + d.value, 0)
  const cur = active != null ? data[active] : null
  const r = size / 2

  return (
    <div className={cn('relative mx-auto', className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: size, height: size }}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={r - thickness}
            outerRadius={r - 2}
            paddingAngle={2.5}
            cornerRadius={6}
            stroke="none"
            startAngle={90}
            endAngle={-270}
            animationDuration={1100}
            animationEasing="ease-out"
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {data.map((d, i) => (
              <Cell
                key={d.name}
                fill={d.color}
                style={{
                  opacity: active == null || active === i ? 1 : 0.28,
                  transition: 'opacity .3s var(--ease-out-expo)',
                  filter: active === i ? `drop-shadow(0 0 10px color-mix(in oklch, ${d.color} 55%, transparent))` : undefined,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={cur?.name ?? 'total'}
            initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-[11px] text-fg-subtle">{cur?.name ?? centerLabel}</div>
            <div className="mt-0.5 font-mono text-2xl font-semibold tracking-tight tabular-nums">
              {format(cur ? cur.value : total)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
