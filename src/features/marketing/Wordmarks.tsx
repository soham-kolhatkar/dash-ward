import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

function Mark({ glyph, children, className }: { glyph?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-2 whitespace-nowrap select-none', className)}>
      {glyph && (
        <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {glyph}
        </svg>
      )}
      {children}
    </span>
  )
}

export const WORDMARKS: { name: string; node: ReactNode }[] = [
  {
    name: 'Northwind',
    node: (
      <Mark glyph={<path d="M12 2 20 21l-8-5-8 5z" fill="currentColor" stroke="none" />} className="text-xl font-bold tracking-tight">
        Northwind
      </Mark>
    ),
  },
  {
    name: 'Halcyon',
    node: (
      <Mark glyph={<circle cx="12" cy="12" r="8" />} className="font-serif text-[26px] italic">
        Halcyon
      </Mark>
    ),
  },
  {
    name: 'Vertex',
    node: (
      <Mark
        glyph={<path d="M3 5h18L12 20z" fill="currentColor" stroke="none" />}
        className="font-mono text-base font-semibold tracking-[0.28em] uppercase"
      >
        Vertex
      </Mark>
    ),
  },
  {
    name: 'Lumen',
    node: (
      <Mark
        glyph={
          <>
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
          </>
        }
        className="text-xl font-light tracking-[-0.02em]"
      >
        lumen
      </Mark>
    ),
  },
  {
    name: 'Quanta',
    node: (
      <Mark
        glyph={
          <>
            <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" stroke="none" />
            <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" stroke="none" />
            <rect x="13" y="3" width="8" height="8" rx="4" />
          </>
        }
        className="text-xl font-extrabold tracking-[-0.04em]"
      >
        QUANTA
      </Mark>
    ),
  },
  {
    name: 'Oakline',
    node: (
      <Mark glyph={<path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16zM4 20l8-8" />} className="text-xl font-medium tracking-tight">
        Oakline<span className="text-[0.6em] align-super">®</span>
      </Mark>
    ),
  },
  {
    name: 'Parallel',
    node: (
      <Mark
        glyph={
          <>
            <path d="M7 3 3 21M14 3l-4 18M21 3l-4 18" />
          </>
        }
        className="font-serif text-[26px]"
      >
        Parallel
      </Mark>
    ),
  },
  {
    name: 'Monolith',
    node: (
      <Mark glyph={<rect x="8" y="2" width="8" height="20" rx="1" fill="currentColor" stroke="none" />} className="text-lg font-black tracking-[0.18em] uppercase">
        Monolith
      </Mark>
    ),
  },
  {
    name: 'Kestrel',
    node: (
      <Mark glyph={<path d="M2 14c5-1 8-5 10-10 1 5 4 8 10 9-6 1-10 4-12 8-1-4-4-6-8-7z" fill="currentColor" stroke="none" />} className="text-xl font-semibold italic tracking-tight">
        Kestrel
      </Mark>
    ),
  },
  {
    name: 'Solstice',
    node: (
      <Mark
        glyph={
          <>
            <path d="M3 17a9 9 0 0 1 18 0" />
            <path d="M1 21h22" />
          </>
        }
        className="font-mono text-lg tracking-tight"
      >
        solstice.io
      </Mark>
    ),
  },
  {
    name: 'Arcadia',
    node: (
      <Mark glyph={<path d="M3 21 12 3l9 18M7 14h10" />} className="text-xl font-semibold tracking-[-0.03em]">
        Arcadia<span className="text-accent">.</span>
      </Mark>
    ),
  },
]
