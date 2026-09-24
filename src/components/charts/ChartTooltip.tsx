import type { ReactNode } from 'react'
import type { TooltipPayloadEntry } from 'recharts'
import { cn } from '@/lib/utils'

export interface ChartTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<TooltipPayloadEntry>
  label?: ReactNode
  /** Formats each series value. */
  format?: (value: number, name: string) => ReactNode
  labelFormat?: (label: ReactNode) => ReactNode
  /** Optional footer, e.g. a delta between the first two series. */
  footer?: (payload: ReadonlyArray<TooltipPayloadEntry>) => ReactNode
  className?: string
}

/** Glass tooltip for recharts: `<Tooltip content={(p) => <ChartTooltip {...p} format={fmt.currency} />} />` */
export function ChartTooltip({ active, payload, label, format, labelFormat, footer, className }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const rows = payload.filter((p) => !p.hide && p.type !== 'none')
  return (
    <div
      className={cn(
        'glass min-w-40 rounded-xl px-3 py-2.5 text-xs shadow-elevated',
        'animate-[pop-in_.18s_var(--ease-out-expo)]',
        className,
      )}
    >
      {label != null && label !== '' && (
        <div className="mb-2 font-medium text-fg">{labelFormat ? labelFormat(label) : label}</div>
      )}
      <div className="space-y-1.5">
        {rows.map((p, i) => {
          const color =
            (p.payload?.color as string | undefined) ??
            [p.color, p.stroke, p.fill].find((c) => c && !c.startsWith('url')) ??
            'var(--accent)'
          const value = typeof p.value === 'number' ? p.value : Number(p.value)
          return (
            <div key={`${String(p.dataKey)}-${i}`} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-fg-muted">
                <span
                  className="size-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklch, ${color} 20%, transparent)` }}
                />
                {p.name}
              </span>
              <span className="font-mono font-medium text-fg tabular-nums">
                {format ? format(value, String(p.name)) : value.toLocaleString('en-US')}
              </span>
            </div>
          )
        })}
      </div>
      {footer && <div className="mt-2 border-t border-border pt-2">{footer(rows)}</div>}
    </div>
  )
}

/** Dashed vertical cursor shared by line/area charts. */
export const chartCursor = { stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '4 4' }
