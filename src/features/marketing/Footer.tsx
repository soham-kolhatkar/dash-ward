import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/ui/logo'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { DiscordIcon, GithubIcon, LinkedinIcon, XIcon, YoutubeIcon } from './SocialIcons'

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'How it works', to: '/#how' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Live demo', to: '/signup' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'SaaS metrics', to: '/#features' },
      { label: 'E-commerce', to: '/#features' },
      { label: 'Product analytics', to: '/#features' },
      { label: 'Finance & RevOps', to: '/#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Customers', to: '/#product' },
      { label: 'Careers', to: '/' },
      { label: 'Press kit', to: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', to: '/' },
      { label: 'API reference', to: '/' },
      { label: 'Security', to: '/pricing' },
      { label: 'Status', to: '/' },
    ],
  },
]

const SOCIALS = [
  { label: 'GitHub', Icon: GithubIcon },
  { label: 'X', Icon: XIcon },
  { label: 'LinkedIn', Icon: LinkedinIcon },
  { label: 'YouTube', Icon: YoutubeIcon },
  { label: 'Discord', Icon: DiscordIcon },
]

export function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['70%', '8%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], reduce ? [1, 1] : [0.2, 1])

  return (
    <footer className="relative overflow-x-clip border-t border-border bg-bg-subtle/60">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">
              The analytics copilot for teams who would rather make decisions than dashboards. Built in Lisbon and Brooklyn.
            </p>
            <Newsletter />
            <div className="mt-8 flex items-center gap-2">
              {SOCIALS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface hover:text-fg"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h3 className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-subtle uppercase">{c.title}</h3>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="group inline-flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-fg">
                        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-px transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                          {l.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Dashward Labs, Inc.</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-fg">
              Privacy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-fg">
              Terms
            </a>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-fg-muted transition hover:text-fg"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-70" />
              <span className="relative size-2 rounded-full bg-success" />
            </span>
            All systems normal
          </a>
        </div>
      </div>

      <div ref={ref} aria-hidden className="relative h-[21vw] overflow-hidden select-none">
        <motion.div style={{ y, opacity }} className="absolute inset-x-0 top-0 flex justify-center">
          <span
            className="block text-[20.5vw] leading-[0.8] font-semibold tracking-[-0.075em] opacity-90 dark:opacity-100"
            style={{
              backgroundImage: 'linear-gradient(100deg, var(--accent) 10%, var(--accent-2) 55%, var(--accent-3) 95%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              maskImage: 'linear-gradient(to bottom, black 15%, transparent 88%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 88%)',
            }}
          >
            Dashward
          </span>
        </motion.div>
      </div>
    </footer>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('That email doesn’t look quite right.')
      return
    }
    setDone(true)
    toast.success('You’re on the list', { description: 'One email a month. Only the good stuff.' })
  }
  return (
    <form onSubmit={submit} className="mt-7">
      <label htmlFor="footer-email" className="text-xs font-medium text-fg">
        The Signal — a monthly note on analytics &amp; AI
      </label>
      <div className="mt-2.5 flex items-center gap-1 rounded-full border border-border bg-surface p-1 pl-4 shadow-sm transition focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-ring/20">
        <input
          id="footer-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          disabled={done}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300',
            done ? 'bg-success' : 'bg-fg text-bg hover:scale-105',
          )}
        >
          {done ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
    </form>
  )
}
