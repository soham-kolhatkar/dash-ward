import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/fx'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SectionHeading, Serif } from '@/features/marketing/SectionHeading'
import { PLANS } from '@/features/pricing/plans'
import { PlanCard } from '@/features/pricing/PlanCard'

export function PricingTeaser() {
  return (
    <section className="relative overflow-x-clip px-4 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Pricing"
        title={
          <>
            Simple plans. <Serif className="text-accent">Serious</Serif> leverage.
          </>
        }
        description="Start free for 14 days. No credit card, no sales call, no surprise overage bills."
      />
      <Reveal className="mx-auto mt-16 grid max-w-6xl items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
        {PLANS.map((p) => (
          <Reveal.Item key={p.id}>
            <PlanCard plan={p} compact />
          </Reveal.Item>
        ))}
      </Reveal>
      <div className="mt-12 flex justify-center">
        <Link to="/pricing" className={cn(buttonVariants({ variant: 'ghost', size: 'md' }), 'group')}>
          Compare every feature <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
