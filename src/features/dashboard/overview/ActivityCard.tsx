import { AnimatePresence, motion } from 'motion/react'
import { CircleArrowUp, CreditCard, GitBranch, MessageSquare, TriangleAlert, UserPlus, Activity as ActivityIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ChartCard } from '@/components/charts'
import { ACTIVITY, type Activity } from '@/data/misc'
import { fmt } from '@/lib/format'

const KIND: Record<Activity['kind'], { icon: typeof UserPlus; color: string }> = {
  upgrade: { icon: CircleArrowUp, color: 'var(--accent)' },
  signup: { icon: UserPlus, color: 'var(--accent-2)' },
  alert: { icon: TriangleAlert, color: 'var(--danger)' },
  comment: { icon: MessageSquare, color: 'var(--warning)' },
  deploy: { icon: GitBranch, color: 'var(--accent-3)' },
  payment: { icon: CreditCard, color: 'var(--success)' },
}

const VISIBLE = 5

export function ActivityCard() {
  const [items, setItems] = useState(() => ACTIVITY.slice(0, VISIBLE))
  const [, setNow] = useState(0)

  useEffect(() => {
    let n = 0
    const id = setInterval(() => {
      const src = ACTIVITY[Math.floor(Math.random() * ACTIVITY.length)]
      n += 1
      setItems((xs) => [{ ...src, id: `${src.id}-live-${n}`, time: new Date().toISOString() }, ...xs].slice(0, VISIBLE))
      setNow(n)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <ChartCard
      title="Activity"
      description="What’s happening across your workspace"
      icon={<ActivityIcon />}
      contentClassName="pt-4"
    >
      <ul className="relative">
        <span aria-hidden className="absolute top-4 bottom-4 left-[15px] w-px bg-gradient-to-b from-border-strong via-border to-transparent" />
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((a) => {
            const k = KIND[a.kind]
            return (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: -14, scale: 0.97, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="relative flex gap-3 py-2"
              >
                <span
                  className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-surface"
                  style={{
                    color: k.color,
                    borderColor: `color-mix(in oklch, ${k.color} 28%, transparent)`,
                    boxShadow: `0 0 0 4px var(--surface), inset 0 0 0 20px color-mix(in oklch, ${k.color} 10%, transparent)`,
                  }}
                >
                  <k.icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium text-fg">{a.who}</span>
                    <time className="shrink-0 text-[11px] text-fg-subtle tabular-nums" dateTime={a.time}>
                      {fmt.relative(a.time)}
                    </time>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-fg-subtle">
                    {a.action} <span className="text-fg-muted">{a.target}</span>
                  </p>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </ChartCard>
  )
}
