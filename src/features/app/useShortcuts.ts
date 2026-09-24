import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUI } from '@/store/ui'
import { NAV_ITEMS } from './nav'
import { useShell } from './shell'

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))

/** ⌘K / Ctrl+K palette, `[` sidebar, `?` help, and `G` then a key to navigate. */
export function useShortcuts() {
  const navigate = useNavigate()
  useEffect(() => {
    let leader = 0
    const onKey = (e: KeyboardEvent) => {
      const ui = useUI.getState()
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ui.setCommandOpen(!ui.commandOpen)
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || ui.commandOpen) return
      if (document.querySelector('[role="dialog"],[role="menu"]')) return
      const k = e.key.toLowerCase()
      if (Date.now() - leader < 1200) {
        leader = 0
        const item = NAV_ITEMS.find((i) => i.key === k)
        if (item) {
          e.preventDefault()
          navigate(item.to)
        }
        return
      }
      if (k === 'g') leader = Date.now()
      else if (e.key === '[') ui.toggleSidebar()
      else if (e.key === '?') useShell.getState().setShortcutsOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])
}
