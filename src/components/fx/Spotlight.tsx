import { useRef, type HTMLAttributes, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card whose border and surface light up under the cursor.
 * Uses CSS vars so there is no React re-render on pointer move.
 */
export function SpotlightCard({
  className,
  children,
  glow = 'var(--accent)',
  ...props
}: HTMLAttributes<HTMLDivElement> & { glow?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        'group/spot relative isolate overflow-hidden rounded-3xl border border-border bg-surface shadow-elevated dark:bg-surface/60',
        className,
      )}
      style={{ ['--spot' as string]: glow }}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--spot) 14%, transparent), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          padding: 1,
          background:
            'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--spot) 70%, transparent), transparent 60%)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  )
}
