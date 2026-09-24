import { createRng } from '@/lib/random'

export type Range = '7d' | '30d' | '90d' | '12m'

export const RANGES: { value: Range; label: string; points: number; unit: 'day' | 'month' }[] = [
  { value: '7d', label: '7 days', points: 7, unit: 'day' },
  { value: '30d', label: '30 days', points: 30, unit: 'day' },
  { value: '90d', label: '90 days', points: 90, unit: 'day' },
  { value: '12m', label: '12 months', points: 12, unit: 'month' },
]

export interface SeriesPoint {
  date: string
  label: string
  revenue: number
  previous: number
  users: number
  sessions: number
  conversions: number
}

/** Revenue / traffic time series for a range. Deterministic per range. */
export function getSeries(range: Range): SeriesPoint[] {
  const cfg = RANGES.find((r) => r.value === range)!
  const rng = createRng(range.length * 997 + cfg.points)
  const out: SeriesPoint[] = []
  const now = new Date()
  const scale = cfg.unit === 'month' ? 30 : 1
  let rev = 4200 * scale
  let users = 1800 * scale
  for (let i = cfg.points - 1; i >= 0; i--) {
    const d = new Date(now)
    if (cfg.unit === 'day') d.setDate(d.getDate() - i)
    else d.setMonth(d.getMonth() - i)
    const trend = 1 + (cfg.points - i) / (cfg.points * 2.4)
    const wave = 1 + Math.sin((cfg.points - i) / 2.2) * 0.12
    rev = rev * 0.6 + 4200 * scale * trend * wave * rng.range(0.85, 1.15) * 0.4
    users = users * 0.6 + 1800 * scale * trend * wave * rng.range(0.85, 1.15) * 0.4
    out.push({
      date: d.toISOString(),
      label:
        cfg.unit === 'day'
          ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : d.toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.round(rev),
      previous: Math.round(rev * rng.range(0.72, 0.9)),
      users: Math.round(users),
      sessions: Math.round(users * rng.range(1.6, 2.1)),
      conversions: Math.round(users * rng.range(0.028, 0.045)),
    })
  }
  return out
}

export interface Kpi {
  key: string
  label: string
  value: number
  delta: number
  format: 'currency' | 'number' | 'percent' | 'duration'
  spark: number[]
}

export function getKpis(range: Range): Kpi[] {
  const s = getSeries(range)
  const sum = (k: keyof SeriesPoint) => s.reduce((a, p) => a + (p[k] as number), 0)
  const rng = createRng(range.charCodeAt(0) * 31)
  const spark = (k: keyof SeriesPoint) => s.slice(-16).map((p) => p[k] as number)
  return [
    { key: 'revenue', label: 'Revenue', value: sum('revenue'), delta: rng.range(8, 24), format: 'currency', spark: spark('revenue') },
    { key: 'users', label: 'Active users', value: sum('users'), delta: rng.range(4, 16), format: 'number', spark: spark('users') },
    { key: 'conversion', label: 'Conversion rate', value: (sum('conversions') / sum('users')) * 100, delta: rng.range(-3, 6), format: 'percent', spark: spark('conversions') },
    { key: 'session', label: 'Avg. session', value: rng.range(180, 320), delta: -rng.range(1, 5), format: 'duration', spark: spark('sessions').map((v, i) => v * (1 + Math.sin(i) * 0.2)) },
  ]
}

export const CHANNELS = [
  { name: 'Organic search', value: 38, color: 'var(--chart-1)' },
  { name: 'Direct', value: 24, color: 'var(--chart-2)' },
  { name: 'Referral', value: 18, color: 'var(--chart-3)' },
  { name: 'Paid social', value: 12, color: 'var(--chart-4)' },
  { name: 'Email', value: 8, color: 'var(--chart-5)' },
]

export const FUNNEL = [
  { stage: 'Visited', value: 48210 },
  { stage: 'Signed up', value: 12840 },
  { stage: 'Activated', value: 7320 },
  { stage: 'Subscribed', value: 2964 },
  { stage: 'Retained', value: 2145 },
]

export const TOP_PAGES = [
  { path: '/pricing', views: 18420, change: 12.4 },
  { path: '/features/ai-insights', views: 14210, change: 32.1 },
  { path: '/', views: 12980, change: -2.3 },
  { path: '/docs/getting-started', views: 9120, change: 8.7 },
  { path: '/blog/ai-analytics-2026', views: 6540, change: 54.2 },
]

export const COUNTRIES = [
  { name: 'United States', code: 'US', value: 34 },
  { name: 'United Kingdom', code: 'GB', value: 14 },
  { name: 'Germany', code: 'DE', value: 11 },
  { name: 'India', code: 'IN', value: 9 },
  { name: 'Japan', code: 'JP', value: 7 },
  { name: 'Brazil', code: 'BR', value: 5 },
]

/** Retention cohort grid: rows = signup week, cols = weeks since signup (0..n). */
export function getCohorts(weeks = 10) {
  const rng = createRng(7)
  return Array.from({ length: weeks }, (_, r) => {
    const d = new Date()
    d.setDate(d.getDate() - (weeks - r) * 7)
    const size = rng.int(800, 1600)
    const cells = Array.from({ length: weeks - r }, (_, c) =>
      c === 0 ? 100 : Math.max(4, Math.round(100 * Math.pow(0.78, c) * rng.range(0.85, 1.15) + (r / weeks) * 6)),
    )
    return { cohort: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), size, cells }
  })
}

export const EVENTS = [
  { name: 'page_view', count: 1284210, trend: 8.2 },
  { name: 'signup_completed', count: 12840, trend: 14.6 },
  { name: 'checkout_started', count: 6420, trend: 5.1 },
  { name: 'purchase', count: 2964, trend: 11.3 },
  { name: 'feature_used:ai_query', count: 48320, trend: 62.4 },
  { name: 'export_csv', count: 3210, trend: -4.2 },
  { name: 'invite_sent', count: 1890, trend: 22.8 },
]

export const HOURLY_HEATMAP = (() => {
  const rng = createRng(99)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, di) => ({
    day,
    hours: Array.from({ length: 24 }, (_, h) => {
      const work = h >= 9 && h <= 18 ? 1 : 0.35
      const weekend = di >= 5 ? 0.55 : 1
      return Math.round(100 * work * weekend * rng.range(0.5, 1))
    }),
  }))
})()
