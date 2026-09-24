import { motion, type HTMLMotionProps } from 'motion/react'
import { fadeUp, stagger as staggerV } from '@/lib/motion'

/** Fade/blur-up when scrolled into view. Wrap children in <Reveal.Item> to stagger. */
export function Reveal({ stagger = 0.08, delay = 0, ...props }: HTMLMotionProps<'div'> & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      variants={staggerV(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      {...props}
    />
  )
}

function RevealItem(props: HTMLMotionProps<'div'>) {
  return <motion.div variants={fadeUp} {...props} />
}

Reveal.Item = RevealItem
