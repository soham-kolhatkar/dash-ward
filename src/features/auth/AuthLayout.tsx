import { AnimatePresence, motion } from 'motion/react'
import { Link, useLocation, useOutlet } from 'react-router'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Noise } from '@/components/fx'
import { ease } from '@/lib/motion'
import { AuthShowcase } from './AuthShowcase'

const ORDER = ['/login', '/signup', '/forgot-password']

export default function AuthLayout() {
  const { pathname } = useLocation()
  const outlet = useOutlet()
  const dir = ORDER.indexOf(pathname) >= 1 ? 1 : -1

  return (
    <div className="relative min-h-dvh bg-bg lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
      <Noise />
      <div className="relative flex min-h-dvh flex-col px-5 py-5 sm:px-10 sm:py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        </div>
        <header className="relative z-10 flex items-center justify-between">
          <Link to="/" aria-label="Dashward home" className="rounded-lg transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={pathname}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: 24 * d, filter: 'blur(8px)' }),
                  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
                  exit: (d: number) => ({ opacity: 0, x: -24 * d, filter: 'blur(8px)' }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: ease.outExpo }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
          <span>© 2026 Dashward, Inc.</span>
          <span className="flex gap-4">
            <a href="#" className="transition hover:text-fg">Privacy</a>
            <a href="#" className="transition hover:text-fg">Terms</a>
            <a href="#" className="transition hover:text-fg">Status</a>
          </span>
        </footer>
      </div>

      <aside className="sticky top-0 hidden h-dvh p-3 lg:block">
        <AuthShowcase />
      </aside>
    </div>
  )
}
