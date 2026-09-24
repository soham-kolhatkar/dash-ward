import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/misc'
import { MOD, NAV_ITEMS } from './nav'
import { useShell } from './shell'

const GENERAL: { label: string; keys: string[] }[] = [
  { label: 'Open command menu', keys: [MOD, 'K'] },
  { label: 'Toggle sidebar', keys: ['['] },
  { label: 'Show keyboard shortcuts', keys: ['?'] },
]

export function ShortcutsDialog() {
  const open = useShell((s) => s.shortcutsOpen)
  const setOpen = useShell((s) => s.setShortcutsOpen)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="Keyboard shortcuts" description="Move around Dashward without leaving the keyboard." className="max-w-md">
        <div className="grid gap-5 sm:grid-cols-2">
          <Section title="General" rows={GENERAL} />
          <Section title="Navigation" rows={NAV_ITEMS.map((i) => ({ label: i.label, keys: ['G', i.key.toUpperCase()] }))} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, rows }: { title: string; rows: { label: string; keys: string[] }[] }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">{title}</div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-3 text-sm text-fg-muted">
            {r.label}
            <span className="flex gap-1">
              {r.keys.map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
