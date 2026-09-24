import { Preloader } from './sections/Preloader'
import { Hero } from './sections/Hero'
import { LogoMarquee } from './sections/LogoMarquee'
import { ProductReveal } from './sections/ProductReveal'
import { BentoFeatures } from './sections/BentoFeatures'
import { HowItWorks } from './sections/HowItWorks'
import { Stats } from './sections/Stats'
import { Testimonials } from './sections/Testimonials'
import { PricingTeaser } from './sections/PricingTeaser'
import { FinalCTA } from './sections/FinalCTA'

export default function LandingPage() {
  return (
    <>
      <Preloader />
      <Hero />
      <LogoMarquee />
      <ProductReveal />
      <BentoFeatures />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <PricingTeaser />
      <FinalCTA />
    </>
  )
}
