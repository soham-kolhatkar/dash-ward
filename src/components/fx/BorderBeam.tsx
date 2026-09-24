import { cn } from '@/lib/utils'

/** A glowing light that travels around the border of its `relative` parent. */
export function BorderBeam({
  size = 180,
  duration = 8,
  delay = 0,
  className,
  from = 'var(--accent)',
  to = 'var(--accent-2)',
}: {
  size?: number
  duration?: number
  delay?: number
  className?: string
  from?: string
  to?: string
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent', className)}
      style={{
        WebkitMask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        mask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        maskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
    >
      <div
        className="absolute aspect-square animate-border-beam"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${from}, ${to}, transparent)`,
          ['--beam-duration' as string]: `${duration}s`,
          animationDelay: `-${delay}s`,
        }}
      />
    </div>
  )
}
