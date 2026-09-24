import * as A from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <A.Root type="single" collapsible className="divide-y divide-border rounded-2xl border border-border bg-surface/60">
      {items.map((it, i) => (
        <A.Item key={i} value={String(i)} className="group">
          <A.Header>
            <A.Trigger className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium transition hover:text-accent">
              {it.q}
              <Plus className="size-4 shrink-0 text-fg-subtle transition-transform duration-500 ease-out-expo group-data-[state=open]:rotate-135 group-data-[state=open]:text-accent" />
            </A.Trigger>
          </A.Header>
          <A.Content className="overflow-hidden text-sm text-fg-muted data-[state=closed]:animate-[accordion-up_.3s_var(--ease-out-expo)] data-[state=open]:animate-[accordion-down_.4s_var(--ease-out-expo)]">
            <div className="px-6 pb-5 leading-relaxed">{it.a}</div>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  )
}
