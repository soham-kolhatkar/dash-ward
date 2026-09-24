import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ALL_FILTERS, FILTER_GROUPS, excludedCount, type Filters } from './filters'

export function FiltersPopover({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const excluded = excludedCount(value)
  const toggle = (key: keyof Filters, v: string, on: boolean) =>
    onChange({ ...value, [key]: on ? [...value[key], v] : value[key].filter((x) => x !== v) })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="h-9">
          <SlidersHorizontal /> Filters
          {excluded > 0 && (
            <span className="-mr-1 rounded-full bg-accent px-1.5 font-mono text-[10px] leading-4 text-white tabular-nums dark:text-accent-fg">
              {excluded}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(340px,calc(100vw-2rem))]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium">Filters</span>
          <button
            type="button"
            disabled={!excluded}
            onClick={() => onChange(ALL_FILTERS)}
            className="rounded-md px-1.5 py-1 text-xs text-fg-subtle transition hover:bg-surface-2 hover:text-fg disabled:opacity-40"
          >
            Reset
          </button>
        </div>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
          {FILTER_GROUPS.map((g) => {
            const sel = value[g.key]
            const all = sel.length === g.options.length
            return (
              <fieldset key={g.key}>
                <div className="mb-2 flex items-center justify-between">
                  <legend className="text-[11px] font-medium tracking-wide text-fg-subtle uppercase">{g.label}</legend>
                  <button
                    type="button"
                    onClick={() => onChange({ ...value, [g.key]: all ? [] : g.options.map((o) => o.value) })}
                    className="text-[11px] text-fg-subtle transition hover:text-accent"
                  >
                    {all ? 'Clear' : 'Select all'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {g.options.map((o) => {
                    const id = `f-${g.key}-${o.value}`
                    return (
                      <label
                        key={o.value}
                        htmlFor={id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm text-fg-muted transition hover:bg-surface-2 hover:text-fg"
                      >
                        <Checkbox id={id} checked={sel.includes(o.value)} onCheckedChange={(c) => toggle(g.key, o.value, c === true)} />
                        <span className="truncate">{o.label}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
