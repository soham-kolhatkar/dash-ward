import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, AtSign, User } from 'lucide-react'
import { Input, Label } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/store/auth'
import { useOnboarding } from '@/store/onboarding'
import { sleep } from '@/lib/utils'
import { AnimatedError, AuthHeading, OrDivider, PasswordInput, Row, SocialButtons, SubmitButton, type SubmitState } from './components'
import { PasswordStrength } from './PasswordStrength'

const schema = z.object({
  name: z.string().trim().min(2, 'Tell us what to call you'),
  email: z.email('Enter a valid work email'),
  password: z.string().min(8, 'Use at least 8 characters'),
  terms: z.boolean().refine((v) => v, 'Please accept the terms to continue'),
})
type Values = z.infer<typeof schema>

export default function SignupPage() {
  const id = useId()
  const navigate = useNavigate()
  const signIn = useAuth((s) => s.signIn)
  const [state, setState] = useState<SubmitState>('idle')
  const [social, setSocial] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', terms: false },
  })
  const password = useWatch({ control, name: 'password' })

  const start = (name: string, email: string) => {
    signIn({ name, email })
    useAuth.setState({ onboarded: false })
    useOnboarding.getState().reset()
    toast.success('Account created', { description: `Let’s set up your workspace, ${name.split(' ')[0]}.` })
    navigate('/onboarding')
  }

  const onSubmit = async ({ name, email }: Values) => {
    setState('loading')
    await sleep(1200)
    setState('success')
    await sleep(650)
    start(name.trim(), email)
  }

  const onSocial = async (provider: string) => {
    setSocial(provider)
    await sleep(900)
    start('Ava Chen', 'ava@northwind.io')
  }

  return (
    <div>
      <AuthHeading eyebrow="14-day free trial" title="Start seeing" accent="clearly">
        Your AI analyst is two minutes away. No card required.
      </AuthHeading>

      <SocialButtons onSelect={onSocial} busy={social} />
      <OrDivider />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Row i={1}>
          <Label htmlFor={`${id}-name`}>Full name</Label>
          <Input
            id={`${id}-name`}
            autoComplete="name"
            placeholder="Ava Chen"
            icon={<User />}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
            {...register('name')}
          />
          <AnimatedError id={`${id}-name-err`} message={errors.name?.message} />
        </Row>
        <Row i={2}>
          <Label htmlFor={`${id}-email`}>Work email</Label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            placeholder="ava@company.com"
            icon={<AtSign />}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
            {...register('email')}
          />
          <AnimatedError id={`${id}-email-err`} message={errors.email?.message} />
        </Row>
        <Row i={3}>
          <Label htmlFor={`${id}-pw`}>Password</Label>
          <PasswordInput
            id={`${id}-pw`}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            aria-describedby={`${id}-pw-meter${errors.password ? ` ${id}-pw-err` : ''}`}
            {...register('password')}
          />
          <PasswordStrength id={`${id}-pw-meter`} password={password ?? ''} />
          <AnimatedError id={`${id}-pw-err`} message={errors.password?.message} />
        </Row>
        <Row i={4}>
          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <Checkbox
                  id={`${id}-terms`}
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? `${id}-terms-err` : undefined}
                  className="mt-0.5"
                />
              )}
            />
            <label htmlFor={`${id}-terms`} className="text-sm leading-snug text-fg-muted">
              I agree to the{' '}
              <a href="#" className="text-fg underline decoration-border-strong underline-offset-2 hover:decoration-accent">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-fg underline decoration-border-strong underline-offset-2 hover:decoration-accent">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          <AnimatedError id={`${id}-terms-err`} message={errors.terms?.message} />
        </Row>
        <Row i={5} className="pt-2">
          <SubmitButton state={state} variant="brand">
            Create account <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </SubmitButton>
        </Row>
      </form>

      <p className="mt-8 text-center text-sm text-fg-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-fg underline decoration-border-strong underline-offset-4 transition hover:decoration-accent">
          Sign in
        </Link>
      </p>
    </div>
  )
}
