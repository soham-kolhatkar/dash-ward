import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingData {
  workspace: string
  slug: string
  role: string
  teamSize: string
  goals: string[]
  integrations: string[]
  invites: string[]
}

interface OnboardingState extends OnboardingData {
  step: number
  setStep: (s: number) => void
  update: (patch: Partial<OnboardingData>) => void
  reset: () => void
}

const initial: OnboardingData & { step: number } = {
  step: 0,
  workspace: '',
  slug: '',
  role: '',
  teamSize: '',
  goals: [],
  integrations: [],
  invites: [],
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initial,
      setStep: (step) => set({ step }),
      update: (patch) => set(patch),
      reset: () => set(initial),
    }),
    { name: 'dw-onboarding' },
  ),
)
