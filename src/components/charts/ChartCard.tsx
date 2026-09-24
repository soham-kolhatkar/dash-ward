import type { ReactNode } from 'react'
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown'
import { cn } from '@/lib/utils'

/** Standard dashboard card: title, description, right-side action slot (defaults to a ⋯ menu). */
export function ChartCard({
  title,
  description,
  action,
  icon,
  children,
  className,
  contentClassName,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader className="items-center">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted [&_svg]:size-4">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <CardTitle className="truncate">{title}</CardTitle>
            {description && <CardDescription className="truncate">{description}</CardDescription>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">{action === undefined ? <CardMenu label={String(title)} /> : action}</div>
      </CardHeader>
      <CardContent className={cn('flex-1', contentClassName)}>{children}</CardContent>
    </Card>
  )
}

/** Subtle ⋯ icon button with common card actions. */
export function CardMenu({ label }: { label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label} options`}
        className="flex size-7 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-surface-2 hover:text-fg data-[state=open]:bg-surface-2 data-[state=open]:text-fg"
      >
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => toast.success(`${label} pinned to your dashboard`)}>Pin to dashboard</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast(`Exporting ${label.toLowerCase()} as CSV…`)}>Export CSV</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast('Alert created', { description: `We’ll notify you when ${label.toLowerCase()} changes.` })}>
          Create alert
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Simple legend chip that can toggle a series. */
export function LegendChip({
  color,
  label,
  active = true,
  dashed,
  onClick,
}: {
  color: string
  label: string
  active?: boolean
  dashed?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 text-xs transition',
        onClick && 'hover:border-border hover:bg-surface-2',
        active ? 'text-fg-muted' : 'text-fg-subtle line-through opacity-60',
      )}
    >
      <span
        className="h-0.5 w-3.5 rounded-full"
        style={
          dashed
            ? { backgroundImage: `linear-gradient(90deg, ${color} 55%, transparent 55%)`, backgroundSize: '5px 2px' }
            : { background: color }
        }
      />
      {label}
    </button>
  )
}
