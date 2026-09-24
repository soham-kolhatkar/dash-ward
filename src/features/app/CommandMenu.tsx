import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import {
  ArrowRight,
  Check,
  CornerDownLeft,
  FileText,
  Monitor,
  Moon,
  PanelLeft,
  Search,
  Sparkles,
  Sun,
  UserPlus,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import { Kbd } from '@/components/ui/misc'
import { CUSTOMERS } from '@/data/customers'
import { useTheme, type Theme } from '@/store/theme'
import { useUI } from '@/store/ui'
import { NAV_ITEMS } from './nav'

const SEARCHABLE_CUSTOMERS = CUSTOMERS.slice(0, 20)

const keyframes = `
@keyframes cmdk-in { from { opacity: 0; transform: scale(.96) translateY(-8px); filter: blur(8px); } }
@keyframes cmdk-out { to { opacity: 0; transform: scale(.98); filter: blur(4px); } }
[cmdk-list] { height: min(var(--cmdk-list-height), min(420px, 60vh)); transition: height .2s var(--ease-out-expo); }
`

/** Global ⌘K palette. Open state lives in useUI().commandOpen. */
export function CommandMenu() {
  const open = useUI((s) => s.commandOpen)
  const setOpen = useUI((s) => s.setCommandOpen)
  const toggleSidebar = useUI((s) => s.toggleSidebar)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const run = (fn: () => void) => {
    setOpen(false)
    setSearch('')
    fn()
  }

  const themes: { value: Theme; label: string; icon: ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun /> },
    { value: 'dark', label: 'Dark', icon: <Moon /> },
    { value: 'system', label: 'System', icon: <Monitor /> },
  ]

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setSearch('')
      }}
    >
      <DialogPrimitive.Portal>
        <style>{keyframes}</style>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=closed]:animate-[fade-out_.15s_ease-in] data-[state=open]:animate-[fade-in_.2s_ease-out] dark:bg-black/50" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[10vh] z-50 mx-auto w-[calc(100%-2rem)] max-w-[640px] origin-top outline-none data-[state=closed]:animate-[cmdk-out_.14s_ease-in] data-[state=open]:animate-[cmdk-in_.32s_var(--ease-out-expo)] sm:top-[14vh]"
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <Command
            loop
            vimBindings={false}
            className="glass relative overflow-hidden rounded-2xl shadow-elevated [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fg-subtle"
            style={{ background: 'color-mix(in oklch, var(--surface) 86%, transparent)' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)', opacity: 0.6 }}
            />
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-fg-subtle" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search pages, customers, actions…"
                className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-subtle"
              />
              <Kbd className="hidden sm:inline-flex">esc</Kbd>
            </div>
            <Command.List className="overflow-y-auto overscroll-contain p-2 scroll-py-2">
              <Command.Empty className="flex flex-col items-center gap-2 py-12 text-sm text-fg-muted">
                <Search className="size-5 text-fg-subtle" />
                No results for “{search}”
              </Command.Empty>

              <Command.Group heading="Navigation">
                {NAV_ITEMS.map((item) => (
                  <Item
                    key={item.to}
                    value={`Go to ${item.label}`}
                    icon={<item.icon />}
                    onSelect={() => run(() => navigate(item.to))}
                    hint={
                      <span className="flex gap-1">
                        <Kbd>G</Kbd>
                        <Kbd>{item.key.toUpperCase()}</Kbd>
                      </span>
                    }
                  >
                    {item.label}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Actions">
                <Item
                  value="Ask AI assistant"
                  forceMount
                  keywords={['chat', 'question', 'assistant']}
                  icon={<Sparkles className="text-accent" />}
                  onSelect={() => run(() => navigate(search ? `/app/ai?q=${encodeURIComponent(search)}` : '/app/ai'))}
                  hint={<ArrowRight className="size-3.5 text-fg-subtle" />}
                >
                  Ask AI{search ? <span className="text-fg-subtle"> “{search}”</span> : null}
                </Item>
                <Item
                  value="Create report"
                  keywords={['new', 'dashboard']}
                  icon={<FileText />}
                  onSelect={() => run(() => toast.success('Report created', { description: '“Untitled report” was added to your workspace.' }))}
                >
                  Create report
                </Item>
                <Item
                  value="Invite teammate"
                  keywords={['member', 'team', 'user']}
                  icon={<UserPlus />}
                  onSelect={() =>
                    run(() => {
                      navigator.clipboard?.writeText('https://dashward.io/invite/nw-8f2k').catch(() => {})
                      toast.success('Invite link copied', { description: 'Anyone with the link can join Northwind.' })
                    })
                  }
                >
                  Invite teammate
                </Item>
                <Item value="Toggle sidebar" icon={<PanelLeft />} onSelect={() => run(toggleSidebar)} hint={<Kbd>[</Kbd>}>
                  Toggle sidebar
                </Item>
              </Command.Group>

              <Command.Group heading="Theme">
                {themes.map((t) => (
                  <Item
                    key={t.value}
                    value={`Theme ${t.label}`}
                    keywords={['appearance', 'mode', 'color']}
                    icon={t.icon}
                    onSelect={() => run(() => setTheme(t.value))}
                    hint={theme === t.value ? <Check className="size-4 text-accent" /> : null}
                  >
                    {t.label} theme
                  </Item>
                ))}
              </Command.Group>

              {search.length > 0 && (
                <Command.Group heading="Customers">
                  {SEARCHABLE_CUSTOMERS.map((c) => (
                    <Item
                      key={c.id}
                      value={`${c.name} ${c.id}`}
                      keywords={[c.company, c.email]}
                      icon={<Avatar name={c.name} className="size-5 ring-0" />}
                      onSelect={() => run(() => navigate(`/app/customers?q=${encodeURIComponent(c.name)}`))}
                      hint={<span className="text-[11px] text-fg-subtle">{c.plan}</span>}
                    >
                      {c.name}
                      <span className="ml-2 text-fg-subtle">{c.company}</span>
                    </Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
            <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-2/40 px-4 py-2.5 text-[11px] text-fg-subtle">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>
                    <CornerDownLeft className="size-3" />
                  </Kbd>
                  Select
                </span>
              </div>
              <span className="hidden items-center gap-1.5 sm:flex">
                <Sparkles className="size-3 text-accent" /> Tip: type a question and pick “Ask AI”
              </span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function Item({
  children,
  icon,
  hint,
  value,
  keywords,
  onSelect,
  forceMount,
}: {
  children: ReactNode
  icon: ReactNode
  hint?: ReactNode
  value: string
  keywords?: string[]
  onSelect: () => void
  forceMount?: boolean
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      forceMount={forceMount}
      className="group relative flex h-10 cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm text-fg-muted transition-colors select-none data-[selected=true]:bg-surface-3/70 data-[selected=true]:text-fg"
    >
      <span className="absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-full bg-accent opacity-0 transition-opacity group-data-[selected=true]:opacity-100" />
      <span className="flex size-5 shrink-0 items-center justify-center text-fg-subtle group-data-[selected=true]:text-fg [&_svg]:size-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && <span className="shrink-0">{hint}</span>}
    </Command.Item>
  )
}
