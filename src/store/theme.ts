import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

const media = () => window.matchMedia('(prefers-color-scheme: dark)')

export function resolveTheme(t: Theme): 'light' | 'dark' {
  if (t === 'system') return media().matches ? 'dark' : 'light'
  return t
}

function apply(t: Theme) {
  const dark = resolveTheme(t) === 'dark'
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#07070a' : '#faf9f6')
}

interface ThemeState {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (t: Theme, origin?: { x: number; y: number }) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      resolved: typeof window !== 'undefined' ? resolveTheme('system') : 'dark',
      setTheme: (theme, origin) => {
        const commit = () => {
          apply(theme)
          set({ theme, resolved: resolveTheme(theme) })
        }
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const doc = document as Document & {
          startViewTransition?: (cb: () => void) => { ready: Promise<void> }
        }
        if (!doc.startViewTransition || reduce || resolveTheme(theme) === useTheme.getState().resolved) {
          commit()
          return
        }
        const x = origin?.x ?? window.innerWidth / 2
        const y = origin?.y ?? 0
        const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
        const vt = doc.startViewTransition(commit)
        vt.ready.then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 600, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
          )
        })
      },
    }),
    {
      name: 'dw-theme',
      partialize: (s) => ({ theme: s.theme }),
      onRehydrateStorage: () => (s) => {
        if (!s) return
        apply(s.theme)
        useTheme.setState({ resolved: resolveTheme(s.theme) })
      },
    },
  ),
)

if (typeof window !== 'undefined') {
  media().addEventListener('change', () => {
    const { theme } = useTheme.getState()
    if (theme === 'system') {
      apply('system')
      useTheme.setState({ resolved: resolveTheme('system') })
    }
  })
}
