import { useState, type FormEvent } from 'react'
import { Building, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FieldError, Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { Customer, Plan } from '@/data/customers'
import { sleep } from '@/lib/utils'
import { PLAN_BASE_MRR } from './meta'

const PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: 'Starter', label: 'Starter · $49/mo' },
  { value: 'Growth', label: 'Growth · $299/mo' },
  { value: 'Scale', label: 'Scale · $1,200/mo' },
  { value: 'Enterprise', label: 'Enterprise · custom' },
]

const empty = { name: '', email: '', company: '', plan: 'Growth' as Plan, seats: '5' }

export function AddCustomerDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onCreate: (c: Customer) => void
}) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({})
  const [busy, setBusy] = useState(false)
  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = 'Enter the customer’s full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid work email.'
    if (!form.company.trim()) next.company = 'Company is required.'
    const seats = Number(form.seats)
    if (!Number.isInteger(seats) || seats < 1) next.seats = 'At least 1 seat.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    await sleep(650)
    const now = new Date().toISOString()
    onCreate({
      id: `cus_${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      company: form.company.trim(),
      plan: form.plan,
      status: 'trial',
      mrr: PLAN_BASE_MRR[form.plan],
      seats,
      country: 'US',
      joined: now,
      lastActive: now,
      health: 82,
    })
    setBusy(false)
    setForm(empty)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setErrors({})
        onOpenChange(o)
      }}
    >
      <DialogContent title="Add customer" description="They’ll start on a 14-day trial of the selected plan.">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <Label htmlFor="nc-name">Full name</Label>
            <Input id="nc-name" icon={<User />} placeholder="Jordan Ellis" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} autoFocus />
            <FieldError>{errors.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="nc-email">Work email</Label>
            <Input id="nc-email" type="email" icon={<Mail />} placeholder="jordan@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
            <FieldError>{errors.email}</FieldError>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <div>
              <Label htmlFor="nc-company">Company</Label>
              <Input id="nc-company" icon={<Building />} placeholder="Northwind" value={form.company} onChange={(e) => set('company', e.target.value)} aria-invalid={!!errors.company} />
              <FieldError>{errors.company}</FieldError>
            </div>
            <div>
              <Label htmlFor="nc-seats">Seats</Label>
              <Input id="nc-seats" inputMode="numeric" className="font-mono tabular-nums" value={form.seats} onChange={(e) => set('seats', e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.seats} />
              <FieldError>{errors.seats}</FieldError>
            </div>
          </div>
          <div>
            <Label>Plan</Label>
            <Select value={form.plan} onValueChange={(v) => set('plan', v as Plan)} options={PLAN_OPTIONS} className="h-11 w-full rounded-xl" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm" loading={busy}>
              Add customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
