import { cn } from '@/lib/utils'

/** Soft animated blobs of brand color. Place inside a `relative overflow-hidden` parent. */
export function Aurora({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden [&>div]:will-change-transform', className)}>
      <div
        className="absolute -top-1/3 -left-1/4 size-[70vmax] animate-aurora rounded-full"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 68%)', opacity: 0.35 * intensity }}
      />
      <div
        className="absolute -top-1/4 -right-1/4 size-[60vmax] animate-aurora rounded-full [animation-delay:-6s] [animation-duration:22s]"
        style={{ background: 'radial-gradient(circle, var(--accent-2) 0%, transparent 68%)', opacity: 0.28 * intensity }}
      />
      <div
        className="absolute -bottom-1/3 left-1/4 size-[55vmax] animate-aurora rounded-full [animation-delay:-12s] [animation-duration:26s]"
        style={{ background: 'radial-gradient(circle, var(--accent-3) 0%, transparent 68%)', opacity: 0.16 * intensity }}
      />
    </div>
  )
}
