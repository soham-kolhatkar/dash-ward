import type { Kpi } from '@/data/metrics'
import { fmt } from '@/lib/format'

export function formatKpi(format: Kpi['format'], v: number) {
  switch (format) {
    case 'currency':
      return v >= 1e6 ? fmt.currencyCompact(v) : fmt.currency(v)
    case 'number':
      return v >= 1e6 ? fmt.compact(v) : fmt.number(v)
    case 'percent':
      return `${v.toFixed(2)}%`
    case 'duration': {
      const s = Math.max(0, Math.round(v))
      return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
    }
  }
}

export function greeting(d = new Date()) {
  const h = d.getHours()
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
