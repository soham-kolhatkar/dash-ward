import type { ReactNode } from 'react'

interface Entry {
  name?: ReactNode
  value?: unknown
  color?: string
  dataKey?: unknown
  payload?: unknown
}

/** Glassy tooltip body for recharts `content`. */
export function ChartTooltip({
  active,
  payload,
  label,
  format = (v) => String(v),
  hide = [],
}: {
  active?: boolean
  payload?: ReadonlyArray<Entry>
  label?: ReactNode
  format?: (v: number, key: string) => string
  hide?: string[]
}) {
  if (!active || !payload?.length) return null
  const rows = payload.filter((p) => p.value != null && !hide.includes(String(p.dataKey)))
  return (
    <div className="min-w-36 rounded-xl border border-border bg-surface/95 px-3 py-2.5 text-xs shadow-elevated backdrop-blur-xl">
      {label != null && <div className="mb-1.5 font-medium text-fg">{label}</div>}
      <div className="space-y-1">
        {rows.map((p) => (
          <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-fg-muted">
              <span className="size-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="font-mono font-medium text-fg tabular-nums">
              {Array.isArray(p.value)
                ? p.value.map((v) => format(Number(v), String(p.dataKey))).join(' – ')
                : format(Number(p.value), String(p.dataKey))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
