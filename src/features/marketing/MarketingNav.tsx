import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Magnetic } from '@/components/fx'
import { useLenis } from '@/hooks/useLenis'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useIntroDone } from './intro'
import { useLiveDemo } from './useLiveDemo'

export const NAV_LINKS = [
  { label: 'Product', to: '/#product' },
  { label: 'Features', to: '/#features' },
  { label: 'How it works', to: '/#how' },
  { label: 'Pricing', to: '/pricing' },
] as const

const CHANGELOG = [
  { date: 'Sep 18', tag: 'New', title: 'AI Forecasts 2.0', body: 'Seasonality-aware forecasts with confidence bands on any metric.' },
  { date: 'Sep 04', tag: 'Improved', title: 'Warehouse-native mode', body: 'Query Snowflake and BigQuery in place. Nothing leaves your cloud.' },
  { date: 'Aug 21', tag: 'New', title: 'Slack digests', body: 'A Monday summary of what changed and why, in your team channel.' },
]

export function MarketingNav() {
  const { pathname } = useLocation()
  const ready = useIntroDone()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const s = y > 24
    if (s !== scrolled) setScrolled(s)
    const h = y > 320 && y > prev + 2
    const show = y < prev - 2 || y <= 320
    if (h && !hidden) setHidden(true)
    else if (show && hidden) setHidden(false)
  })

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = prev
    }
  }, [open, lenis])

  return (
    <>
      <motion.header
        initial={false}
        animate={ready ? { y: hidden && !open ? -110 : 0, opacity: 1 } : { y: -60, opacity: 0 }}
        transition={{ duration: ready ? 0.6 : 0, ease: ease.outExpo }}
        className="fixed inset-x-0 top-0 z-[58] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            'relative flex w-full items-center justify-between gap-3 rounded-full border transition-all duration-500 ease-out-expo',
            scrolled || open
              ? 'max-w-[62rem] border-border-strong bg-surface/75 py-1.5 pr-1.5 pl-4 shadow-elevated backdrop-blur-2xl backdrop-saturate-200 dark:bg-surface/60'
              : 'max-w-[72rem] border-border bg-surface/45 py-2 pr-2 pl-5 backdrop-blur-md backdrop-saturate-150 dark:bg-surface/30',
          )}
        >
          <Link to="/" aria-label="Dashward home" className="shrink-0 rounded-full">
            <Logo />
          </Link>

          <ul className="hidden items-center lg:flex" onMouseLeave={() => setHover(null)}>
            {NAV_LINKS.map((l) => {
              const active = l.to === pathname
              return (
                <li key={l.label} className="relative">
                  <Link
                    to={l.to}
                    onMouseEnter={() => setHover(l.label)}
                    onFocus={() => setHover(l.label)}
                    className={cn(
                      'relative block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300',
                      active || hover === l.label ? 'text-fg' : 'text-fg-muted',
                    )}
                  >
                    {hover === l.label && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 -z-0 rounded-full bg-fg/[0.06] dark:bg-white/[0.08]"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                    {active && <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
                  </Link>
                </li>
              )
            })}
            <li className="relative">
              <ChangelogPopover onHover={() => setHover('Changelog')} active={hover === 'Changelog'} />
            </li>
          </ul>

          <div className="flex items-center gap-1.5">
            <ThemeToggle className="bg-transparent" />
            <Link to="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}>
              Sign in
            </Link>
            <Magnetic strength={0.25} className="hidden sm:block">
              <Link to="/signup" className={cn(buttonVariants({ variant: 'brand', size: 'sm' }), 'group h-9 px-4')}>
                Get started
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative flex size-9 items-center justify-center rounded-full border border-border bg-surface-2/60 lg:hidden"
            >
              <span
                className={cn(
                  'absolute h-[1.5px] w-4 rounded-full bg-fg transition-transform duration-500 ease-out-expo',
                  open ? 'rotate-45' : '-translate-y-[3.5px]',
                )}
              />
              <span
                className={cn(
                  'absolute h-[1.5px] w-4 rounded-full bg-fg transition-transform duration-500 ease-out-expo',
                  open ? '-rotate-45' : 'translate-y-[3.5px]',
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

function ChangelogPopover({ onHover, active }: { onHover: () => void; active: boolean }) {
  return (
    <Popover>
      <PopoverTrigger
        onMouseEnter={onHover}
        onFocus={onHover}
        className={cn(
          'relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300',
          active ? 'text-fg' : 'text-fg-muted',
        )}
      >
        {active && (
          <motion.span
            layoutId="nav-hover"
            className="absolute inset-0 rounded-full bg-fg/[0.06] dark:bg-white/[0.08]"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <span className="relative">Changelog</span>
        <span className="relative size-1.5 rounded-full bg-accent-3 shadow-[0_0_8px_var(--accent-3)]" />
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={14} className="w-[22rem] p-2">
        <div className="flex items-center justify-between px-3 pt-2 pb-3">
          <span className="text-xs font-medium tracking-wide text-fg-subtle uppercase">What’s new</span>
          <Sparkles className="size-3.5 text-accent" />
        </div>
        <ul className="space-y-1">
          {CHANGELOG.map((c) => (
            <li key={c.title} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2">
              <div className="flex items-center gap-2 text-[11px] text-fg-subtle">
                <span className="font-mono">{c.date}</span>
                <span className={cn('rounded-full px-1.5 py-px font-medium', c.tag === 'New' ? 'bg-accent/10 text-accent' : 'bg-accent-2/10 text-accent-2')}>
                  {c.tag}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-fg">{c.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const demo = useLiveDemo()
  const items = [...NAV_LINKS, { label: 'Sign in', to: '/login' }]
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.5, ease: ease.inOutQuart, delay: 0.15 } }}
      transition={{ duration: 0.7, ease: ease.inOutQuart }}
      className="fixed inset-0 z-[57] flex flex-col overflow-y-auto bg-bg/95 px-6 pt-28 pb-10 backdrop-blur-2xl lg:hidden"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }}
      />
      <motion.ul
        className="relative flex flex-col gap-1"
        initial="hidden"
        animate="show"
        exit="hidden"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } }, hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } }}
      >
        {items.map((l, i) => (
          <li key={l.label} className="overflow-hidden">
            <motion.div
              variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: ease.outExpo } } }}
              className="origin-left"
            >
              <Link
                to={l.to}
                onClick={onClose}
                className="group flex items-baseline gap-4 py-1.5 text-5xl font-semibold tracking-[-0.04em] text-fg sm:text-6xl"
              >
                <span className="font-mono text-xs font-normal tracking-normal text-fg-subtle">0{i + 1}</span>
                <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{l.label}</span>
              </Link>
            </motion.div>
          </li>
        ))}
      </motion.ul>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease: ease.outExpo } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="relative mt-auto flex flex-col gap-3 pt-12"
      >
        <Link to="/signup" onClick={onClose} className={cn(buttonVariants({ variant: 'brand', size: 'lg' }), 'w-full')}>
          Get started free <ArrowRight />
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose()
            demo()
          }}
          className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'w-full')}
        >
          Open live demo <ArrowUpRight />
        </button>
        <p className="mt-3 text-center text-xs text-fg-subtle">No credit card · SOC 2 Type II · Cancel anytime</p>
      </motion.div>
    </motion.div>
  )
}
