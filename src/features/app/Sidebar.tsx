import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, Zap } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import { BorderBeam } from '@/components/fx'
import { Button } from '@/components/ui/button'
import { Kbd, Progress } from '@/components/ui/misc'
import { Tooltip } from '@/components/ui/tooltip'
import { useUI } from '@/store/ui'
import { cn } from '@/lib/utils'
import { NAV_GROUPS, type NavItem } from './nav'
import { UserMenu } from './UserMenu'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

const widthSpring = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 } as const
const pillSpring = { type: 'spring', stiffness: 500, damping: 38 } as const

/** Desktop sidebar (lg+). Width springs between 256 and 72. */
export function Sidebar() {
  const collapsed = useUI((s) => s.sidebarCollapsed)
  const toggle = useUI((s) => s.toggleSidebar)
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={widthSpring}
      className="sticky top-0 z-40 hidden h-dvh shrink-0 lg:block"
    >
      <div className="relative flex h-full flex-col overflow-hidden border-r border-border bg-bg-subtle/70 backdrop-blur-xl dark:bg-bg-subtle/50">
        <SidebarBody collapsed={collapsed} layoutPrefix="desk" />
      </div>
      <Tooltip content={<span className="flex items-center gap-2">{collapsed ? 'Expand' : 'Collapse'} <Kbd className="border-bg/20 bg-bg/10 text-bg/70">[</Kbd></span>} side="right">
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute top-[22px] -right-3 z-10 flex size-6 items-center justify-center rounded-full border border-border-strong bg-surface text-fg-subtle shadow-elevated transition hover:scale-110 hover:text-fg"
        >
          <motion.span initial={false} animate={{ rotate: collapsed ? 180 : 0 }} transition={widthSpring}>
            <ChevronLeft className="size-3.5" />
          </motion.span>
        </button>
      </Tooltip>
    </motion.aside>
  )
}

/** Shared between the desktop sidebar and the mobile sheet. */
export function SidebarBody({
  collapsed,
  layoutPrefix,
  onNavigate,
  inSheet,
}: {
  collapsed: boolean
  layoutPrefix: string
  onNavigate?: () => void
  inSheet?: boolean
}) {
  return (
    <>
      <div className={cn('px-3 pt-3 pb-2', inSheet && 'pr-12')}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>
      <nav className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-3 py-3 scrollbar-none">
        {NAV_GROUPS.map((g) => (
          <div key={g.label}>
            <div className="relative mb-1 h-6">
              <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.15 }}
                className="px-4 text-[11px] leading-6 font-medium tracking-wide text-fg-subtle uppercase"
              >
                {g.label}
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 1 : 0, scaleX: collapsed ? 1 : 0.4 }}
                className="absolute inset-x-3 top-1/2 h-px bg-border"
              />
            </div>
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.to}>
                  <NavRow item={item} collapsed={collapsed} layoutPrefix={layoutPrefix} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-2 p-3">
        <AnimatePresence initial={false} mode="popLayout">
          {collapsed ? (
            <motion.div key="mini" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <UpgradeMini />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
            >
              <UpgradeCard onNavigate={onNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="border-t border-border pt-2">
          <UserMenu variant="row" collapsed={collapsed} />
        </div>
      </div>
    </>
  )
}

function NavRow({
  item,
  collapsed,
  layoutPrefix,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  layoutPrefix: string
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex h-9 items-center gap-3 rounded-lg px-4 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
          isActive ? 'text-fg' : 'text-fg-muted hover:bg-surface-2/70 hover:text-fg',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <>
              <motion.span
                layoutId={`${layoutPrefix}-nav-pill`}
                transition={pillSpring}
                className="absolute inset-0 rounded-lg border border-border bg-surface shadow-[0_1px_2px_hsl(var(--shadow-color)/0.08)] dark:bg-surface-2"
              />
              <motion.span
                layoutId={`${layoutPrefix}-nav-bar`}
                transition={pillSpring}
                className="absolute top-2.5 bottom-2.5 -left-3 w-[3px] rounded-r-full bg-accent shadow-[0_0_12px_var(--accent)]"
              />
            </>
          )}
          <span className="relative">
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors',
                isActive ? 'text-accent' : 'text-fg-subtle group-hover:text-fg-muted',
              )}
            />
            {collapsed && item.badge != null && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-accent ring-2 ring-bg-subtle" />
            )}
          </span>
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -4 : 0 }}
            transition={{ duration: collapsed ? 0.1 : 0.25, delay: collapsed ? 0 : 0.08 }}
            className="relative flex-1 truncate whitespace-nowrap"
          >
            {item.label}
          </motion.span>
          {!collapsed && item.badge != null && <NavBadge badge={item.badge} />}
        </>
      )}
    </NavLink>
  )
  if (!collapsed) return link
  return (
    <Tooltip content={item.label} side="right">
      {link}
    </Tooltip>
  )
}

function NavBadge({ badge }: { badge: 'new' | number }) {
  if (badge === 'new')
    return (
      <span className="relative rounded-full bg-gradient-brand px-1.5 py-px text-[10px] font-semibold text-white shadow-[0_0_14px_-2px_var(--glow)] dark:text-accent-fg">
        New
      </span>
    )
  return (
    <span className="relative min-w-5 rounded-full border border-border bg-surface-2 px-1.5 text-center font-mono text-[10px] leading-4 font-medium text-fg-muted tabular-nums">
      {badge}
    </span>
  )
}

function UpgradeCard({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-3.5 shadow-elevated dark:bg-surface/70">
      <BorderBeam size={90} duration={7} />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-60 blur-2xl"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="flex size-6 items-center justify-center rounded-md bg-gradient-brand text-white dark:text-accent-fg">
            <Zap className="size-3.5" />
          </span>
          Upgrade to Scale
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">Unlimited AI queries, SSO and 10× event volume.</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-fg-subtle">
          <span>Events this month</span>
          <span className="font-mono text-fg-muted tabular-nums">7.8M / 10M</span>
        </div>
        <Progress value={78} className="mt-1.5 h-1" />
        <Button
          size="xs"
          variant="primary"
          className="mt-3 w-full"
          onClick={() => {
            onNavigate?.()
            navigate('/app/billing')
          }}
        >
          Upgrade plan
        </Button>
      </div>
    </div>
  )
}

function UpgradeMini() {
  const navigate = useNavigate()
  return (
    <Tooltip content="Upgrade to Scale · 78% of events used" side="right">
      <button
        type="button"
        onClick={() => navigate('/app/billing')}
        aria-label="Upgrade to Scale"
        className="relative mx-auto flex size-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface text-accent shadow-elevated transition hover:scale-105"
      >
        <BorderBeam size={36} duration={5} />
        <Zap className="size-4" />
      </button>
    </Tooltip>
  )
}
