import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  commandOpen: boolean
  toggleSidebar: () => void
  setMobileNav: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
    }),
    { name: 'dw-ui', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) },
  ),
)
