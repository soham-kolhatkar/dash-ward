import { createRng } from '@/lib/random'

const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString()

export interface Insight {
  id: string
  kind: 'anomaly' | 'opportunity' | 'forecast' | 'trend'
  title: string
  body: string
  impact: string
}

export const INSIGHTS: Insight[] = [
  {
    id: 'i1',
    kind: 'anomaly',
    title: 'Checkout drop-off spiked on mobile Safari',
    body: 'Abandonment on step 2 rose 38% since Tuesday’s release. 92% of the affected sessions hit a hidden validation error on the postcode field. Fixing it should recover about $14.2k MRR a month.',
    impact: '+$14.2k MRR',
  },
  {
    id: 'i2',
    kind: 'opportunity',
    title: 'Teams that use AI Queries retain 2.4× better',
    body: 'Workspaces that run 3 or more AI queries in their first week have 81% 90-day retention, against 34% for those that don’t. Adding a guided query to onboarding could lift activation by about 18%.',
    impact: '+18% activation',
  },
  {
    id: 'i3',
    kind: 'forecast',
    title: 'Q4 revenue is on track to beat target by 12%',
    body: 'The current run-rate and pipeline put Q4 at $2.84M (±4%). Growth-plan expansion is the main driver, with seat growth accelerating 22% quarter over quarter.',
    impact: '$2.84M projected',
  },
  {
    id: 'i4',
    kind: 'trend',
    title: 'Organic traffic from AI search engines up 3×',
    body: 'Referrals from AI assistants grew from 4% to 13% of new signups in 60 days. Those visitors convert 1.7× better than paid social.',
    impact: '13% of signups',
  },
]

export interface Activity {
  id: string
  who: string
  action: string
  target: string
  time: string
  kind: 'upgrade' | 'signup' | 'alert' | 'comment' | 'deploy' | 'payment'
}

export const ACTIVITY: Activity[] = [
  { id: 'a1', who: 'Maya Patel', action: 'upgraded to', target: 'Scale', time: ago(2), kind: 'upgrade' },
  { id: 'a2', who: 'Dashward AI', action: 'detected an anomaly in', target: 'Checkout funnel', time: ago(9), kind: 'alert' },
  { id: 'a3', who: 'Kenji Tanaka', action: 'signed up from', target: 'Product Hunt', time: ago(21), kind: 'signup' },
  { id: 'a4', who: 'Lucas Rossi', action: 'paid invoice', target: '#INV-2041', time: ago(48), kind: 'payment' },
  { id: 'a5', who: 'Zara Okafor', action: 'commented on', target: 'Q4 Revenue board', time: ago(95), kind: 'comment' },
  { id: 'a6', who: 'Felix Berg', action: 'shipped tracking plan', target: 'v2.3', time: ago(180), kind: 'deploy' },
  { id: 'a7', who: 'Priya Singh', action: 'upgraded to', target: 'Enterprise', time: ago(320), kind: 'upgrade' },
]

export interface Notification {
  id: string
  title: string
  body: string
  time: string
  unread: boolean
  kind: 'alert' | 'success' | 'info'
}

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Anomaly detected', body: 'Checkout conversion is down 38% on iOS Safari.', time: ago(9), unread: true, kind: 'alert' },
  { id: 'n2', title: 'Weekly report ready', body: 'Your Monday digest has 4 new insights.', time: ago(120), unread: true, kind: 'info' },
  { id: 'n3', title: 'Goal reached', body: 'MRR passed $250k 🎉', time: ago(60 * 26), unread: false, kind: 'success' },
  { id: 'n4', title: 'Stripe sync complete', body: 'Imported 12,480 transactions.', time: ago(60 * 50), unread: false, kind: 'info' },
]

export interface Message {
  id: string
  from: string
  email: string
  subject: string
  preview: string
  body: string
  time: string
  unread: boolean
  starred: boolean
  label: 'report' | 'alert' | 'team' | 'billing'
}

export const MESSAGES: Message[] = (() => {
  const base: Omit<Message, 'id' | 'time' | 'unread' | 'starred'>[] = [
    { from: 'Dashward AI', email: 'ai@dashward.io', subject: 'Your weekly insights digest', preview: '4 new insights this week, including a checkout anomaly worth $14k MRR…', body: 'Hi Ava,\n\nHere’s what changed in your data this week:\n\n• Checkout drop-off on mobile Safari rose 38%. We traced it to a postcode validation error.\n• Workspaces that use AI Queries retain 2.4× better. Consider adding one to onboarding.\n• Q4 is on track to beat target by 12%.\n• Traffic from AI search engines tripled.\n\nOpen the Insights board to dig in.\n\n— Dashward AI', label: 'report' },
    { from: 'Maya Patel', email: 'maya@northwind.io', subject: 'Re: Q4 revenue board', preview: 'Love the new cohort view! Could we split it by acquisition channel?', body: 'Hey Ava,\n\nLove the new cohort view! Could we split it by acquisition channel? I’d like to bring it to Thursday’s leadership sync.\n\nThanks!\nMaya', label: 'team' },
    { from: 'Alerts', email: 'alerts@dashward.io', subject: '⚠️ Conversion rate below threshold', preview: 'Conversion fell to 2.1% (threshold 2.5%) for the segment “Mobile / Safari”…', body: 'Monitor “Checkout conversion” fired.\n\nCurrent: 2.1%\nThreshold: 2.5%\nSegment: Mobile / Safari\n\nView the incident in Dashward.', label: 'alert' },
    { from: 'Billing', email: 'billing@dashward.io', subject: 'Invoice #INV-2041 paid', preview: 'Thanks! We received your payment of $2,400.00 for the Scale plan.', body: 'Thanks! We received your payment of $2,400.00 for the Scale plan (Sep 2026).\n\nYou can download the receipt from Billing.', label: 'billing' },
    { from: 'Kenji Tanaka', email: 'kenji@orbital.dev', subject: 'Tracking plan v2.3 review', preview: 'I added the new onboarding events. Can you sanity-check the naming?', body: 'Hi!\n\nI added the new onboarding events (onboarding_step_viewed, onboarding_completed). Can you sanity-check the naming before we ship?\n\nKenji', label: 'team' },
    { from: 'Dashward AI', email: 'ai@dashward.io', subject: 'Forecast updated: Q4 2026', preview: 'Projected revenue $2.84M (±4%), up from $2.61M last week.', body: 'Your Q4 forecast was updated.\n\nProjected: $2.84M (±4%)\nPrevious: $2.61M\nMain driver: Growth-plan seat expansion (+22% QoQ).', label: 'report' },
    { from: 'Zara Okafor', email: 'zara@halcyon.co', subject: 'Dashboard for the board meeting', preview: 'Could you share a read-only link to the executive overview?', body: 'Hi Ava — could you share a read-only link to the executive overview? The board meets on Friday.\n\nZara', label: 'team' },
  ]
  const rng = createRng(11)
  let t = 5
  return base.map((m, i) => {
    t += rng.int(20, 400)
    return { ...m, id: `m${i}`, time: ago(t), unread: i < 3, starred: rng.bool(0.3) }
  })
})()

export const INVOICES = Array.from({ length: 8 }, (_, i) => {
  const d = new Date()
  d.setMonth(d.getMonth() - i)
  return {
    id: `INV-${2041 - i}`,
    date: d.toISOString(),
    amount: i < 3 ? 2400 : i < 6 ? 1200 : 480,
    status: i === 0 ? ('due' as const) : ('paid' as const),
    plan: i < 3 ? 'Scale' : i < 6 ? 'Growth' : 'Starter',
  }
})

export const TEAM = [
  { name: 'Ava Chen', email: 'ava@northwind.io', role: 'Owner' },
  { name: 'Maya Patel', email: 'maya@northwind.io', role: 'Admin' },
  { name: 'Kenji Tanaka', email: 'kenji@northwind.io', role: 'Editor' },
  { name: 'Lucas Rossi', email: 'lucas@northwind.io', role: 'Viewer' },
]
