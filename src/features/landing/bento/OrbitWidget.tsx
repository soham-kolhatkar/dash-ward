import { LogoMark } from '@/components/ui/logo'
import { INTEGRATIONS } from '@/data/integrations'
import { cn } from '@/lib/utils'

function Ring({ items, radius, duration, reverse }: { items: typeof INTEGRATIONS; radius: number; duration: number; reverse?: boolean }) {
  return (
    <div
      className={cn('absolute top-1/2 left-1/2 animate-spin-slow rounded-full border border-dashed border-border-strong', reverse && '[animation-direction:reverse]')}
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius, animationDuration: `${duration}s` }}
    >
      {items.map((it, i) => {
        const a = (i / items.length) * Math.PI * 2
        return (
          <div
            key={it.id}
            className="absolute"
            style={{ left: radius + Math.cos(a) * radius - 20, top: radius + Math.sin(a) * radius - 20 }}
          >
            <div
              className={cn('animate-spin-slow', !reverse && '[animation-direction:reverse]')}
              style={{ animationDuration: `${duration}s` }}
              title={it.name}
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-[11px] font-bold shadow-elevated"
                style={{ color: it.color }}
              >
                {it.glyph}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function OrbitWidget() {
  return (
    <div className="relative h-64 overflow-hidden mask-fade-y sm:h-72">
      <Ring items={INTEGRATIONS.slice(0, 3)} radius={62} duration={26} />
      <Ring items={INTEGRATIONS.slice(3)} radius={112} duration={40} reverse />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 animate-pulse-ring rounded-2xl bg-accent/25" />
        <div className="relative rounded-2xl border border-border bg-surface p-2 shadow-glow">
          <LogoMark className="size-9" />
        </div>
      </div>
    </div>
  )
}
