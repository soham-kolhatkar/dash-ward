import {
  ChartColumn,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { MESSAGES } from '@/data/misc'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Second key of the "G then X" shortcut. */
  key: string
  end?: boolean
  badge?: 'new' | number
}

export const UNREAD_MESSAGES = MESSAGES.filter((m) => m.unread).length

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Workspace',
    items: [
      { to: '/app', label: 'Overview', icon: LayoutDashboard, key: 'o', end: true },
      { to: '/app/analytics', label: 'Analytics', icon: ChartColumn, key: 'a' },
      { to: '/app/customers', label: 'Customers', icon: Users, key: 'c' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/app/ai', label: 'AI Assistant', icon: Sparkles, key: 'i', badge: 'new' },
      { to: '/app/inbox', label: 'Inbox', icon: Inbox, key: 'm', badge: UNREAD_MESSAGES },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/app/billing', label: 'Billing', icon: CreditCard, key: 'b' },
      { to: '/app/settings', label: 'Settings', icon: Settings, key: 's' },
    ],
  },
]

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items)

export function titleFor(pathname: string) {
  const p = pathname.replace(/\/+$/, '') || '/app'
  return NAV_ITEMS.find((i) => i.to === p)?.label ?? NAV_ITEMS.find((i) => i.to !== '/app' && p.startsWith(i.to))?.label ?? 'Overview'
}

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const MOD = isMac ? '⌘' : 'Ctrl'
