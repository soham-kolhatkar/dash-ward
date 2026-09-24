import { Marquee } from '@/components/fx'
import { Avatar } from '@/components/ui/avatar'
import { SectionHeading, Serif } from '@/features/marketing/SectionHeading'

const QUOTES = [
  {
    quote: 'We replaced three BI tools and a Monday reporting ritual with one Slack digest. My team got four hours a week back.',
    name: 'Maya Patel',
    role: 'VP Growth',
    company: 'Northwind',
  },
  {
    quote: 'Dashward caught a pricing-page regression at 2am that would have cost us a week of trials. It paid for itself that night.',
    name: 'Kenji Tanaka',
    role: 'Head of Data',
    company: 'Kestrel Robotics',
  },
  {
    quote: 'Our CEO asks questions directly now. The answers cite their sources, so nobody argues about whose spreadsheet is right.',
    name: 'Zara Okafor',
    role: 'Analytics Lead',
    company: 'Halcyon Health',
  },
  {
    quote: 'Setup took one afternoon. By dinner we had cohort retention for four years of Stripe data, which we had never been able to see.',
    name: 'Lucas Rossi',
    role: 'Co-founder & CTO',
    company: 'Oakline Studio',
  },
  {
    quote: 'Warehouse-native mode was the unlock for our security team. Nothing leaves Snowflake and we still get the AI layer.',
    name: 'Priya Singh',
    role: 'Director of Platform',
    company: 'Parallel Freight',
  },
  {
    quote: 'Forecasts land within 3% of actuals every quarter. Finance trusts them, which I didn’t think any tool could manage.',
    name: 'Felix Berg',
    role: 'CFO',
    company: 'Monolith',
  },
  {
    quote: 'The anomaly alerts are quiet until they matter. That restraint is exactly why my on-call engineers keep them turned on.',
    name: 'Amara Lindqvist',
    role: 'Engineering Manager',
    company: 'Lumen',
  },
  {
    quote: 'It feels like hiring a senior analyst who never sleeps and never says “that’s on the backlog”.',
    name: 'Diego Hernández',
    role: 'Head of Product',
    company: 'Solstice',
  },
  {
    quote: 'We onboarded 40 people across sales and CS in a week. Nobody needed SQL training, just curiosity.',
    name: 'Hana Kobayashi',
    role: 'RevOps Manager',
    company: 'Arcadia',
  },
  {
    quote: 'The product reveal on our board deck came straight from a Dashward answer. The investors asked what tool we used.',
    name: 'Sam Whitfield',
    role: 'Founder & CEO',
    company: 'Quanta',
  },
]

function Card({ q }: { q: (typeof QUOTES)[number] }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between gap-6 rounded-3xl border border-border bg-surface p-6 shadow-elevated sm:w-[24rem] dark:bg-surface/60">
      <blockquote className="text-[15px] leading-relaxed text-fg">
        <span className="font-serif text-3xl leading-none text-accent">“</span>
        {q.quote}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar name={q.name} className="size-9" />
        <div className="leading-tight">
          <p className="text-sm font-medium">{q.name}</p>
          <p className="text-xs text-fg-muted">
            {q.role} @ {q.company}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const a = QUOTES.slice(0, 5)
  const b = QUOTES.slice(5)
  return (
    <section className="relative overflow-x-clip py-20 sm:py-28">
      <div className="px-4 sm:px-8">
        <SectionHeading
          eyebrow="Loved by operators"
          title={
            <>
              Teams stopped arguing about numbers. <Serif className="text-accent">Started</Serif> shipping.
            </>
          }
        />
      </div>
      <div className="mt-16 flex flex-col gap-5 mask-fade-x">
        <Marquee duration={70} gap="1.25rem">
          {a.map((q) => (
            <Card key={q.name} q={q} />
          ))}
        </Marquee>
        <Marquee duration={80} gap="1.25rem" reverse>
          {b.map((q) => (
            <Card key={q.name} q={q} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
