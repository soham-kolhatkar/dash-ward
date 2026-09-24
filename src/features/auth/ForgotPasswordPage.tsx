import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Mail, RotateCw } from 'lucide-react'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ease } from '@/lib/motion'
import { sleep } from '@/lib/utils'
import { AnimatedError, AuthHeading, Row, SubmitButton, type SubmitState } from './components'

const schema = z.object({ email: z.email('Enter the email you signed up with') })
type Values = z.infer<typeof schema>

const RESEND = 30
const FLAP = 'M16 64 L88 104 L160 64 L148 54 a14 14 0 0 0 -8 -2 H36 a14 14 0 0 0 -8 2 Z'

function Envelope() {
  return (
    <div className="relative mx-auto mb-8 h-36 w-44">
      <motion.div
        aria-hidden
        className="absolute inset-x-4 bottom-2 h-6 rounded-[50%] bg-accent/25 blur-xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />
      <motion.svg
        viewBox="0 0 176 144"
        className="relative size-full overflow-visible"
        aria-hidden
        initial={{ y: 24, opacity: 0, rotate: -6 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      >
        <defs>
          <linearGradient id="fp-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
          <linearGradient id="fp-flap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="color-mix(in oklch, var(--accent) 70%, var(--accent-2))" />
          </linearGradient>
          <clipPath id="fp-clip">
            <rect x="16" y="-60" width="144" height="180" />
          </clipPath>
        </defs>
        {/* back of envelope */}
        <rect x="16" y="52" width="144" height="84" rx="12" fill="url(#fp-body)" opacity=".55" />
        {/* flap, back half of the fold (sits behind the letter) */}
        <motion.path
          d={FLAP}
          fill="url(#fp-flap)"
          opacity=".8"
          style={{ transformOrigin: '88px 58px', transformBox: 'view-box' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: -1 }}
          transition={{ delay: 0.6, duration: 0.3, ease: 'easeOut' }}
        />
        {/* letter rising out */}
        <g clipPath="url(#fp-clip)">
          <motion.g initial={{ y: 40 }} animate={{ y: -18 }} transition={{ delay: 0.75, duration: 0.9, ease: ease.outExpo }}>
            <rect x="32" y="40" width="112" height="80" rx="8" className="fill-surface" stroke="var(--border-strong)" />
            <rect x="46" y="56" width="52" height="6" rx="3" className="fill-fg/15" />
            <rect x="46" y="70" width="84" height="5" rx="2.5" className="fill-fg/10" />
            <rect x="46" y="81" width="70" height="5" rx="2.5" className="fill-fg/10" />
            <motion.circle cx="126" cy="59" r="9" fill="var(--success)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: 'spring', stiffness: 400, damping: 14 }} />
            <motion.path
              d="M121.5 59.5l3 3 6-6.5"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.55, duration: 0.35 }}
            />
          </motion.g>
        </g>
        {/* front pocket */}
        <path d="M16 64 L88 104 L160 64 V124 a12 12 0 0 1 -12 12 H28 a12 12 0 0 1 -12 -12 Z" fill="url(#fp-body)" />
        <path d="M16 136 L70 94 M160 136 L106 94" stroke="white" strokeOpacity=".22" strokeWidth="1.5" />
        {/* flap, front half of the fold */}
        <motion.path
          d={FLAP}
          fill="url(#fp-flap)"
          style={{ transformOrigin: '88px 58px', transformBox: 'view-box' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ delay: 0.35, duration: 0.25, ease: 'easeIn' }}
        />
      </motion.svg>
      {[
        { x: -8, y: 18, d: 1.6, c: 'var(--accent-3)' },
        { x: 168, y: 30, d: 1.8, c: 'var(--accent-2)' },
        { x: 150, y: -4, d: 2, c: 'var(--accent)' },
        { x: 6, y: -6, d: 2.2, c: 'var(--accent-4)' },
      ].map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute size-2 rounded-full"
          style={{ left: s.x, top: s.y, background: s.c, boxShadow: `0 0 12px ${s.c}` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.8] }}
          transition={{ delay: s.d, duration: 0.6 }}
        />
      ))}
    </div>
  )
}

function Sent({ email, onResend }: { email: string; onResend: () => Promise<void> }) {
  const [left, setLeft] = useState(RESEND)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: ease.outExpo }}
      className="text-center"
    >
      <Envelope />
      <h1 className="text-[2rem] leading-tight font-semibold tracking-[-0.03em]">
        Check your <span className="font-serif font-normal tracking-normal italic text-gradient">inbox</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-fg-muted" aria-live="polite">
        We sent a secure reset link to <span className="block truncate font-medium text-fg">{email}</span>It expires in 30 minutes.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="secondary"
          size="lg"
          loading={busy}
          disabled={left > 0}
          onClick={async () => {
            setBusy(true)
            await onResend()
            setBusy(false)
            setLeft(RESEND)
          }}
          className="w-full rounded-xl"
        >
          {!busy && <RotateCw />}
          {left > 0 ? (
            <span>
              Resend in <span className="tabular-nums">0:{String(left).padStart(2, '0')}</span>
            </span>
          ) : (
            'Resend email'
          )}
        </Button>
        <p className="text-xs text-fg-subtle">Nothing yet? Check spam, or make sure it’s the address you signed up with.</p>
      </div>
    </motion.div>
  )
}

export default function ForgotPasswordPage() {
  const id = useId()
  const [state, setState] = useState<SubmitState>('idle')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { email: '' } })

  const onSubmit = async ({ email }: Values) => {
    setState('loading')
    await sleep(1100)
    setState('success')
    await sleep(500)
    setSentTo(email)
  }

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <Sent
            key="sent"
            email={sentTo}
            onResend={async () => {
              await sleep(900)
              toast.success('Reset link sent again', { description: sentTo })
            }}
          />
        ) : (
          <motion.div key="form" exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }} transition={{ duration: 0.35 }}>
            <AuthHeading eyebrow="Account recovery" title="Forgot your" accent="password?">
              It happens to the best of us. Enter your email and we’ll send a link to reset it.
            </AuthHeading>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Row i={1}>
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@company.com"
                  icon={<Mail />}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${id}-email-err` : undefined}
                  {...register('email')}
                />
                <AnimatedError id={`${id}-email-err`} message={errors.email?.message} />
              </Row>
              <Row i={2} className="pt-2">
                <SubmitButton state={state}>Send reset link</SubmitButton>
              </Row>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-center text-sm">
        <Link to="/login" className="group inline-flex items-center gap-1.5 font-medium text-fg-muted transition hover:text-fg">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
