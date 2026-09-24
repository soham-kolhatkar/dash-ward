import { Link } from 'react-router'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { BorderBeam, SpotlightCard } from '@/components/fx'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PlanTier } from './plans'
import { PriceRoll } from './PriceRoll'

export type Billing = 'monthly' | 'yearly'

export function PlanCard({ plan, billing = 'monthly', compact }: { plan: PlanTier; billing?: Billing; compact?: boolean }) {
  const price = billing === 'yearly' ? plan.yearly : plan.monthly
  const featured = !!plan.featured
  const href = plan.id === 'scale' ? 'mailto:sales@dashward.io' : '/signup'
  const features = compact ? plan.features.slice(0, 4) : plan.features

  return (
    <div className={cn('relative h-full', featured && 'lg:-my-4')}>
      {featured && (
        <div
          aria-hidden
          className="absolute -inset-px -z-10 rounded-[1.75rem] opacity-50 blur-2xl dark:opacity-70"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2), var(--accent-3))' }}
        />
      )}
      <SpotlightCard
        className={cn(
          'flex h-full flex-col rounded-[1.75rem] p-7 sm:p-8',
          featured && 'border-accent/40 bg-surface shadow-glow dark:bg-surface/90',
        )}
      >
        {featured && <BorderBeam size={220} duration={7} />}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-white dark:text-accent-fg">
              <Sparkles className="size-3" /> Most popular
            </span>
          )}
        </div>
        <p className="mt-2 min-h-10 text-sm text-fg-muted">{plan.tagline}</p>

        <div className="mt-6 flex items-end gap-1.5">
          <span className="flex items-start text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
            <span className="mt-1 mr-0.5 text-2xl font-medium text-fg-muted">$</span>
            <PriceRoll value={price} />
          </span>
          <span className="mb-1.5 text-sm text-fg-muted">/ month</span>
        </div>
        <p className="mt-2 h-4 text-xs text-fg-subtle">
          {billing === 'yearly' ? `Billed $${(price * 12).toLocaleString('en-US')} yearly` : 'Billed monthly · cancel anytime'}
        </p>

        {href.startsWith('mailto') ? (
          <a href={href} className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'group mt-7 w-full')}>
            {plan.cta} <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link to={href} className={cn(buttonVariants({ variant: featured ? 'brand' : 'secondary', size: 'lg' }), 'group mt-7 w-full')}>
            {plan.cta} <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        <div className="my-7 h-px bg-border" />
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-fg-muted">
              <span
                className={cn(
                  'mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full',
                  featured ? 'bg-accent text-white dark:text-accent-fg' : 'bg-surface-3 text-fg',
                )}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </SpotlightCard>
    </div>
  )
}
