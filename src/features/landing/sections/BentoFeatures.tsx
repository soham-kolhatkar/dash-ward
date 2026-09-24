import { Activity, Globe2, MessageSquareText, Plug, Radar, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/components/fx'
import { SectionHeading, Serif } from '@/features/marketing/SectionHeading'
import { BentoCard } from '../bento/BentoCard'
import { AskWidget } from '../bento/AskWidget'
import { LiveStreamWidget } from '../bento/LiveStreamWidget'
import { GlobeWidget } from '../bento/GlobeWidget'
import { AnomalyWidget } from '../bento/AnomalyWidget'
import { OrbitWidget } from '../bento/OrbitWidget'
import { SecurityWidget } from '../bento/SecurityWidget'

export function BentoFeatures() {
  return (
    <section id="features" className="relative overflow-x-clip px-4 py-24 sm:px-8 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-60 mask-radial" />
      <SectionHeading
        eyebrow="Features"
        title={
          <>
            Everything you’d hire an analyst for. <Serif className="text-fg-muted">Minus the backlog.</Serif>
          </>
        }
        description="Six things Dashward does before your first coffee. Every card below is live. Hover, watch, and see for yourself."
      />

      <Reveal stagger={0.08} className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(22rem,auto)]">
        <BentoCard
          className="md:col-span-2 lg:col-span-4"
          icon={<MessageSquareText />}
          title="Ask anything, in plain English"
          description="No SQL, no pivot tables. Ask a question and get a sourced answer with the chart to back it up in under a second."
        >
          <AskWidget />
        </BentoCard>

        <BentoCard
          className="lg:col-span-2"
          icon={<Activity />}
          glow="var(--accent-2)"
          title="Streaming, not batching"
          description="Events land in your dashboards within 300ms of happening."
        >
          <LiveStreamWidget />
        </BentoCard>

        <BentoCard
          className="lg:col-span-2 lg:row-span-2"
          bodyClassName="overflow-hidden"
          icon={<Globe2 />}
          glow="var(--accent-3)"
          title="Every visitor, everywhere"
          description="See who is on your product right now, down to the city, with sub-second geo rollups."
        >
          <GlobeWidget />
        </BentoCard>

        <BentoCard
          className="md:col-span-2 lg:col-span-4"
          icon={<Radar />}
          glow="var(--danger)"
          title="Anomalies, caught at 2am"
          description="Seasonality-aware models learn what normal looks like for each metric, then page you only when it truly isn’t."
        >
          <AnomalyWidget />
        </BentoCard>

        <BentoCard
          className="lg:col-span-2"
          icon={<Plug />}
          title="120+ integrations"
          description="Warehouses, billing, CRM and product events. Connected in a couple of clicks."
          textBottom
        >
          <OrbitWidget />
        </BentoCard>

        <BentoCard
          className="lg:col-span-2"
          icon={<ShieldCheck />}
          glow="var(--accent-3)"
          title="Private by design"
          description="Your data never trains shared models. Run warehouse-native and nothing leaves your cloud."
        >
          <SecurityWidget />
        </BentoCard>
      </Reveal>
    </section>
  )
}
