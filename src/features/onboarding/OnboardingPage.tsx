import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/misc'
import { Aurora, Noise } from '@/components/fx'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuth } from '@/store/auth'
import { useOnboarding } from '@/store/onboarding'
import { ease } from '@/lib/motion'
import { slugify } from '@/lib/utils'
import { FINAL_STEP, STEPS, continueLabel, isStepValid } from './config'
import { ProgressBar, ProgressRail } from './ProgressRail'
import { WorkspaceStep } from './steps/WorkspaceStep'
import { AboutStep } from './steps/AboutStep'
import { GoalsStep } from './steps/GoalsStep'
import { ConnectStep } from './steps/ConnectStep'
import { InviteStep } from './steps/InviteStep'
import { ThemeStep } from './steps/ThemeStep'
import { FinishScreen } from './steps/FinishScreen'

const VIEWS = [WorkspaceStep, AboutStep, GoalsStep, ConnectStep, InviteStep, ThemeStep]

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 56, filter: 'blur(10px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (d: number) => ({ opacity: 0, x: d * -56, filter: 'blur(10px)' }),
}

const SKIP_KEYS = 'button, a, textarea, select, [role="combobox"], [role="listbox"], [role="option"], [contenteditable="true"]'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const data = useOnboarding()
  const { user, completeOnboarding } = useAuth()
  const step = Math.min(Math.max(0, data.step), FINAL_STEP)
  const [dir, setDir] = useState(1)
  const valid = isStepValid(step, data)

  const go = (n: number) => {
    setDir(n > step ? 1 : -1)
    data.setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const next = () => valid && go(step + 1)
  const back = () => step > 0 && go(step - 1)

  const skip = () => {
    const s = useOnboarding.getState()
    if (!s.workspace.trim()) {
      const ws = `${user?.name.split(' ')[0] ?? 'My'}’s workspace`
      s.update({ workspace: ws, slug: slugify(ws) })
    }
    completeOnboarding()
    navigate('/app', { replace: true })
  }

  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.defaultPrevented || e.isComposing || e.shiftKey || e.metaKey || e.ctrlKey) return
      const t = e.target as HTMLElement | null
      if (t?.closest(SKIP_KEYS)) return
      e.preventDefault()
      nextRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const View = VIEWS[step]
  const final = step >= FINAL_STEP

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-bg">
      <Noise />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <Aurora intensity={final ? 0.9 : 0.45} />
        <div className="absolute inset-0 bg-dots mask-radial" />
      </div>

      <AnimatePresence mode="wait">
        {final ? (
          <FinishScreen key="final" />
        ) : (
          <motion.div key="wizard" exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }} transition={{ duration: 0.45 }} className="flex min-h-dvh flex-col">
            <header className="sticky top-0 z-30 bg-gradient-to-b from-bg via-bg/85 to-transparent px-4 pt-4 pb-5 sm:px-8 lg:pt-6">
              <div className="flex items-center justify-between gap-3">
                <Link to="/" aria-label="Dashward home" className="shrink-0">
                  <Logo />
                </Link>
                <p className="hidden text-sm text-fg-muted sm:block" aria-live="polite">
                  Step{' '}
                  <span className="relative inline-flex overflow-hidden align-bottom font-medium text-fg tabular-nums">
                    <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                      <motion.span
                        key={step}
                        custom={dir}
                        initial={{ y: dir * 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: dir * -14, opacity: 0 }}
                        transition={{ duration: 0.3, ease: ease.outExpo }}
                      >
                        {step + 1}
                      </motion.span>
                    </AnimatePresence>
                  </span>{' '}
                  of {STEPS.length}
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={skip} className="rounded-full px-3 py-1.5 text-sm text-fg-muted transition hover:bg-surface-2 hover:text-fg">
                    Skip for now
                  </button>
                  <ThemeToggle />
                </div>
              </div>
              <div className="mt-4 lg:hidden">
                <div className="mb-2 flex justify-between text-xs text-fg-subtle sm:hidden">
                  <span className="font-medium text-fg">{STEPS[step].title}</span>
                  <span className="tabular-nums">
                    Step {step + 1} of {STEPS.length}
                  </span>
                </div>
                <ProgressBar step={step} />
              </div>
            </header>

            <div className="mx-auto flex w-full max-w-6xl flex-1 gap-12 px-4 sm:px-8 xl:gap-20">
              <aside className="hidden w-60 shrink-0 lg:block">
                <div className="sticky top-28 pt-8">
                  <ProgressRail step={step} onJump={go} />
                  <div className="mt-10 rounded-2xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-fg-muted backdrop-blur">
                    <p className="font-medium text-fg">Takes about 2 minutes</p>
                    <p className="mt-1">Everything here can be changed later in Settings.</p>
                  </div>
                </div>
              </aside>

              <main className="min-w-0 flex-1 pt-6 pb-36 sm:pt-10 lg:pt-16">
                <div className="mx-auto max-w-2xl">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: ease.outExpo }}
                    >
                      <View />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </div>

            <footer className="fixed inset-x-0 bottom-0 z-30">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/90 to-transparent" />
              <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-6 lg:pl-[calc(2rem+15rem+3rem)] xl:pl-[calc(2rem+15rem+5rem)]">
                <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
                  <AnimatePresence initial={false}>
                    {step > 0 && (
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                        <Button variant="secondary" size="lg" onClick={back} className="px-5" aria-label="Back">
                          <ArrowLeft />
                          <span className="hidden sm:inline">Back</span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="ml-auto hidden items-center gap-1.5 text-xs text-fg-subtle sm:flex">
                    {valid ? (
                      <>
                        Press <Kbd><CornerDownLeft className="size-3" /></Kbd>
                      </>
                    ) : (
                      'Complete this step to continue'
                    )}
                  </span>
                  <Button
                    size="lg"
                    variant={step === STEPS.length - 1 ? 'brand' : 'primary'}
                    onClick={next}
                    disabled={!valid}
                    className="group flex-1 sm:ml-2 sm:min-w-44 sm:flex-none"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={continueLabel(step, data)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {continueLabel(step, data)}
                      </motion.span>
                    </AnimatePresence>
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
