import { Check, Globe, ImagePlus, TriangleAlert } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn, sleep, slugify } from '@/lib/utils'
import { useOnboarding } from '@/store/onboarding'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { Section, TabBody } from './ui'

const REGIONS = [
  { value: 'us', label: 'United States (us-east-1)' },
  { value: 'eu', label: 'European Union (eu-central-1)' },
  { value: 'ap', label: 'Asia Pacific (ap-southeast-1)' },
]

export function WorkspaceTab() {
  const navigate = useNavigate()
  const ob = useOnboarding()
  const initialName = ob.workspace || 'Northwind'
  const [name, setName] = useState(initialName)
  const [slug, setSlug] = useState(ob.slug || slugify(initialName))
  const [region, setRegion] = useState('us')
  const [logo, setLogo] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const file = useRef<HTMLInputElement>(null)
  const slugOk = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$/.test(slug)
  const dirty = name !== initialName || slug !== (ob.slug || slugify(initialName)) || region !== 'us' || !!logo

  const save = async () => {
    setSaving(true)
    await sleep(700)
    ob.update({ workspace: name.trim(), slug })
    setSaving(false)
    setSavedAt(Date.now())
    toast.success('Workspace updated', { description: `dashward.app/${slug}` })
  }

  return (
    <TabBody>
      <Section
        title="General"
        description="The workspace name appears in the sidebar, invites and every shared report."
        footer={
          <>
            <p className="text-xs text-fg-subtle">
              {savedAt ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <Check className="size-3.5" /> All changes saved
                </span>
              ) : (
                'Changing the URL breaks existing shared links.'
              )}
            </p>
            <Button size="sm" loading={saving} disabled={!dirty || !slugOk || !name.trim()} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => file.current?.click()}
              aria-label="Upload workspace logo"
              className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-brand text-2xl font-semibold text-white shadow-elevated outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-accent-fg"
            >
              {logo ? <img src={logo} alt="" className="size-full object-cover" /> : (name.trim()[0] ?? 'N').toUpperCase()}
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ImagePlus className="size-5" />
              </span>
            </button>
            <div>
              <div className="text-sm font-medium">Workspace logo</div>
              <p className="mt-0.5 text-xs text-fg-subtle">Square image, 512 × 512 px recommended.</p>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" size="xs" onClick={() => file.current?.click()}>
                  Upload
                </Button>
                {logo && (
                  <Button variant="ghost" size="xs" onClick={() => setLogo(undefined)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={file}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) setLogo(URL.createObjectURL(f))
              }}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="w-name">Workspace name</Label>
              <Input id="w-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!name.trim()} />
            </div>
            <div>
              <Label>Data region</Label>
              <Select value={region} onValueChange={setRegion} options={REGIONS} className="h-11 w-full rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="w-slug">Workspace URL</Label>
              <div
                className={cn(
                  'flex h-11 items-center overflow-hidden rounded-xl border border-border bg-surface-2/60 text-sm transition-all hover:border-border-strong focus-within:border-accent/60 focus-within:bg-surface focus-within:ring-4 focus-within:ring-ring/20',
                  !slugOk && 'border-danger/60',
                )}
              >
                <span className="flex h-full items-center gap-1.5 border-r border-border bg-surface-3/50 px-3 text-fg-subtle">
                  <Globe className="size-3.5" /> dashward.app/
                </span>
                <input
                  id="w-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 32))}
                  className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-[13px] text-fg outline-none"
                  aria-invalid={!slugOk}
                  aria-describedby="w-slug-help"
                />
                {slugOk && <Check className="mr-3 size-4 text-success" aria-label="Available" />}
              </div>
              <p id="w-slug-help" className={cn('mt-1.5 text-xs', slugOk ? 'text-fg-subtle' : 'text-danger')}>
                {slugOk ? 'Lowercase letters, numbers and dashes.' : 'Use 3–32 lowercase letters, numbers or dashes, not starting or ending with a dash.'}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Danger zone" description="Irreversible actions. Only workspace owners can do this." danger>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-danger/25 bg-danger/10 text-danger">
              <TriangleAlert className="size-4" />
            </span>
            <div>
              <div className="text-sm font-medium">Delete this workspace</div>
              <p className="mt-0.5 text-[13px] text-fg-muted">Permanently deletes 42 dashboards, 7 data sources and 18 months of history.</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            Delete workspace
          </Button>
        </div>
      </Section>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${initialName}?`}
        description="This can’t be undone. Every member loses access immediately, and billing stops at the end of the cycle."
        actionLabel="Delete workspace"
        confirmText={initialName}
        onConfirm={() => {
          toast.success(`${initialName} was scheduled for deletion`, { description: 'This is a demo, so nothing was actually deleted.' })
          navigate('/app')
        }}
      />
    </TabBody>
  )
}
