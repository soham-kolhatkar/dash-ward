import { motion } from 'motion/react'
import { Marquee } from '@/components/fx'
import { fadeUp, inView } from '@/lib/motion'
import { WORDMARKS } from '@/features/marketing/Wordmarks'

export function LogoMarquee() {
  return (
    <section aria-label="Customers" className="relative overflow-x-clip py-14 sm:py-20">
      <motion.p
        variants={fadeUp}
        {...inView}
        className="mb-9 text-center font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase"
      >
        Trusted by data teams at
      </motion.p>
      <Marquee duration={45} gap="4rem" className="mask-fade-x">
        {WORDMARKS.map((w) => (
          <span
            key={w.name}
            className="text-fg-subtle opacity-70 grayscale transition-all duration-500 hover:text-fg hover:opacity-100 hover:grayscale-0"
            title={w.name}
          >
            {w.node}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
