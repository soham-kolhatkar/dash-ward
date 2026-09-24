import { create } from 'zustand'

export const WORKSPACES = [
  { id: 'northwind', name: 'Northwind', plan: 'Growth', hue: 290 },
  { id: 'lumen', name: 'Lumen Labs', plan: 'Scale', hue: 210 },
  { id: 'orbital', name: 'Orbital', plan: 'Starter', hue: 130 },
]

interface ShellState {
  shortcutsOpen: boolean
  setShortcutsOpen: (v: boolean) => void
  workspace: string
  setWorkspace: (id: string) => void
}

/** App-shell-only UI state (not persisted). */
export const useShell = create<ShellState>()((set) => ({
  shortcutsOpen: false,
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
  workspace: 'northwind',
  setWorkspace: (workspace) => set({ workspace }),
}))

export const useWorkspace = () => {
  const id = useShell((s) => s.workspace)
  return WORKSPACES.find((w) => w.id === id) ?? WORKSPACES[0]
}
