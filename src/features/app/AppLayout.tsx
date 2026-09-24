import { AnimatePresence, motion } from 'motion/react'
import { Suspense, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { Aurora } from '@/components/fx'
import { Sheet, SheetContent } from '@/components/ui/dialog'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTheme } from '@/store/theme'
import { useUI } from '@/store/ui'
import { CommandMenu } from './CommandMenu'
import { PageSkeleton } from './PageSkeleton'
import { ShortcutsDialog } from './ShortcutsDialog'
import { Sidebar, SidebarBody } from './Sidebar'
import { Topbar } from './Topbar'
import { useShortcuts } from './useShortcuts'

export default function AppLayout() {
  useShortcuts()
  // Only one nav is mounted so shared SVG gradient ids (LogoMark) never resolve into a hidden copy.
  const desktop = useMediaQuery('(min-width: 1024px)')
  return (
    <div className="relative flex min-h-dvh bg-bg">
      {desktop ? <Sidebar /> : <MobileNav />}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Ambient />
        <Topbar />
        <main className="relative mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatedOutlet />
        </main>
      </div>
      <CommandMenu />
      <ShortcutsDialog />
    </div>
  )
}

function AnimatedOutlet() {
  const outlet = useOutlet()
  const { pathname } = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0 })}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
        exit={{ opacity: 0, y: -6, filter: 'blur(4px)', transition: { duration: 0.16, ease: 'easeIn' } }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<PageSkeleton />}>{outlet}</Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

function MobileNav() {
  const open = useUI((s) => s.mobileNavOpen)
  const setOpen = useUI((s) => s.setMobileNav)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname, setOpen])
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" title="Navigation" className="w-[min(85vw,288px)] bg-bg-subtle">
        <SidebarBody collapsed={false} layoutPrefix="mobile" inSheet onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function Ambient() {
  const dark = useTheme((s) => s.resolved) === 'dark'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden"
      style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent)' }}
    >
      <Aurora intensity={dark ? 0.4 : 0.22} />
      <div
        className="absolute inset-0 bg-grid opacity-60"
        style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)' }}
      />
    </div>
  )
}
