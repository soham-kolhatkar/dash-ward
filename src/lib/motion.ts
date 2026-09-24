import type { Transition, Variants } from 'motion/react'

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
}

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 1 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
  bouncy: { type: 'spring', stiffness: 300, damping: 15 } satisfies Transition,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: ease.outExpo },
    transitionEnd: { filter: 'none' },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: ease.outExpo } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: ease.outExpo } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Standard props for "animate when scrolled into view". */
export const inView = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-80px' },
} as const
