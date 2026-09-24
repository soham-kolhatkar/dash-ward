import { useEffect, useRef } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomCursor, Noise } from '@/components/fx'
import { LenisProvider, useLenis } from '@/hooks/useLenis'
import { ease } from '@/lib/motion'
import { MarketingNav } from './MarketingNav'
import { Footer } from './Footer'

function scrollToHash(hash: string, lenis: ReturnType<typeof useLenis>) {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

function Shell() {
  const location = useLocation()
  const outlet = useOutlet()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis
  const pathRef = useRef(location.pathname)

  useEffect(() => {
    if (!location.hash) return
    const samePage = pathRef.current === location.pathname
    const t = setTimeout(() => scrollToHash(location.hash, lenisRef.current), samePage ? 0 : 900)
    return () => clearTimeout(t)
  }, [location.key, location.hash, location.pathname])

  useEffect(() => {
    pathRef.current = location.pathname
  }, [location.pathname])

  const toTop = () => {
    if (location.hash) return
    const l = lenisRef.current
    if (l) l.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <Noise />
      <CustomCursor />
      <MarketingNav />
      <AnimatePresence mode="wait" onExitComplete={toTop}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: ease.inOutQuart } }}
          transition={{ duration: 0.7, ease: ease.outExpo }}
          onAnimationComplete={() => ScrollTrigger.refresh()}
          className="relative"
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default function MarketingLayout() {
  return (
    <LenisProvider>
      <Shell />
    </LenisProvider>
  )
}
