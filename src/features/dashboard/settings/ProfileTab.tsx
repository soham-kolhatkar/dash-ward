import { Camera, Mail, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn, sleep } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import { FloatingBar } from '../shared/FloatingBar'
import { Section, TabBody } from './ui'

const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (UTC−07:00)' },
  { value: 'America/New_York', label: 'Eastern Time (UTC−04:00)' },
  { value: 'Europe/London', label: 'London (UTC+01:00)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+02:00)' },
  { value: 'Asia/Kolkata', label: 'India (UTC+05:30)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
]

const BIO_MAX = 160

export function ProfileTab() {
  const user = useAuth((s) => s.user)
  const initial = useRef({
    name: user?.name ?? 'Ava Chen',
    email: user?.email ?? 'ava@northwind.io',
    title: 'Head of Growth',
    bio: 'Growth and analytics at Northwind. I like clean funnels, honest dashboards and very strong coffee.',
    timezone: 'America/Los_Angeles',
    avatar: user?.avatar,
  })
  const [saved, setSaved] = useState(initial.current)
  const [form, setForm] = useState(initial.current)
  const [saving, setSaving] = useState(false)
  const file = useRef<HTMLInputElement>(null)
  const dirty = (Object.keys(form) as (keyof typeof form)[]).some((k) => form[k] !== saved[k])
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  const save = async () => {
    if (!emailOk || !form.name.trim()) {
      toast.error('Check the highlighted fields')
      return
    }
    setSaving(true)
    await sleep(800)
    setSaving(false)
    setSaved(form)
    useAuth.setState((s) => ({ user: { ...(s.user ?? { name: '', email: '' }), name: form.name.trim(), email: form.email.trim(), avatar: form.avatar } }))
    toast.success('Profile updated', { description: 'Your teammates will see the changes right away.' })
  }

  return (
    <TabBody>
      <Section title="Avatar" description="Shown on comments, shared dashboards and in the team list. PNG or JPG, at least 256 × 256 px.">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => file.current?.click()}
            className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label="Upload a new avatar"
          >
            <Avatar name={form.name || 'You'} src={form.avatar} className="size-20 ring-4 ring-surface-2 [&_span]:text-xl" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
              <Camera className="size-5" />
            </span>
          </button>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => file.current?.click()}>
              <Upload /> Upload image
            </Button>
            {form.avatar && (
              <Button variant="ghost" size="sm" onClick={() => set('avatar', undefined)}>
                <Trash2 /> Remove
              </Button>
            )}
          </div>
          <input
            ref={file}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              if (f.size > 5 * 1024 * 1024) {
                toast.error('That image is over 5 MB')
                return
              }
              set('avatar', URL.createObjectURL(f))
            }}
          />
        </div>
      </Section>

      <Section title="Personal details" description="Your name and email are visible to everyone in the Northwind workspace.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-name">Full name</Label>
            <Input id="p-name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!form.name.trim()} />
          </div>
          <div>
            <Label htmlFor="p-email">Email</Label>
            <Input id="p-email" type="email" icon={<Mail />} value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!emailOk} />
          </div>
          <div>
            <Label htmlFor="p-title">Job title</Label>
            <Input id="p-title" value={form.title} placeholder="e.g. Data Lead" onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={(v) => set('timezone', v)} options={TIMEZONES} className="h-11 w-full rounded-xl" />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="p-bio">Bio</Label>
              <span className={cn('font-mono text-[11px] tabular-nums', form.bio.length > BIO_MAX ? 'text-danger' : 'text-fg-subtle')}>
                {form.bio.length}/{BIO_MAX}
              </span>
            </div>
            <Textarea id="p-bio" rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value.slice(0, BIO_MAX + 20))} aria-invalid={form.bio.length > BIO_MAX} />
            <p className="mt-1.5 text-xs text-fg-subtle">Shown on your profile card when teammates hover your name.</p>
          </div>
        </div>
      </Section>

      <FloatingBar open={dirty}>
        <span className="relative mr-1 flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-warning opacity-60" />
          <span className="relative size-2 rounded-full bg-warning" />
        </span>
        <span className="mr-3 text-[13px] whitespace-nowrap text-fg-muted">Unsaved changes</span>
        <Button variant="ghost" size="xs" onClick={() => setForm(saved)} disabled={saving}>
          Discard
        </Button>
        <Button size="xs" loading={saving} onClick={save} disabled={form.bio.length > BIO_MAX}>
          Save changes
        </Button>
      </FloatingBar>
    </TabBody>
  )
}
