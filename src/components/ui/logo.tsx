import { useId } from 'react'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  const gid = `dw-logo-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 32 32" className={cn('size-7', className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset=".55" stopColor="var(--accent-2)" />
          <stop offset="1" stopColor="var(--accent-3)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" className="fill-fg" />
      <path d="M8 22V10h6.5a6 6 0 0 1 0 12H8z" fill="none" stroke={`url(#${gid})`} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="23.5" cy="10" r="2.5" fill={`url(#${gid})`} />
    </svg>
  )
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-semibold tracking-tight', className)}>
      <LogoMark />
      {!compact && <span className="text-[17px]">Dashward</span>}
    </span>
  )
}
