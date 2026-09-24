import * as S from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { popoverSurface } from './dropdown'

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: {
  value?: string
  onValueChange?: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
}) {
  return (
    <S.Root value={value} onValueChange={onValueChange}>
      <S.Trigger
        className={cn(
          'inline-flex h-9 items-center justify-between gap-2 rounded-full border border-border bg-surface-2/60 px-3.5 text-sm text-fg outline-none transition hover:border-border-strong focus-visible:ring-4 focus-visible:ring-ring/20',
          className,
        )}
      >
        <S.Value placeholder={placeholder} />
        <S.Icon>
          <ChevronDown className="size-4 text-fg-subtle" />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content position="popper" sideOffset={6} className={cn(popoverSurface, 'min-w-(--radix-select-trigger-width)')}>
          <S.Viewport>
            {options.map((o) => (
              <S.Item
                key={o.value}
                value={o.value}
                className="relative flex cursor-pointer items-center rounded-lg py-2 pr-8 pl-2.5 text-fg-muted outline-none select-none data-highlighted:bg-surface-2 data-highlighted:text-fg"
              >
                <S.ItemText>{o.label}</S.ItemText>
                <S.ItemIndicator className="absolute right-2.5">
                  <Check className="size-4 text-accent" />
                </S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  )
}
