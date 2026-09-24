import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigation } from 'react-router'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Kbd } from '@/components/ui/misc'
import { Tooltip } from '@/components/ui/tooltip'
import { useUI } from '@/store/ui'
import { cn } from '@/lib/utils'
import { MOD, titleFor } from './nav'
import { NotificationsPopover } from './NotificationsPopover'
import { UserMenu } from './UserMenu'
import { useWorkspace } from './shell'

export function Topbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const setCommandOpen = useUI((s) => s.setCommandOpen)
  const setMobileNav = useUI((s) => s.setMobileNav)
  const ws = useWorkspace()
  const title = titleFor(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300',
        scrolled
          ? 'border-border bg-bg/70 shadow-[0_8px_30px_-12px_hsl(var(--shadow-color)/0.18)] backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent bg-transparent',
      )}
    >
      <AnimatePresence>
        {navigation.state === 'loading' && (
          <motion.div
            key="progress"
            className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-brand"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 0.85, transition: { duration: 2.5, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.3 } }}
          />
        )}
      </AnimatePresence>
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileNav(true)}
          className="-ml-1.5 inline-flex size-9 items-center justify-center rounded-full text-fg-muted transition hover:bg-surface-2 hover:text-fg lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="hidden truncate text-fg-subtle sm:inline">{ws.name}</span>
          <ChevronRight className="hidden size-3.5 shrink-0 text-fg-subtle/60 sm:block" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={title}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.22 }}
              className="truncate font-medium text-fg"
            >
              {title}
            </motion.span>
          </AnimatePresence>
        </nav>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="group hidden h-9 w-56 items-center gap-2.5 rounded-full border border-border bg-surface-2/60 pr-1.5 pl-3.5 text-sm text-fg-subtle transition hover:border-border-strong hover:bg-surface-2 hover:text-fg-muted md:flex lg:w-72"
        >
          <Search className="size-4 shrink-0" />
          <span className="flex-1 truncate text-left">Search or jump to…</span>
          <span className="flex gap-1">
            <Kbd>{MOD}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
        <button
          type="button"
          aria-label="Search"
          onClick={() => setCommandOpen(true)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface-2/60 text-fg-muted transition hover:text-fg md:hidden"
        >
          <Search className="size-4" />
        </button>

        <Tooltip content="Streaming events in real time">
          <span className="hidden h-7 items-center gap-2 rounded-full border border-success/25 bg-success/10 px-2.5 text-xs font-medium text-success sm:inline-flex">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
              <span className="relative size-1.5 rounded-full bg-success" />
            </span>
            Live
          </span>
        </Tooltip>

        <NotificationsPopover />
        <ThemeToggle />
        <div className="ml-0.5">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
