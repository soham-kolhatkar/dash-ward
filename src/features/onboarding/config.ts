import { Building2, Palette, Plug, Target, UserRound, Users, type LucideIcon } from 'lucide-react'
import type { OnboardingData } from '@/store/onboarding'

export interface StepMeta {
  id: string
  title: string
  hint: string
  icon: LucideIcon
}

export const STEPS: StepMeta[] = [
  { id: 'workspace', title: 'Workspace', hint: 'Name your home base', icon: Building2 },
  { id: 'about', title: 'About you', hint: 'Role and team size', icon: UserRound },
  { id: 'goals', title: 'Goals', hint: 'What you want to learn', icon: Target },
  { id: 'connect', title: 'Connect data', hint: 'Plug in your sources', icon: Plug },
  { id: 'invite', title: 'Invite team', hint: 'Bring your people', icon: Users },
  { id: 'theme', title: 'Appearance', hint: 'Make it yours', icon: Palette },
]

export const FINAL_STEP = STEPS.length

export function isStepValid(step: number, d: OnboardingData) {
  switch (step) {
    case 0:
      return d.workspace.trim().length >= 2 && d.slug.length >= 2
    case 1:
      return !!d.role && !!d.teamSize
    case 2:
      return d.goals.length > 0
    default:
      return true
  }
}

export function continueLabel(step: number, d: OnboardingData) {
  if (step === 3 && d.integrations.length === 0) return 'Skip'
  if (step === 4) return d.invites.length ? `Send ${d.invites.length} invite${d.invites.length > 1 ? 's' : ''}` : 'Skip'
  if (step === STEPS.length - 1) return 'Finish setup'
  return 'Continue'
}

const GENERIC = new Set(['gmail', 'googlemail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'proton', 'protonmail', 'aol', 'live', 'me'])

/** "ava@northwind-labs.io" → "Northwind Labs" (null for personal mail providers). */
export function companyFromEmail(email?: string) {
  const domain = email?.split('@')[1]?.split('.')[0]
  if (!domain || GENERIC.has(domain.toLowerCase())) return null
  return domain
    .split(/[-_]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ')
}

export function hueFrom(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
}
