import { COUNTRIES } from '@/data/metrics'

export interface FilterOption {
  value: string
  label: string
  share: number
}

export const FILTER_GROUPS: { key: 'device' | 'country' | 'plan'; label: string; options: FilterOption[] }[] = [
  {
    key: 'device',
    label: 'Device',
    options: [
      { value: 'desktop', label: 'Desktop', share: 58 },
      { value: 'mobile', label: 'Mobile', share: 34 },
      { value: 'tablet', label: 'Tablet', share: 8 },
    ],
  },
  {
    key: 'country',
    label: 'Country',
    options: [
      ...COUNTRIES.map((c) => ({ value: c.code, label: c.name, share: c.value })),
      { value: 'other', label: 'Rest of world', share: 100 - COUNTRIES.reduce((a, c) => a + c.value, 0) },
    ],
  },
  {
    key: 'plan',
    label: 'Plan',
    options: [
      { value: 'Starter', label: 'Starter', share: 34 },
      { value: 'Growth', label: 'Growth', share: 38 },
      { value: 'Scale', label: 'Scale', share: 20 },
      { value: 'Enterprise', label: 'Enterprise', share: 8 },
    ],
  },
]

export type Filters = Record<(typeof FILTER_GROUPS)[number]['key'], string[]>

export const ALL_FILTERS: Filters = {
  device: FILTER_GROUPS[0].options.map((o) => o.value),
  country: FILTER_GROUPS[1].options.map((o) => o.value),
  plan: FILTER_GROUPS[2].options.map((o) => o.value),
}

/** Fraction of total traffic that matches the filters (0 = nothing matches). */
export function filterFactor(f: Filters) {
  return FILTER_GROUPS.reduce((acc, g) => {
    const total = g.options.reduce((a, o) => a + o.share, 0)
    const sel = g.options.filter((o) => f[g.key].includes(o.value)).reduce((a, o) => a + o.share, 0)
    return acc * (sel / total)
  }, 1)
}

export const excludedCount = (f: Filters) =>
  FILTER_GROUPS.reduce((a, g) => a + g.options.length - f[g.key].length, 0)
