import { useId, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { Input, Label } from '@/components/ui/input'
import { useAuth } from '@/store/auth'
import { sleep } from '@/lib/utils'
import { AnimatedError, AuthHeading, OrDivider, PasswordInput, Row, SocialButtons, SubmitButton, nameFromEmail, type SubmitState } from './components'

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password').min(8, 'Passwords are at least 8 characters'),
})
type Values = z.infer<typeof schema>

export default function LoginPage() {
  const id = useId()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, completeOnboarding, demoLogin } = useAuth()
  const [state, setState] = useState<SubmitState>('idle')
  const [social, setSocial] = useState<string | null>(null)
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { email: '', password: '' } })

  const finish = (name: string, email: string) => {
    signIn({ name, email })
    completeOnboarding()
    toast.success(`Welcome back, ${name.split(' ')[0]}`, { description: 'Your workspace is right where you left it.' })
    navigate(from.startsWith('/app') ? from : '/app', { replace: true })
  }

  const onSubmit = async ({ email }: Values) => {
    setState('loading')
    await sleep(1100)
    setState('success')
    await sleep(650)
    finish(nameFromEmail(email), email)
  }

  const onSocial = async (provider: string) => {
    setSocial(provider)
    await sleep(900)
    finish('Ava Chen', 'ava@northwind.io')
  }

  return (
    <div>
      <AuthHeading eyebrow="Sign in" title="Welcome" accent="back">
        Pick up where your metrics left off.
      </AuthHeading>

      <SocialButtons onSelect={onSocial} busy={social} />
      <OrDivider />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Row i={1}>
          <Label htmlFor={`${id}-email`}>Work email</Label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            icon={<Mail />}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
            {...register('email')}
          />
          <AnimatedError id={`${id}-email-err`} message={errors.email?.message} />
        </Row>
        <Row i={2}>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor={`${id}-pw`} className="mb-0">
              Password
            </Label>
            <Link to="/forgot-password" className="text-xs font-medium text-fg-muted transition hover:text-accent">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id={`${id}-pw`}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${id}-pw-err` : undefined}
            {...register('password')}
          />
          <AnimatedError id={`${id}-pw-err`} message={errors.password?.message} />
        </Row>
        <Row i={3} className="pt-2">
          <SubmitButton state={state}>
            Sign in <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </SubmitButton>
        </Row>
      </form>

      <Row i={4} className="mt-5">
        <button
          type="button"
          onClick={() => {
            demoLogin()
            toast.success('Signed in to the demo workspace', { description: 'Exploring as Ava Chen at Northwind.' })
            navigate('/app')
          }}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-3 text-sm text-fg-muted transition hover:border-accent/50 hover:bg-accent/5 hover:text-fg"
        >
          <Sparkles className="size-4 text-accent transition-transform group-hover:rotate-12" />
          Use demo account
          <span className="hidden text-fg-subtle sm:inline">— no signup needed</span>
        </button>
      </Row>

      <p className="mt-8 text-center text-sm text-fg-muted">
        New to Dashward?{' '}
        <Link to="/signup" className="font-medium text-fg underline decoration-border-strong underline-offset-4 transition hover:decoration-accent">
          Create an account
        </Link>
      </p>
    </div>
  )
}
