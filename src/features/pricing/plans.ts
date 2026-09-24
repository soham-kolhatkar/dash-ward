export interface PlanTier {
  id: 'starter' | 'growth' | 'scale'
  name: string
  tagline: string
  monthly: number
  yearly: number // per month, billed yearly
  featured?: boolean
  cta: string
  features: string[]
}

export const PLANS: PlanTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For founders who want answers, not spreadsheets.',
    monthly: 29,
    yearly: 24,
    cta: 'Start free',
    features: ['Up to 100k events/mo', '3 data sources', '50 AI queries/mo', '7-day history', 'Community support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For teams that ship fast and measure everything.',
    monthly: 199,
    yearly: 159,
    featured: true,
    cta: 'Start 14-day trial',
    features: ['Up to 5M events/mo', 'Unlimited data sources', 'Unlimited AI queries', 'Anomaly alerts', '2-year history', 'Slack and email digests'],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For companies with serious data and compliance needs.',
    monthly: 799,
    yearly: 649,
    cta: 'Talk to sales',
    features: ['Unlimited events', 'Warehouse-native mode', 'SSO / SAML and SCIM', 'Custom AI models', 'Unlimited history', 'Dedicated success manager'],
  },
]

export const COMPARISON: { group: string; rows: { label: string; values: (string | boolean)[] }[] }[] = [
  {
    group: 'Usage',
    rows: [
      { label: 'Monthly events', values: ['100k', '5M', 'Unlimited'] },
      { label: 'Data sources', values: ['3', 'Unlimited', 'Unlimited'] },
      { label: 'Seats', values: ['2', '15', 'Unlimited'] },
      { label: 'History', values: ['7 days', '2 years', 'Unlimited'] },
    ],
  },
  {
    group: 'AI',
    rows: [
      { label: 'Natural-language queries', values: ['50/mo', 'Unlimited', 'Unlimited'] },
      { label: 'Anomaly detection', values: [false, true, true] },
      { label: 'Forecasting', values: [false, true, true] },
      { label: 'Custom models', values: [false, false, true] },
    ],
  },
  {
    group: 'Security',
    rows: [
      { label: 'SOC 2 Type II', values: [true, true, true] },
      { label: 'SSO / SAML', values: [false, false, true] },
      { label: 'Audit logs', values: [false, true, true] },
      { label: 'Data residency', values: [false, false, true] },
    ],
  },
]
