import type { Customer, Plan, Status } from '@/data/customers'
import { createRng } from '@/lib/random'

export const STATUS_META: Record<Status, { label: string; color: string; text: string }> = {
  active: { label: 'Active', color: 'var(--success)', text: 'text-success' },
  trial: { label: 'Trial', color: 'var(--accent-2)', text: 'text-accent-2' },
  past_due: { label: 'Past due', color: 'var(--warning)', text: 'text-warning' },
  churned: { label: 'Churned', color: 'var(--fg-subtle)', text: 'text-fg-subtle' },
}

export const PLAN_VARIANT: Record<Plan, 'default' | 'cyan' | 'accent' | 'warning'> = {
  Starter: 'default',
  Growth: 'cyan',
  Scale: 'accent',
  Enterprise: 'warning',
}

export const PLAN_BASE_MRR: Record<Plan, number> = { Starter: 49, Growth: 299, Scale: 1200, Enterprise: 6500 }

export const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
  IN: 'India',
  JP: 'Japan',
  BR: 'Brazil',
  CA: 'Canada',
  FR: 'France',
  AU: 'Australia',
  SG: 'Singapore',
}

export const healthColor = (h: number) => (h >= 75 ? 'var(--success)' : h >= 50 ? 'var(--warning)' : 'var(--danger)')
export const healthLabel = (h: number) => (h >= 75 ? 'Healthy' : h >= 50 ? 'Needs attention' : 'At risk')

export const hashId = (s: string) => [...s].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7) >>> 0

/** 12 months of MRR ending at the customer's current MRR. Deterministic per id. */
export function mrrHistory(c: Customer) {
  const rng = createRng(hashId(c.id))
  const now = new Date()
  const peak = c.mrr || PLAN_BASE_MRR[c.plan]
  const churnAt = c.status === 'churned' ? rng.int(8, 10) : 99
  let v = peak * rng.range(0.35, 0.6)
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    v = i === 11 && c.status !== 'churned' ? peak : v + (peak - v) * rng.range(0.12, 0.3) * (rng.bool(0.85) ? 1 : -0.6)
    return {
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      mrr: i >= churnAt ? 0 : Math.round(v),
    }
  })
}

export function healthBreakdown(c: Customer) {
  const rng = createRng(hashId(c.id) + 3)
  const f = (spread: number) => Math.max(4, Math.min(99, Math.round(c.health + rng.range(-spread, spread))))
  return [
    { label: 'Product usage', value: f(14) },
    { label: 'Seat utilization', value: f(20) },
    { label: 'Support sentiment', value: f(10) },
    { label: 'Billing', value: c.status === 'past_due' ? 18 : c.status === 'churned' ? 0 : f(6) },
  ]
}

export type ActivityKind = 'product' | 'team' | 'ai' | 'support' | 'billing'

const ACTIVITY_POOL: { title: string; detail: string; kind: ActivityKind }[] = [
  { title: 'Created dashboard', detail: '“Q4 pipeline health”', kind: 'product' },
  { title: 'Invited teammates', detail: '3 new seats from marketing', kind: 'team' },
  { title: 'Ran an AI query', detail: '“Why did trial conversion drop?”', kind: 'ai' },
  { title: 'Connected a source', detail: 'Stripe · 12,480 charges synced', kind: 'product' },
  { title: 'Opened a support ticket', detail: '#4821 · SSO redirect loop', kind: 'support' },
  { title: 'Exported a report', detail: 'Retention cohorts · CSV', kind: 'product' },
  { title: 'Set up an alert', detail: 'Checkout conversion < 2.5%', kind: 'ai' },
]

export function activityFor(c: Customer) {
  const rng = createRng(hashId(c.id) + 11)
  const picks = [...ACTIVITY_POOL].sort(() => rng.next() - 0.5).slice(0, 4)
  let t = new Date(c.lastActive).getTime()
  const items: { title: string; detail: string; kind: ActivityKind; at: string }[] = picks.map((p) => {
    const at = t
    t -= rng.int(1, 9) * 864e5 + rng.int(0, 86400) * 1e3
    return { ...p, at: new Date(at).toISOString() }
  })
  if (c.status === 'past_due') items.splice(1, 0, { title: 'Payment failed', detail: 'Card ending 0019 declined', kind: 'billing', at: new Date(t).toISOString() })
  items.push({ title: `Signed up on ${c.plan}`, detail: `Joined from ${COUNTRY_NAMES[c.country] ?? c.country}`, kind: 'team', at: c.joined })
  return items
}
