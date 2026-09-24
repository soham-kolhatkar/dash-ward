import { useId } from 'react'

/** Stable, URL-safe id for SVG gradient/mask references. */
export function useSvgId(prefix = 'g') {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
}

/** Tailwind-free color-mix helper for inline styles. */
export const mix = (color: string, pct: number, base = 'transparent') =>
  `color-mix(in oklch, ${color} ${pct}%, ${base})`
