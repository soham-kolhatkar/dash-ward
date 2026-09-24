import { motion } from 'motion/react'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface CohortRow {
  cohort: string
  size: number
  cells: number[]
}

const cellBg = (pct: number, color: string) => {
  const c = `color-mix(in oklab, ${color} ${Math.round(4 + Math.pow(pct / 100, 0.85) * 96)}%, transparent)`
  return `linear-gradient(${c}, ${c}), var(--surface-2)`
}

/** Retention triangle: rows = cohorts, cells = % retained per period. `<CohortHeatmap rows={getCohorts()} />` */
export function CohortHeatmap({
  rows,
  periodLabel = 'Week',
  color = 'var(--accent)',
  className,
}: {
  rows: CohortRow[]
  periodLabel?: string
  color?: string
  className?: string
}) {
  const periods = Math.max(...rows.map((r) => r.cells.length))
  const avg = Array.from({ length: periods }, (_, c) => {
    const vals = rows.map((r) => r.cells[c]).filter((v) => v != null)
    return vals.reduce((a, v) => a + v, 0) / vals.length
  })
  return (
    <div className={cn('overflow-x-auto scrollbar-none', className)}>
      <table className="w-full min-w-[640px] border-separate border-spacing-1 text-xs">
        <thead>
          <tr className="text-fg-subtle">
            <th className="w-20 pb-1 text-left font-medium">Cohort</th>
            <th className="w-16 pb-1 text-right font-medium">Users</th>
            {Array.from({ length: periods }, (_, i) => (
              <th key={i} className="pb-1 text-center font-mono font-normal tabular-nums">
                {periodLabel[0]}
                {i}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.045 } } }}>
          <motion.tr
            variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
            className="text-fg-muted"
          >
            <td className="py-1 pr-2 font-medium text-fg">Average</td>
            <td className="pr-2 text-right font-mono tabular-nums">
              {Math.round(rows.reduce((a, r) => a + r.size, 0) / rows.length).toLocaleString('en-US')}
            </td>
            {avg.map((v, i) => (
              <td key={i} className="text-center font-mono font-medium text-fg tabular-nums">
                {Math.round(v)}%
              </td>
            ))}
          </motion.tr>
          {rows.map((r) => (
            <motion.tr
              key={r.cohort}
              variants={{
                hidden: { opacity: 0, x: -12, filter: 'blur(4px)' },
                show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <td className="pr-2 font-medium whitespace-nowrap text-fg-muted">{r.cohort}</td>
              <td className="pr-2 text-right font-mono text-fg-subtle tabular-nums">{r.size.toLocaleString('en-US')}</td>
              {Array.from({ length: periods }, (_, c) => {
                const v = r.cells[c]
                if (v == null) return <td key={c} />
                return (
                  <td key={c} className="p-0">
                    <Tooltip
                      content={
                        <span className="tabular-nums">
                          {r.cohort} · {periodLabel} {c}: <b>{v}%</b> ({Math.round((r.size * v) / 100).toLocaleString('en-US')} users)
                        </span>
                      }
                    >
                      <div
                        className={cn(
                          'flex h-8 min-w-10 items-center justify-center rounded-md font-mono text-[11px] tabular-nums transition duration-200 hover:z-10 hover:scale-110 hover:shadow-elevated hover:ring-2 hover:ring-fg/25',
                          v >= 50 ? 'font-medium text-white' : 'text-fg-muted',
                        )}
                        style={{ background: cellBg(v, color) }}
                      >
                        {v}%
                      </div>
                    </Tooltip>
                  </td>
                )
              })}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  )
}
