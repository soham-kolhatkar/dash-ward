import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Marquee({
  children,
  reverse,
  vertical,
  duration = 40,
  gap = '3rem',
  pauseOnHover = true,
  className,
  repeat = 2,
}: {
  children: ReactNode
  reverse?: boolean
  vertical?: boolean
  duration?: number
  gap?: string
  pauseOnHover?: boolean
  className?: string
  repeat?: number
}) {
  return (
    <div
      className={cn('group/mq flex overflow-hidden', vertical ? 'flex-col' : 'flex-row', className)}
      style={{ ['--marquee-duration' as string]: `${duration}s`, ['--marquee-gap' as string]: gap, gap }}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            'flex shrink-0 justify-around',
            vertical ? 'animate-marquee-y flex-col' : reverse ? 'animate-marquee-reverse' : 'animate-marquee',
            vertical && reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover/mq:[animation-play-state:paused]',
          )}
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
