import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  onboarded: boolean
  signIn: (user: User) => void
  signOut: () => void
  completeOnboarding: () => void
  demoLogin: () => void
}

export const DEMO_USER: User = { name: 'Ava Chen', email: 'ava@northwind.io' }

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null, onboarded: false }),
      completeOnboarding: () => set({ onboarded: true }),
      demoLogin: () => set({ user: DEMO_USER, onboarded: true }),
    }),
    { name: 'dw-auth' },
  ),
)
