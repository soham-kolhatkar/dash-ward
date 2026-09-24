import * as DM from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, ChevronsUpDown, CreditCard, Keyboard, LogOut, Monitor, Moon, Settings, Sun, User } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  popoverSurface,
} from '@/components/ui/dropdown'
import { Kbd } from '@/components/ui/misc'
import { useAuth } from '@/store/auth'
import { useTheme, type Theme } from '@/store/theme'
import { cn } from '@/lib/utils'
import { useShell } from './shell'

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

/** Account dropdown. `variant="avatar"` for the topbar, `"row"` for the sidebar footer. */
export function UserMenu({ variant = 'avatar', collapsed }: { variant?: 'avatar' | 'row'; collapsed?: boolean }) {
  const user = useAuth((s) => s.user)
  const signOut = useAuth((s) => s.signOut)
  const { theme, setTheme } = useTheme()
  const setShortcutsOpen = useShell((s) => s.setShortcutsOpen)
  const navigate = useNavigate()
  const name = user?.name ?? 'Guest'
  const email = user?.email ?? ''

  return (
    <DropdownMenu>
      {variant === 'avatar' ? (
        <DropdownMenuTrigger
          aria-label="Account menu"
          className="rounded-full outline-none transition hover:ring-4 hover:ring-accent/15 focus-visible:ring-4 focus-visible:ring-ring/40 data-[state=open]:ring-4 data-[state=open]:ring-accent/20"
        >
          <Avatar name={name} src={user?.avatar} className="size-8 ring-0" />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger
          className={cn(
            'group flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left outline-none transition hover:bg-surface-2 data-[state=open]:bg-surface-2',
            collapsed && 'justify-center',
          )}
        >
          <span className="relative shrink-0">
            <Avatar name={name} src={user?.avatar} className="size-8 ring-0" />
            <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-bg-subtle bg-success" />
          </span>
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className={cn('min-w-0 flex-1', collapsed && 'pointer-events-none absolute')}
          >
            <span className="block truncate text-sm font-medium">{name}</span>
            <span className="block truncate text-[11px] text-fg-subtle">{email}</span>
          </motion.span>
          {!collapsed && <ChevronsUpDown className="size-4 shrink-0 text-fg-subtle transition group-hover:text-fg-muted" />}
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align={variant === 'avatar' ? 'end' : 'start'}
        side={variant === 'avatar' ? 'bottom' : collapsed ? 'right' : 'top'}
        className="w-64"
      >
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <Avatar name={name} src={user?.avatar} className="size-9 ring-0" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-fg">{name}</div>
            <div className="truncate text-xs text-fg-subtle">{email}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/app/settings')}>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/app/settings')}>
          <Settings /> Settings
          <Kbd className="ml-auto">G S</Kbd>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/app/billing')}>
          <CreditCard /> Billing
          <Kbd className="ml-auto">G B</Kbd>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DM.Sub>
          <DM.SubTrigger className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-fg-muted outline-none select-none data-highlighted:bg-surface-2 data-highlighted:text-fg data-[state=open]:bg-surface-2 data-[state=open]:text-fg [&_svg]:size-4">
            {(() => {
              const Icon = THEMES.find((t) => t.value === theme)?.icon ?? Monitor
              return <Icon />
            })()}
            Theme
            <span className="ml-auto flex items-center gap-1 text-xs text-fg-subtle capitalize">
              {theme}
              <ChevronRight className="size-3.5!" />
            </span>
          </DM.SubTrigger>
          <DM.Portal>
            <DM.SubContent sideOffset={6} alignOffset={-4} className={cn(popoverSurface, 'min-w-40')}>
              {THEMES.map((t) => (
                <DropdownMenuItem key={t.value} onSelect={() => setTheme(t.value)}>
                  <t.icon /> {t.label}
                  {theme === t.value && <Check className="ml-auto text-accent" />}
                </DropdownMenuItem>
              ))}
            </DM.SubContent>
          </DM.Portal>
        </DM.Sub>
        <DropdownMenuItem onSelect={() => setShortcutsOpen(true)}>
          <Keyboard /> Keyboard shortcuts
          <Kbd className="ml-auto">?</Kbd>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="data-highlighted:bg-danger/10 data-highlighted:text-danger"
          onSelect={() => {
            signOut()
            navigate('/')
            toast('Signed out', { description: 'See you soon 👋' })
          }}
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
