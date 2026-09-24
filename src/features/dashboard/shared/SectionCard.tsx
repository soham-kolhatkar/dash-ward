import type { ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Card with the standard header row (icon, title, description, right-side action). */
export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="items-center">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted [&_svg]:size-4">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </CardHeader>
      <div className={cn('flex-1 p-5', bodyClassName)}>{children}</div>
    </Card>
  )
}
