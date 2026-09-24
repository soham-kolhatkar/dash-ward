import { createRng } from '@/lib/random'

export type Plan = 'Starter' | 'Growth' | 'Scale' | 'Enterprise'
export type Status = 'active' | 'trial' | 'churned' | 'past_due'

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: Plan
  status: Status
  mrr: number
  seats: number
  country: string
  joined: string
  lastActive: string
  health: number
}

const first = ['Ava', 'Liam', 'Maya', 'Noah', 'Zara', 'Ethan', 'Isla', 'Kai', 'Leah', 'Omar', 'Priya', 'Lucas', 'Sofia', 'Mateo', 'Yuki', 'Aria', 'Felix', 'Nina', 'Rohan', 'Elena', 'Theo', 'Chloe', 'Arjun', 'Mila', 'Jonas', 'Hana', 'Diego', 'Freya', 'Kenji', 'Amara']
const last = ['Chen', 'Patel', 'García', 'Kim', 'Müller', 'Okafor', 'Rossi', 'Tanaka', 'Silva', 'Novak', 'Haddad', 'Larsen', 'Singh', 'Moreau', 'Walsh', 'Ivanova', 'Nakamura', 'Costa', 'Berg', 'Reyes']
const companies = ['Northwind', 'Lumen Labs', 'Acme Corp', 'Vercelion', 'Halcyon', 'Parabola', 'Orbital', 'Kinetic', 'Nimbus', 'Quanta', 'Brightline', 'Foundry', 'Meridian', 'Solstice', 'Arcadia', 'Helix', 'Polaris', 'Cobalt', 'Tandem', 'Evergreen']
const countries = ['US', 'GB', 'DE', 'IN', 'JP', 'BR', 'CA', 'FR', 'AU', 'SG']
const plans: Plan[] = ['Starter', 'Growth', 'Scale', 'Enterprise']
const mrrByPlan: Record<Plan, [number, number]> = { Starter: [29, 99], Growth: [199, 499], Scale: [800, 2400], Enterprise: [4000, 18000] }

export const CUSTOMERS: Customer[] = (() => {
  const rng = createRng(2026)
  return Array.from({ length: 86 }, (_, i) => {
    const f = rng.pick(first)
    const l = rng.pick(last)
    const company = rng.pick(companies)
    const plan = plans[Math.min(3, Math.floor(Math.pow(rng.next(), 1.6) * 4))]
    const status: Status = rng.bool(0.72) ? 'active' : rng.pick(['trial', 'churned', 'past_due'] as const)
    const [lo, hi] = mrrByPlan[plan]
    const joined = new Date(Date.now() - rng.int(5, 720) * 864e5)
    const lastActive = new Date(Date.now() - rng.int(0, status === 'churned' ? 90 : 6) * 864e5 - rng.int(0, 86400) * 1e3)
    return {
      id: `cus_${(1000 + i).toString(36)}${rng.int(100, 999)}`,
      name: `${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}@${company.toLowerCase().replace(/\s/g, '')}.com`,
      company,
      plan,
      status,
      mrr: status === 'churned' ? 0 : Math.round(rng.range(lo, hi)),
      seats: plan === 'Enterprise' ? rng.int(40, 400) : plan === 'Scale' ? rng.int(10, 60) : rng.int(1, 12),
      country: rng.pick(countries),
      joined: joined.toISOString(),
      lastActive: lastActive.toISOString(),
      health: status === 'churned' ? rng.int(5, 25) : status === 'past_due' ? rng.int(25, 55) : rng.int(55, 99),
    }
  })
})()
