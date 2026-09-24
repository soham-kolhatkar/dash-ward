import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP)

/**
 * Splits text into lines/words/chars and reveals them with a masked slide-up.
 * `trigger="load"` animates immediately (after `delay`); `"scroll"` waits until in view.
 */
export function TextReveal({
  children,
  as: Tag = 'div',
  className,
  by = 'words',
  delay = 0,
  stagger = 0.04,
  trigger = 'scroll',
  duration = 1,
}: {
  children: ReactNode
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  by?: 'chars' | 'words' | 'lines'
  delay?: number
  stagger?: number
  trigger?: 'load' | 'scroll'
  duration?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(ref.current, { autoAlpha: 1 })
        return
      }
      const split = SplitText.create(ref.current, {
        type: by === 'lines' ? 'lines' : by === 'chars' ? 'words,chars' : 'words',
        mask: by === 'chars' ? 'words' : by,
        autoSplit: true,
        onSplit(self) {
          gsap.set(ref.current, { autoAlpha: 1 })
          const targets = by === 'chars' ? self.chars : by === 'lines' ? self.lines : self.words
          return gsap.from(targets, {
            yPercent: 110,
            rotate: by === 'chars' ? 8 : 3,
            opacity: 0,
            duration,
            stagger,
            delay,
            ease: 'expo.out',
            scrollTrigger: trigger === 'scroll' ? { trigger: ref.current, start: 'top 88%', once: true } : undefined,
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref, dependencies: [] },
  )

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={cn('invisible', className)}>
      {children}
    </Tag>
  )
}
